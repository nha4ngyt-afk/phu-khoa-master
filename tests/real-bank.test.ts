import fs from "node:fs";
import { describe, it, expect } from "vitest";
import {
  generate,
  grade,
  sharePayload,
  fromShare,
  validateBank,
} from "../src/engine";
import { defaultConfig, type Question } from "../src/types";
const bank = JSON.parse(
  fs.readFileSync("public/data/bank.json", "utf8"),
) as Question[];
describe("Ngân hàng phát hành thực tế", () => {
  it("ít nhất 900 câu, đủ ma trận từng topic, tất cả hình có bệnh cảnh và tệp", () => {
    expect(bank.length).toBeGreaterThanOrEqual(900);
    expect(validateBank(bank).warnings).toEqual([]);
    for (let t = 1; t <= 6; t++) {
      const qs = bank.filter((q) => q.topic === t);
      expect(qs.length).toBeGreaterThanOrEqual(150);
      for (let l = 1; l <= 4; l++)
        expect(
          qs.filter((q) => q.difficulty === l).length,
        ).toBeGreaterThanOrEqual(l < 3 ? 15 : 60);
    }
    for (const q of bank.filter((q) => q.images.length)) {
      expect(q.clinicalVignette.length).toBeGreaterThan(40);
      expect(q.task.length).toBeGreaterThan(0);
      expect(q.caseProvenance).toBeTruthy();
      for (const im of q.images)
        expect(fs.existsSync("public/" + im.assetPath)).toBe(true);
    }
  });
  it("500 đề thật đủ 90 câu, 15/topic, 9–9–36–36 và 18 nhóm hình khác nhau", () => {
    for (let seed = 0; seed < 500; seed++) {
      const a = generate(bank, defaultConfig, "actual", [], seed, 1000);
      expect(a.questions.length).toBe(90);
      expect(new Set(a.questions.map((q) => q.id)).size).toBe(90);
      for (let t = 1; t <= 6; t++)
        expect(a.questions.filter((q) => q.topic === t).length).toBe(15);
      expect(
        [1, 2, 3, 4].map(
          (l) => a.questions.filter((q) => q.difficulty === l).length,
        ),
      ).toEqual([9, 9, 36, 36]);
      const image = a.questions.filter((q) => q.images.length);
      expect(image.length).toBe(18);
      expect(
        new Set(
          image.map(
            (q) =>
              q.caseGroup ||
              q.images
                .map((im) => im.id)
                .sort()
                .join("|"),
          ),
        ).size,
      ).toBe(18);
      const assetPaths = image.flatMap((q) =>
        q.images.map((im) => im.assetPath),
      );
      expect(new Set(assetPaths).size).toBe(assetPaths.length);
      for (const q of a.questions) a.answers[q.id] = q.answer;
      expect(grade(a)).toEqual({ correct: 90, total: 90, wrong: 0, blank: 0 });
    }
  });
  it("chia sẻ đúng đề thật khi lịch sử làm bài khác nhau", () => {
    const a = generate(bank, defaultConfig, "actual", [], 777);
    const b = generate(bank, defaultConfig, "actual", [a], 778);
    const shared = fromShare(sharePayload(b), bank, "actual");
    expect(shared.questions.map((q) => q.id)).toEqual(
      b.questions.map((q) => q.id),
    );
    expect(shared.questions.map((q) => q.order)).toEqual(
      b.questions.map((q) => q.order),
    );
  });
});
