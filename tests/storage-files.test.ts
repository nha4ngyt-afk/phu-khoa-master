import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { read, write, atomic, clearDB } from "../src/storage";
import {
  toCSV,
  importBank,
  validateHistory,
  historyCSV,
  parseCSV,
} from "../src/files";
import { generate, finish } from "../src/engine";
import { defaultConfig, type Question } from "../src/types";
const q: Question = {
  id: "q1",
  topic: 1,
  section: "S",
  difficulty: 3,
  learningObjective: "Mục tiêu",
  prompt: 'Nội dung có "ngoặc", dấu phẩy\nvà xuống dòng',
  clinicalVignette: "",
  task: "Nhiệm vụ",
  options: ["A", "B", "C", "D"],
  answer: 1,
  explanation: "Đáp án B",
  optionExplanations: ["Sai", "Đúng", "Sai", "Sai"],
  sources: [{ title: "Nguồn", file: "nguon.pdf", page: 1 }],
  images: [],
  reviewStatus: "reviewed",
};
describe("Lưu và sao lưu", () => {
  it("lưu/khôi phục IndexedDB và cập nhật bài+lịch sử trong cùng transaction", async () => {
    await clearDB();
    const active = { id: "test", answers: { q1: 1 }, deadline: 12345 };
    await write("active", active);
    expect(await read("active", null)).toEqual(active);
    await atomic({ active: null, history: [active] });
    expect(await read("active", "x")).toBeNull();
    expect(await read("history", [])).toEqual([active]);
    await clearDB();
  });
  it("JSON và CSV giữ nguyên dữ liệu kể cả ngoặc, dấu phẩy,xuống dòng", () => {
    expect(importBank(JSON.stringify([q])).questions).toEqual([q]);
    const back = importBank(toCSV([q]), true).questions[0];
    expect(back.prompt).toBe(q.prompt);
    expect(back.sources).toEqual(q.sources);
    expect(back.options).toEqual(q.options);
  });
  it("CSV kết quả giữ tên có dấu ngoặc, xuống dòng và vô hiệu công thức bảng tính", () => {
    const a = finish(
      generate(
        [q],
        {
          ...defaultConfig,
          name: '=SUM(1,2)\n"Đoàn"',
          topics: [1],
          count: 1,
          ratios: [0, 0, 100, 0],
          imagePercent: 0,
        },
        "v1",
        [],
        1,
        1000,
      ),
      2000,
    );
    const rows = parseCSV(historyCSV([a]));
    expect(rows[1][1]).toBe("'" + a.config.name);
    expect(rows[1].slice(2)).toEqual(["0", "1", "0", "1"]);
  });
  it("từ chối CSV/JSON lỗi và lịch sử đáp án không hợp lệ", () => {
    expect(() => importBank('"chưa đóng', true)).toThrow();
    expect(() => importBank("{}")).toThrow();
    const a = generate(
      [q],
      {
        ...defaultConfig,
        topics: [1],
        count: 1,
        ratios: [0, 0, 100, 0],
        imagePercent: 0,
      },
      "v1",
      [],
      1,
      1000,
    );
    const done = finish(a, 2000);
    expect(validateHistory([done])).toHaveLength(1);
    expect(() => validateHistory([{ ...done, answers: { q1: 8 } }])).toThrow();
    expect(() => validateHistory([done, done])).toThrow();
  });
});
