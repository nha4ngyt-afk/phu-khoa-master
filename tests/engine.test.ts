import { describe, it, expect } from "vitest";
import {
  generate,
  allocate,
  grade,
  remaining,
  finish,
  replay,
  sharePayload,
  fromShare,
  validateBank,
  validateQuestion,
} from "../src/engine";
import { defaultConfig, type Question, type Attempt } from "../src/types";
const make = (
  topic: number,
  level: number,
  i: number,
  image = false,
): Question => ({
  id: `T${topic}-L${level}-${i}`,
  topic,
  section: `S${topic}`,
  difficulty: level,
  learningObjective: "Kiểm thử thuật toán",
  prompt: `Câu độc lập ${topic}-${level}-${i}`,
  clinicalVignette: image
    ? "Bệnh cảnh lâm sàng dùng kiểm thử có đủ dữ kiện và thời gian cụ thể."
    : "",
  task: "Nhiệm vụ",
  options: ["Đúng", "Sai 1", "Sai 2", "Sai 3"],
  answer: 0,
  explanation: "Giải thích",
  optionExplanations: ["Đúng vì…", "Sai vì…", "Sai vì…", "Sai vì…"],
  sources: [{ title: "Nguồn kiểm thử", file: "test.pdf", page: 1 }],
  images: image
    ? [
        {
          id: `im-${topic}-${level}-${i}`,
          assetPath: "images/test.png",
          sourceUrl: "https://example.org/test",
          credit: "Tác giả",
          license: "CC BY 4.0",
        },
      ]
    : [],
  caseProvenance: image ? "Bệnh cảnh mô phỏng cho kiểm thử" : "",
  reviewStatus: "reviewed",
});
const bank: Question[] = [];
for (let t = 1; t <= 6; t++)
  for (let l = 1; l <= 4; l++)
    for (let i = 0; i < (l <= 2 ? 15 : 60); i++)
      bank.push(
        make(t, l, i, (t === 1 || t === 3 || t === 4) && l >= 3 && i < 25),
      );
