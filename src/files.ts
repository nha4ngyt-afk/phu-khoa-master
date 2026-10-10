import { type Question, type Attempt } from "./types";
import { validateBank, validateQuestion, validateConfig } from "./engine";
export function download(
  name: string,
  value: unknown,
  type = "application/json",
) {
  const body =
      typeof value === "string" ? value : JSON.stringify(value, null, 2),
    url = URL.createObjectURL(new Blob([body], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function toCSV(bank: Question[]) {
  const keys = [
    "id",
    "topic",
    "section",
    "difficulty",
    "learningObjective",
    "clinicalVignette",
    "task",
    "prompt",
    "options",
    "answer",
    "explanation",
    "optionExplanations",
    "sources",
    "images",
    "caseGroup",
    "caseProvenance",
    "reviewStatus",
  ];
  const escape = (v: unknown) =>
    '"' +
    String(typeof v === "object" ? JSON.stringify(v) : (v ?? "")).replace(
      /"/g,
      '""',
    ) +
    '"';
  return (
    keys.join(",") +
    "\r\n" +
    bank
      .map((q) =>
        keys
          .map((k) => escape((q as unknown as Record<string, unknown>)[k]))
          .join(","),
      )
      .join("\r\n")
  );
}
export function historyCSV(history: Attempt[]) {
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[\s]*[=+@-]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  return (
    "\uFEFFThoiGian,Ten,SoDung,TongCau,Sai,BoTrong\r\n" +
    history
      .map((a) => {
        const correct = a.questions.filter(
            (q) => a.answers[q.id] === q.answer,
          ).length,
          blank = a.questions.filter(
            (q) => a.answers[q.id] === undefined,
          ).length;
        return [
          new Date(a.submittedAt!).toLocaleString("vi-VN"),
          a.config.name,
          correct,
          a.questions.length,
          a.questions.length - correct - blank,
          blank,
        ]
          .map(cell)
          .join(",");
      })
      .join("\r\n")
  );
}
export function parseCSV(s: string) {
  const rows: string[][] = [],
    row: string[] = [];
  let v = "",
    quoted = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"') {
      if (quoted && s[i + 1] === '"') {
        v += '"';
        i++;
      } else quoted = !quoted;
    } else if (!quoted && (c === "," || c === "\n")) {
      row.push(v.replace(/\r$/, ""));
      v = "";
      if (c === "\n") {
        rows.push([...row]);
        row.length = 0;
      }
    } else v += c;
  }
  if (quoted) throw Error("CSV có dấu ngoặc kép chưa đóng.");
  if (v || row.length) {
    row.push(v.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}
export async function readFile(file: File, limitMB = 10) {
  if (file.size > limitMB * 1024 * 1024)
    throw Error(`Tệp quá lớn. Giới hạn ${limitMB} MB.`);
  return (await file.text()).replace(/^\uFEFF/, "");
}
export function importBank(text: string, isCsv = false) {
  if (!isCsv) return validateBank(JSON.parse(text));
  const [keys, ...rows] = parseCSV(text),
    values = rows
      .filter((r) => r.some(Boolean))
      .map((row) =>
        Object.fromEntries(
          keys.map((k, i) => {
            let v: unknown = row[i] ?? "";
            if (["topic", "difficulty", "answer"].includes(k)) v = Number(v);
            if (
              ["options", "optionExplanations", "sources", "images"].includes(k)
            )
              v = JSON.parse(String(v) || "[]");
            return [k, v];
          }),
        ),
      );
  return validateBank(values);
}
export function validateHistory(value: unknown): Attempt[] {
  if (!Array.isArray(value) || value.length > 2000)
    throw Error("Lịch sử không hợp lệ.");
  for (const a of value) {
    if (
      !a ||
      typeof a.id !== "string" ||
      a.status !== "submitted" ||
      !Number.isFinite(a.startedAt) ||
      !Number.isFinite(a.submittedAt) ||
      a.submittedAt < a.startedAt ||
      !Array.isArray(a.questions) ||
      !a.questions.length ||
      a.questions.length > 900 ||
      !a.answers ||
      typeof a.answers !== "object"
    )
      throw Error("Bản ghi lịch sử không hợp lệ.");
    validateConfig(a.config);
    if (a.questions.length !== a.config.count)
      throw Error("Số câu trong lịch sử không khớp cấu hình.");
    const ids = new Set<string>();
    for (const q of a.questions) {
      const order = q.order;
      validateQuestion(q);
      if (
        ids.has(q.id) ||
        !Array.isArray(order) ||
        order.length !== 4 ||
        new Set(order).size !== 4 ||
        order.some(
          (n: unknown) =>
            !Number.isInteger(n) || Number(n) < 0 || Number(n) > 3,
        )
      )
        throw Error("Câu hỏi lịch sử không hợp lệ.");
      ids.add(q.id);
    }
    for (const [id, v] of Object.entries(a.answers))
      if (
        !ids.has(id) ||
        !Number.isInteger(v) ||
        Number(v) < 0 ||
        Number(v) > 3
      )
        throw Error("Đáp án trong lịch sử không hợp lệ.");
  }
  if (new Set(value.map((a) => a.id)).size !== value.length)
    throw Error("Lịch sử có ID trùng.");
  return value as Attempt[];
}
