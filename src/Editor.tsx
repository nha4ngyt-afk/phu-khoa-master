import { useState } from "react";
import { type Question, topics, levels } from "./types";
export default function Editor({
  value,
  onChange,
  bank,
}: {
  value: string;
  onChange: (s: string) => void;
  bank: Question[];
}) {
  const [advanced, setAdvanced] = useState(false);
  let q: Question;
  try {
    q = JSON.parse(value);
  } catch {
    return (
      <textarea
        aria-label="Dữ liệu JSON câu hỏi"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  function update(p: Partial<Question>) {
    onChange(JSON.stringify({ ...q, ...p }, null, 2));
  }
  function source(k: string, v: string) {
    const sources = structuredClone(q.sources);
    sources[0] = { ...sources[0], [k]: v };
    update({ sources });
  }
  const images = [
    ...new Map(bank.flatMap((q) => q.images).map((im) => [im.id, im])).values(),
  ];
  return (
    <>
      <button className="text-link" onClick={() => setAdvanced(!advanced)}>
        {advanced ? "← Trở về biểu mẫu" : "Chỉnh JSON nâng cao"}
      </button>
      {advanced ? (
        <textarea
          aria-label="Dữ liệu JSON câu hỏi"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <div className="editor-form">
          <div className="form-row">
            <label>
              ID câu hỏi
              <input
                value={q.id}
                onChange={(e) => update({ id: e.target.value })}
              />
            </label>
            <label>
              Topic
              <select
                value={q.topic}
                onChange={(e) => update({ topic: Number(e.target.value) })}
              >
                {topics.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.id}. {t.short}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Chủ đề nhỏ
              <input
                value={q.section}
                onChange={(e) => update({ section: e.target.value })}
              />
            </label>
            <label>
              Mức độ
              <select
                value={q.difficulty}
                onChange={(e) => update({ difficulty: Number(e.target.value) })}
              >
                {levels.map((l, i) => (
                  <option value={i + 1} key={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Mục tiêu học tập
            <input
              value={q.learningObjective}
              onChange={(e) => update({ learningObjective: e.target.value })}
            />
          </label>
          <label>
            Tình huống lâm sàng
            <textarea
              value={q.clinicalVignette}
              onChange={(e) =>
                update({
                  clinicalVignette: e.target.value,
                  prompt: e.target.value + "\n\n" + q.task,
                })
              }
            />
          </label>
          <label>
            Yêu cầu đề bài
            <textarea
              value={q.task}
              onChange={(e) =>
                update({
                  task: e.target.value,
                  prompt: q.clinicalVignette + "\n\n" + e.target.value,
                })
              }
            />
          </label>
          <details>
            <summary>Nội dung hiển thị đầy đủ</summary>
            <textarea
              value={q.prompt}
              onChange={(e) => update({ prompt: e.target.value })}
            />
          </details>
          <fieldset>
            <legend>Bốn phương án và giải thích</legend>
            {q.options.map((o, i) => (
              <div className="editor-option" key={i}>
                <label className="check-line">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={q.answer === i}
                    onChange={() => update({ answer: i })}
                  />
                  Phương án {"ABCD"[i]} · chọn nếu đúng
                </label>
                <input
                  aria-label={`Phương án ${"ABCD"[i]}`}
                  value={o}
                  onChange={(e) =>
                    update({
                      options: q.options.map((x, j) =>
                        i === j ? e.target.value : x,
                      ),
                    })
                  }
                />
                <textarea
                  aria-label={`Giải thích phương án ${"ABCD"[i]}`}
                  value={q.optionExplanations[i]}
                  onChange={(e) =>
                    update({
                      optionExplanations: q.optionExplanations.map((x, j) =>
                        i === j ? e.target.value : x,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </fieldset>
          <label>
            Lời giải tổng quát
            <textarea
              value={q.explanation}
              onChange={(e) => update({ explanation: e.target.value })}
            />
          </label>
          <fieldset>
            <legend>Nguồn đối chiếu chính</legend>
            <label>
              Tên tài liệu / tổ chức
              <input
                value={q.sources[0]?.title || ""}
                onChange={(e) => source("title", e.target.value)}
              />
            </label>
            <div className="form-row">
              <label>
                Tệp trong thư mục
                <input
                  value={q.sources[0]?.file || ""}
                  onChange={(e) => source("file", e.target.value)}
                />
              </label>
              <label>
                Trang PDF
                <input
                  type="number"
                  value={q.sources[0]?.page || ""}
                  onChange={(e) => {
                    const sources = structuredClone(q.sources);
                    sources[0] = {
                      ...sources[0],
                      page: Number(e.target.value),
                    };
                    update({ sources });
                  }}
                />
              </label>
            </div>
            <label>
              Liên kết nguồn chính thức
              <input
                value={q.sources[0]?.url || ""}
                onChange={(e) => source("url", e.target.value)}
              />
            </label>
            <label>
              Phiên bản / năm
              <input
                value={q.sources[0]?.year || ""}
                onChange={(e) => source("year", e.target.value)}
              />
            </label>
            <label>
              Trích đoạn xác minh
              <textarea
                value={q.sources[0]?.evidence || ""}
                onChange={(e) => source("evidence", e.target.value)}
              />
            </label>
            <p className="hint">
              Các nguồn bổ sung hiện có được giữ nguyên. Có thể thêm nguồn bằng
              mục JSON nâng cao.
            </p>
          </fieldset>
          <fieldset>
            <legend>Hình ảnh từ thư viện đã có nguồn</legend>
            <select
              value=""
              aria-label="Thêm hình có nguồn"
              onChange={(e) => {
                const im = images.find((im) => im.id === e.target.value);
                if (im && !q.images.some((x) => x.id === im.id))
                  update({ images: [...q.images, im] });
              }}
            >
              <option value="">Chọn hình…</option>
              {images.map((im) => (
                <option key={im.id} value={im.id}>
                  {im.id} · {im.figure || im.license}
                </option>
              ))}
            </select>
            {q.images.map((im) => (
              <div className="editor-image" key={im.id}>
                <img
                  src={import.meta.env.BASE_URL + im.assetPath}
                  alt="Hình được chọn"
                />
                <span>
                  {im.id} · {im.license}
                </span>
                <button
                  onClick={() =>
                    update({ images: q.images.filter((x) => x.id !== im.id) })
                  }
                >
                  Bỏ hình
                </button>
              </div>
            ))}
            {q.images.length > 0 && (
              <label>
                Nguồn gốc tình huống (ca gốc hoặc mô phỏng)
                <textarea
                  value={q.caseProvenance || ""}
                  onChange={(e) => update({ caseProvenance: e.target.value })}
                />
              </label>
            )}
          </fieldset>
        </div>
      )}
    </>
  );
}
