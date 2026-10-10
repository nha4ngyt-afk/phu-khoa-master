import fs from "node:fs";
import crypto from "node:crypto";
const bank = JSON.parse(fs.readFileSync("public/data/bank.json", "utf8")),
  errors = [],
  warnings = [],
  ids = new Set(),
  prompts = new Map(),
  images = new Map(),
  caseGroups = new Set(),
  assetGroups = new Map(),
  byTopic = {};
if (bank.length < 900) errors.push(`Chỉ có ${bank.length} câu; cần>=900.`);
for (const q of bank) {
  if (ids.has(q.id)) errors.push(`ID trùng ${q.id}`);
  ids.add(q.id);
  const n = q.prompt
    ?.normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (prompts.has(n)) errors.push(`Câu dẫn trùng ${q.id}/${prompts.get(n)}`);
  prompts.set(n, q.id);
  for (const k of [
    "id",
    "section",
    "learningObjective",
    "prompt",
    "task",
    "explanation",
  ])
    if (!q[k]?.trim()) errors.push(`${q.id}:thiếu ${k}`);
  if (q.reviewStatus !== "reviewed") errors.push(`${q.id}:chưa reviewed`);
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 4)
    errors.push(`${q.id}:mức độ sai`);
  if (
    !Array.isArray(q.options) ||
    q.options.length !== 4 ||
    new Set(q.options).size !== 4 ||
    !Number.isInteger(q.answer) ||
    q.answer < 0 ||
    q.answer > 3
  )
    errors.push(`${q.id}:lựa chọn sai`);
  if (
    q.optionExplanations?.length !== 4 ||
    q.optionExplanations.some((x) => !x?.trim())
  )
    errors.push(`${q.id}:thiếu lời giải phương án`);
  if (
    !q.sources?.length ||
    q.sources.some((s) => !s.title || (!s.url && !s.file))
  )
    errors.push(`${q.id}:thiếu nguồn`);
  const t = (byTopic[q.topic] ??= {
    total: 0,
    levels: [0, 0, 0, 0],
    images: 0,
  });
  t.total++;
  t.levels[q.difficulty - 1]++;
  if (q.images?.length) {
    t.images++;
    const group =
      q.caseGroup ||
      q.images
        .map((im) => im.id)
        .sort()
        .join("+");
    caseGroups.add(group);
    if (
      typeof q.clinicalVignette !== "string" ||
      q.clinicalVignette.trim().length < 40 ||
      !q.task?.trim() ||
      !q.caseProvenance
    )
      errors.push(`${q.id}:thiếu bệnh cảnh/nhiệm vụ/nguồn gốc ca`);
    for (const im of q.images) {
      if (
        assetGroups.has(im.assetPath) &&
        assetGroups.get(im.assetPath) !== group
      )
        errors.push(
          `${q.id}:cùng ảnh ${im.assetPath} có nhiều caseGroup; có thể lặp ảnh trong đề.`,
        );
      assetGroups.set(im.assetPath, group);
      if (
        !/^images\/[\w.-]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(im.assetPath) ||
        !fs.existsSync("public/" + im.assetPath)
      )
        errors.push(`${q.id}:ảnh không tồn tại ${im.assetPath}`);
      if (
        !im.sourceUrl ||
        !im.credit ||
        !im.license ||
        !/CC BY/i.test(im.license)
      )
        errors.push(`${q.id}:quyền sử dụng hình chưa rõ`);
      images.set(im.id, im);
    }
  }
}
for (let t = 1; t <= 6; t++) {
  const a = byTopic[t];
  if (!a || a.total < 150) errors.push(`Topic${t}:cần>=150.`);
  if (a && a.levels.some((n, i) => n < (i < 2 ? 15 : 60)))
    errors.push(`Topic${t}:thiếu ma trận mức độ ${a.levels}`);
}
// Similar stems are candidates for manual semantic review, never an automatic quality pass.
const words = (s) =>
  new Set(
    s
      .normalize("NFC")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
const signatures = bank.map((q) => words(q.prompt));
const near = [];
for (let i = 0; i < bank.length; i++)
  for (let j = i + 1; j < bank.length; j++) {
    if (bank[i].topic !== bank[j].topic) continue;
    const a = signatures[i],
      b = signatures[j];
    if (Math.abs(a.size - b.size) > Math.max(a.size, b.size) * 0.15) continue;
    let same = 0;
    for (const w of a) if (b.has(w)) same++;
    const ratio = same / (a.size + b.size - same);
    if (ratio > 0.83)
      near.push({
        a: bank[i].id,
        b: bank[j].id,
        similarity: +ratio.toFixed(3),
      });
  }
const report = {
  count: bank.length,
  byTopic,
  imageQuestions: bank.filter((q) => q.images?.length).length,
  uniqueImageAssets: assetGroups.size,
  uniqueImageGroups: caseGroups.size,
  errors,
  nearDuplicateCandidates: near,
  warnings,
  sha256: crypto
    .createHash("sha256")
    .update(JSON.stringify(bank))
    .digest("hex"),
  checkedAt: new Date().toISOString(),
  note: "Kiểm tra cấu trúc và tài sản; nội dung và nguồn cần đối chiếu theo các audit riêng. Các cặp gần giống cần rà soát thủ công.",
};
fs.writeFileSync(
  "content/validation-report.json",
  JSON.stringify(report, null, 2),
);
fs.writeFileSync(
  "public/data/image-credits.json",
  JSON.stringify([...images.values()], null, 2),
);
console.log(
  JSON.stringify(
    {
      ...report,
      nearDuplicateCandidates: near.length,
      sha256: report.sha256.slice(0, 12),
    },
    null,
    2,
  ),
);
if (errors.length) process.exit(1);