describe("Tạo đề và chấm đúng theo dữ liệu", () => {
  it("làm tròn đúng tổng với tỉ lệ lẻ", () => {
    expect(allocate(7, [10, 10, 40, 40])).toEqual([1, 0, 3, 3]);
    expect(allocate(91, [1, 1, 1, 1, 1, 1]).reduce((a, b) => a + b, 0)).toBe(
      91,
    );
  });
  it("100 seed giữ đúng 90,15/topic,9/9/36/36,18 hình,không lặp", () => {
    for (let s = 1; s <= 100; s++) {
      const a = generate(bank, defaultConfig, "v1", [], s, 1000);
      expect(a.questions.length).toBe(90);
      expect(new Set(a.questions.map((q) => q.id)).size).toBe(90);
      for (let t = 1; t <= 6; t++)
        expect(a.questions.filter((q) => q.topic === t).length).toBe(15);
      expect(
        [1, 2, 3, 4].map(
          (l) => a.questions.filter((q) => q.difficulty === l).length,
        ),
      ).toEqual([9, 9, 36, 36]);
      expect(a.questions.filter((q) => q.images.length).length).toBe(18);
      expect(a.deadline).toBe(5401000);
      expect(
        a.questions.every((q) => [...q.order].sort().join("") === "0123"),
      ).toBe(true);
    }
  });
  it("giữ bộ câu cùng seed và ưu tiên câu ít gặp khi tạo đề mới", () => {
    const a = generate(bank, defaultConfig, "v1", [], 22),
      b = generate(bank, defaultConfig, "v1", [], 22),
      c = generate(bank, defaultConfig, "v1", [a], 23);
    expect(a.questions.map((q) => q.id)).toEqual(b.questions.map((q) => q.id));
    expect(
      c.questions.filter((q) => a.questions.some((x) => x.id === q.id)).length,
    ).toBeLessThan(20);
  });
  it("lọc đúng topic và chủ đề, không tự mở phạm vi", () => {
    const c = {
      ...defaultConfig,
      topics: [6],
      sections: ["S6"],
      count: 20,
      imagePercent: 0,
    };
    const a = generate(bank, c, "v1", [], 1);
    expect(a.questions.every((q) => q.topic === 6 && q.section === "S6")).toBe(
      true,
    );
    expect(() =>
      generate(bank, { ...c, sections: ["Không có"] }, "v1"),
    ).toThrow();
    expect(() => generate(bank, { ...c, imagePercent: 20 }, "v1")).toThrow();
  });
  it("từ chối tỉ lệ/số lượng không hợp lệ", () => {
    expect(() =>
      generate(bank, { ...defaultConfig, ratios: [10, 10, 40, 39] }, "v1"),
    ).toThrow();
    expect(() =>
      generate(bank, { ...defaultConfig, count: 901 }, "v1"),
    ).toThrow();
  });
  it("chấm đúng sau trộn phương án, tách sai và bỏ trống,không có thang điểm", () => {
    let a = generate(bank, defaultConfig, "v1", [], 7);
    a.answers[a.questions[0].id] =
      a.questions[0].order[a.questions[0].order.indexOf(a.questions[0].answer)];
    a.answers[a.questions[1].id] = (a.questions[1].answer + 1) % 4;
    expect(grade(a)).toEqual({ correct: 1, wrong: 1, blank: 88, total: 90 });
    expect(grade(a)).not.toHaveProperty("score");
  });
  it("deadline liên tục sau serialize/reload,hoàn tất một lần", () => {
    const a = generate(bank, defaultConfig, "v1", [], 5, 1000),
      restored = JSON.parse(JSON.stringify(a));
    expect(remaining(restored, 999)).toBe(5400000);
    expect(remaining(restored, 61000)).toBe(5340000);
    expect(remaining(restored, 99999999)).toBe(0);
    const done = finish(restored, 99999999, "quá hạn");
    expect(done.submittedAt).toBe(a.deadline);
    expect(finish(done)).toBe(done);
  });
  it("practice không hạn giờ, ôn sai chỉ dùng câu sai/bỏ trống", () => {
    const a = generate(
      bank,
      { ...defaultConfig, mode: "practice" },
      "v1",
      [],
      4,
      1,
    );
    expect(remaining(a)).toBeNull();
    a.answers[a.questions[0].id] = a.questions[0].answer;
    const r = replay(finish(a, 10), "v1", true);
    expect(r.questions.length).toBe(89);
    expect(r.questions.some((q) => q.id === a.questions[0].id)).toBe(false);
    expect(r.deadline).toBeNull();
  });
  it("chia sẻ không tên/đáp án và phục hồi đúng bộ câu/thứ tự", () => {
    const a = generate(
        bank,
        { ...defaultConfig, name: "Tên riêng" },
        "v1",
        [],
        2,
      ),
      p = sharePayload(a),
      s = JSON.stringify(p);
    expect(s).not.toContain("Tên riêng");
    expect(s).not.toContain("correctAnswer");
    expect(s).not.toContain("explanation");
    const b = fromShare(p, bank, "v1");
    expect(b.questions.map((q) => [q.id, q.order])).toEqual(
      a.questions.map((q) => [q.id, q.order]),
    );
    expect(() => fromShare(p, bank, "v2")).toThrow();
  });
  it("từ chối ID trùng và ảnh thiếu bệnh cảnh/nguồn", () => {
    expect(() => validateBank([bank[0], bank[0]])).toThrow();
    const image = bank.find((q) => q.images.length)!;
    expect(() =>
      validateQuestion({ ...image, clinicalVignette: "" }),
    ).toThrow();
    expect(() =>
      validateQuestion({
        ...image,
        images: [{ ...image.images[0], assetPath: "../private.png" }],
      }),
    ).toThrow();
    expect(() =>
      validateQuestion({
        ...bank[0],
        sources: [{ title: "x", url: "javascript:alert(1)" }],
      }),
    ).toThrow();
  });
});
