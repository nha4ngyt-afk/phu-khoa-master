import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const draft = process.argv.includes("--draft");
let bank = [];
for (let t = 1; t <= 6; t++) {
  const p = `content/topic${t}.json`;
  if (!fs.existsSync(p)) {
    if (draft) continue;
    throw Error("Thiếu " + p);
  }
  bank.push(...JSON.parse(fs.readFileSync(p, "utf8")));
}
if (!draft && bank.length < 900)
  throw Error(`Ngân hàng mới có ${bank.length}, cần ít nhất 900 câu.`);
const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(bank))
    .digest("hex")
    .slice(0, 12),
  meta = {
    version: `2026.10-${hash}`,
    count: bank.length,
    topics: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((t) => [
        t,
        bank.filter((q) => q.topic === t).length,
      ]),
    ),
    images: bank.filter((q) => q.images.length).length,
    imageAssets: new Set(
      bank.flatMap((q) => q.images.map((im) => im.assetPath)),
    ).size,
    imageGroups: new Set(
      bank
        .filter((q) => q.images.length)
        .map(
          (q) =>
            q.caseGroup ||
            q.images
              .map((im) => im.id)
              .sort()
              .join("+"),
        ),
    ).size,
    levels: [1, 2, 3, 4].map(
      (level) => bank.filter((q) => q.difficulty === level).length,
    ),
    builtAt: new Date().toISOString(),
    status: draft ? "draft" : "release",
  };
fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync("public/data/bank.json", JSON.stringify(bank));
fs.writeFileSync("public/data/metadata.json", JSON.stringify(meta, null, 2));
console.log(JSON.stringify(meta));
