import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import katex from "katex";
import "katex/dist/katex.min.css";
import {
  type Question,
  type Config,
  type Attempt,
  type Metadata,
  topics,
  levels,
  defaultConfig,
} from "./types";
import {
  generate,
  grade,
  remaining,
  finish,
  replay,
  validateBank,
  validateQuestion,
  safeUrl,
  sharePayload,
  fromShare,
} from "./engine";
import { read, write, atomic, clearDB } from "./storage";
import {
  download,
  toCSV,
  readFile,
  importBank,
  validateHistory,
  historyCSV,
} from "./files";
const base = import.meta.env.BASE_URL;
const date = (n: number) =>
  new Date(n).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
const clock = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};
const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));
async function preloadImages(questions: Question[]) {
  await Promise.all(
    [
      ...new Set(questions.flatMap((q) => q.images.map((im) => im.assetPath))),
    ].map(
      (path) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () =>
            reject(
              Error(
                "Không tải được hình " +
                  path +
                  ". Hãy kiểm tra kết nối hoặc ngân hàng trước khi bắt đầu.",
              ),
            );
          img.src = base + path;
        }),
    ),
  );
}
function Text({ text }: { text: string }) {
  const parts = text.split(/(\\\([\s\S]*?\\\))/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("\\(") ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(p.slice(2, -2), {
                throwOnError: false,
                trust: false,
                strict: "warn",
              }),
            }}
          />
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}
function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3z" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    plus: (
      <>
        <path d="M12 4v16M4 12h16" />
      </>
    ),
    bank: (
      <>
        <path d="M4 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4zM14 7a3 3 0 0 1 3-3h4v15h-3a4 4 0 0 0-4 2" />
      </>
    ),
    history: (
      <>
        <path d="M4 9a9 9 0 1 1 1 10M4 3v6h6M12 7v5l3 2" />
      </>
    ),
    stats: (
      <>
        <path d="M4 20h17M7 16V9M13 16V4M19 16v-5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="m9 3 1-1h4l1 1 1 3 3 1 2 3v4l-2 3-3 1-1 3H9l-1-3-3-1-2-3v-4l2-3 3-1z" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    flag: (
      <>
        <path d="M5 22V3h14l-3 5 3 5H5" />
      </>
    ),
    check: <path d="m4 12 5 5L20 6" />,
    close: <path d="m5 5 14 14M5 19 19 5" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8" cy="8" r="1" />
        <path d="m4 18 5-6 4 4 4-7 4 9" />
      </>
    ),
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.grid}
    </svg>
  );
}
const nav = [
  ["home", "Trang chủ"],
  ["subjects", "Tất cả topic"],
  ["create", "Tạo đề kiểm tra"],
  ["bank", "Ngân hàng câu hỏi"],
  ["history", "Lịch sử làm bài"],
  ["stats", "Thống kê kết quả"],
  ["settings", "Cài đặt"],
];
function Figures({ q, onZoom }: { q: Question; onZoom: (s: string) => void }) {
  return q.images.length ? (
    <div className="figures">
      {q.images.map((im, i) => (
        <figure key={im.id}>
          <button
            className="image-button"
            onClick={() => onZoom(base + im.assetPath)}
            aria-label={`Phóng to hình ${i + 1}`}
          >
            <img
              src={base + im.assetPath}
              alt={`Hình ${i + 1} của tình huống lâm sàng`}
              onError={(e) => {
                e.currentTarget.alt =
                  "Ảnh chưa tải được. Hãy tải lại; không trả lời khi thiếu hình.";
              }}
            />
            <span>
              <Icon name="image" /> Phóng to hình {i + 1}
            </span>
          </button>
        </figure>
      ))}
    </div>
  ) : null;
}
function Explanation({ q, answer }: { q: Question; answer?: number }) {
  return (
    <div className="explanation">
      <div className="answer-label">Đáp án đúng: {q.options[q.answer]}</div>
      <p>
        <Text text={q.explanation} />
      </p>
      <div className="option-reasons">
        {q.options.map((o, i) => (
          <p key={i}>
            <strong>{o}:</strong> <Text text={q.optionExplanations[i]} />
            {i === answer && <em> · Bạn đã chọn</em>}
          </p>
        ))}
      </div>
      <details>
        <summary>Nguồn đối chiếu & quyền sử dụng hình</summary>
        {q.sources.map((s, i) => (
          <div className="source" key={i}>
            <strong>{s.title}</strong>
            {s.year && <span> · {s.year}</span>}
            {s.page && <span> · Trang PDF {s.page}</span>}
            {s.file && (
              <p className="muted">Tài liệu trong thư mục: {s.file}</p>
            )}
            {s.evidence && <blockquote>{s.evidence}</blockquote>}
            {s.url && safeUrl(s.url) && (
              <a
                href={safeUrl(s.url)!}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mở nguồn chính thức ↗
              </a>
            )}
          </div>
        ))}
        {q.images.map((im) => (
          <div className="source" key={im.id}>
            <strong>{im.figure || "Hình lâm sàng"}</strong>
            <p>{im.credit}</p>
            <p>
              {im.license}{" "}
              {im.licenseUrl && safeUrl(im.licenseUrl) && (
                <a
                  href={im.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Giấy phép ↗
                </a>
              )}
            </p>
            <a href={im.sourceUrl} target="_blank" rel="noopener noreferrer">
              Nguồn hình ↗
            </a>
          </div>
        ))}
      </details>
    </div>
  );
}
export default function App() {
  const [bank, setBank] = useState<Question[]>([]),
    [meta, setMeta] = useState<Metadata | null>(null),
    [history, setHistory] = useState<Attempt[]>([]),
    [attempt, setAttempt] = useState<Attempt | null>(null),
    [result, setResult] = useState<Attempt | null>(null),
    [route, setRoute] = useState(
      location.hash.slice(1).split("?")[0] || "home",
    );
  const [config, setConfig] = useState<Config>(structuredClone(defaultConfig)),
    [loading, setLoading] = useState(true),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(""),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(""),
    [topicFilter, setTopicFilter] = useState(0),
    [levelFilter, setLevelFilter] = useState(0),
    [imageFilter, setImageFilter] = useState(false),
    [page, setPage] = useState(0),
    [zoom, setZoom] = useState(""),
    [editor, setEditor] = useState(""),
    [editingId, setEditingId] = useState(""),
    [pendingSubmit, setPendingSubmit] = useState(""),
    [shareLink, setShareLink] = useState(""),
    [onlyUnanswered, setOnlyUnanswered] = useState(false),
    [dark, setDark] = useState(() => {
      try {
        return localStorage.getItem("pk-theme") === "dark";
      } catch {
        return false;
      }
    }),
    [now, setNow] = useState(Date.now());
  const attemptRef = useRef<Attempt | null>(null),
    historyRef = useRef<Attempt[]>([]),
    saveQueue = useRef(Promise.resolve()),
    startingRef = useRef(false),
    originalBankRef = useRef<Question[]>([]),
    fileRef = useRef<HTMLInputElement>(null),
    backupRef = useRef<HTMLInputElement>(null);
  attemptRef.current = attempt;
  historyRef.current = history;
  function go(r: string) {
    location.hash = r;
    setRoute(r);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function fail(e: unknown) {
    setError(errorText(e));
  }
  function persist(a: Attempt, h?: Attempt[]) {
    setSaved("Đang lưu…");
    saveQueue.current = saveQueue.current
      .catch(() => {})
      .then(async () => {
        await atomic(
          h
            ? { active: a.status === "active" ? a : null, history: h }
            : { active: a },
        );
        setSaved("Đã lưu trên thiết bị");
      })
      .catch((e) => {
        setSaved("Lưu chưa thành công");
        fail(
          `Không thể lưu bài. Hãy xuất bản sao lưu trước khi rời trang. ${errorText(e)}`,
        );
      });
  }
  function setActive(a: Attempt) {
    setAttempt(a);
    attemptRef.current = a;
    persist(a);
  }
  function submit(reason = "Bạn đã nộp bài") {
    setPendingSubmit("");
    const active = attemptRef.current;
    if (!active || active.status !== "active") return;
    const done = finish(active, Date.now(), reason),
      h = [done, ...historyRef.current.filter((x) => x.id !== done.id)];
    setHistory(h);
    historyRef.current = h;
    setAttempt(null);
    attemptRef.current = null;
    setResult(done);
    persist(done, h);
    setNotice(reason);
    go("result");
  }
  useEffect(() => {
    const f = () => setRoute(location.hash.slice(1).split("?")[0] || "home");
    window.addEventListener("hashchange", f);
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => {
      window.removeEventListener("hashchange", f);
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("pk-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [br, mr] = await Promise.all([
          fetch(base + "data/bank.json"),
          fetch(base + "data/metadata.json"),
        ]);
        if (!br.ok || !mr.ok)
          throw Error(
            "Chưa tải được ngân hàng câu hỏi. Kiểm tra kết nối và tải lại.",
          );
        const original = validateBank(await br.json()).questions,
          m = (await mr.json()) as Metadata;
        if (cancelled) return;
        let local: Question[] | null = null,
          h: Attempt[] = [],
          a: Attempt | null = null;
        try {
          [local, h, a] = await Promise.all([
            read<Question[] | null>("bank", null),
            read<Attempt[]>("history", []),
            read<Attempt | null>("active", null),
          ]);
        } catch (e) {
          fail(
            `Bộ nhớ trên thiết bị chưa khả dụng. Bài làm sẽ chưa được bảo vệ khi tải lại. ${errorText(e)}`,
          );
        }
        originalBankRef.current = original;
        const selected = local ? validateBank(local).questions : original;
        setBank(selected);
        setMeta(m);
        setHistory(h);
        historyRef.current = h;
        if (a?.status === "active") {
          if (remaining(a) === 0) {
            const done = finish(a, Date.now(), "Bài quá hạn khi mở lại"),
              hh = [done, ...h.filter((x) => x.id !== a.id)];
            setHistory(hh);
            historyRef.current = hh;
            setResult(done);
            await atomic({ active: null, history: hh }).catch(fail);
            go("result");
          } else {
            setAttempt(a);
            attemptRef.current = a;
            setNotice("Đã khôi phục bài đang làm và thời hạn ban đầu.");
          }
        }
        const share = new URLSearchParams(
          location.hash.split("?")[1] || "",
        ).get("share");
        if (share) {
          try {
            const bytes = Uint8Array.from(
              atob(share.replace(/-/g, "+").replace(/_/g, "/")),
              (c) => c.charCodeAt(0),
            );
            const shared = JSON.parse(new TextDecoder().decode(bytes));
            if (a?.status === "active" && remaining(a) !== 0)
              setNotice(
                "Có bài đang làm. Hoàn tất bài trước khi mở đề chia sẻ.",
              );
            else {
              const imported = fromShare(shared, original, m.version);
              await preloadImages(imported.questions);
              if (cancelled) return;
              const openedAt = Date.now();
              imported.startedAt = openedAt;
              imported.deadline =
                imported.config.mode === "exam"
                  ? openedAt + imported.config.minutes * 60000
                  : null;
              setAttempt(imported);
              attemptRef.current = imported;
              persist(imported);
              go("quiz");
            }
          } catch (e) {
            fail(e);
          }
        }
      } catch (e) {
        fail(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (attempt?.status === "active" && remaining(attempt, now) === 0)
      submit("Đã hết thời gian làm bài. Bài được tự động hoàn tất.");
  }, [now, attempt?.id]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (attemptRef.current && saved === "Đang lưu…") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saved]);
  async function start(c = config) {
    if (startingRef.current) return;
    startingRef.current = true;
    try {
      if (attemptRef.current) {
        go("quiz");
        setNotice("Bạn có bài đang làm. Hãy hoàn tất trước khi tạo đề khác.");
        return;
      }
      const a = generate(bank, c, meta!.version, history);
      setNotice("Đang chuẩn bị câu hỏi và hình ảnh…");
      await preloadImages(a.questions);
      const time = Date.now();
      a.startedAt = time;
      a.deadline = c.mode === "exam" ? time + c.minutes * 60000 : null;
      setActive(a);
      setResult(null);
      setError("");
      setNotice("");
      go("quiz");
    } catch (e) {
      fail(e);
    } finally {
      startingRef.current = false;
    }
  }
  function updateAnswer(value: number) {
    const a = attemptRef.current;
    if (!a || a.status !== "active") return;
    if (remaining(a) === 0) {
      submit("Hết thời gian làm bài");
      return;
    }
    const q = a.questions[a.index];
    if (a.checked.includes(q.id)) return;
    setActive({ ...a, answers: { ...a.answers, [q.id]: value } });
  }
  function retry(a: Attempt, wrong = false) {
    try {
      if (attemptRef.current) {
        go("quiz");
        return;
      }
      setActive(replay(a, meta!.version, wrong));
      setResult(null);
      go("quiz");
    } catch (e) {
      fail(e);
    }
  }
  function createFor(topic: number) {
    setConfig({
      ...structuredClone(defaultConfig),
      topics: [topic],
      count: 30,
      imagePercent:
        topic === 6 || topic === 5 || topic === 2 ? 0 : topic === 3 ? 10 : 20,
    });
    go("create");
  }
  function exportBackup() {
    download("phu-khoa-sao-luu.json", {
      format: "phu-khoa-backup",
      version: 1,
      bankVersion: meta?.version,
      bank,
      history,
      active: attemptRef.current,
      exportedAt: new Date().toISOString(),
    });
  }
  async function backupImport(file: File) {
    try {
      const b = JSON.parse(await readFile(file, 50));
      if (b.format !== "phu-khoa-backup" || b.version !== 1)
        throw Error("Không phải tệp sao lưu của website.");
      const newBank = validateBank(b.bank).questions,
        newHistory = validateHistory(b.history);
      if (b.active) validateConfigForBackup(b.active);
      if (attemptRef.current)
        throw Error("Hoàn tất bài đang làm trước khi nhập bản sao lưu.");
      if (!confirm("Thay ngân hàng và lịch sử cục bộ bằng bản sao lưu?"))
        return;
      await atomic({ bank: newBank, history: newHistory, active: null });
      setBank(newBank);
      setHistory(newHistory);
      historyRef.current = newHistory;
      setNotice(
        "Đã khôi phục ngân hàng và lịch sử. Bài đang làm trong tệp được giữ để xem, chưa tự tiếp tục.",
      );
      if (b.active) {
        const a = b.active;
        validateConfigForBackup(a);
        const restored =
          remaining(a) === 0
            ? finish(a, Date.now(), "Quá hạn khi khôi phục")
            : a;
        if (restored.status === "submitted") {
          const h = [
            restored,
            ...newHistory.filter((x) => x.id !== restored.id),
          ];
          await atomic({ history: h, active: null });
          setHistory(h);
          setResult(restored);
          go("result");
        } else {
          setActive(restored);
          go("quiz");
        }
      }
    } catch (e) {
      fail(e);
    }
  }
  function validateConfigForBackup(a: Attempt) {
    if (
      !a ||
      a.status !== "active" ||
      !Number.isFinite(a.startedAt) ||
      a.startedAt > Date.now() + 60000 ||
      !Array.isArray(a.questions) ||
      a.questions.length !== a.config.count ||
      a.questions.length > 900 ||
      !a.answers ||
      !Array.isArray(a.flags) ||
      !Array.isArray(a.checked) ||
      !Number.isInteger(a.index) ||
      a.index < 0 ||
      a.index >= a.questions.length ||
      (a.deadline !== null &&
        (!Number.isFinite(a.deadline) || a.deadline < a.startedAt))
    )
      throw Error("Bài đang làm trong bản sao lưu không hợp lệ.");
    validateHistory([{ ...a, status: "submitted", submittedAt: a.startedAt }]);
  }
  async function bankImport(file: File) {
    try {
      if (attemptRef.current)
        throw Error("Hoàn tất bài đang làm trước khi đổi ngân hàng.");
      const r = importBank(
        await readFile(file),
        file.name.toLowerCase().endsWith(".csv"),
      );
      if (
        !confirm(
          `Nhập ${r.questions.length} câu và thay ngân hàng cục bộ? ${r.warnings.slice(0, 3).join("; ")}`,
        )
      )
        return;
      await write("bank", r.questions);
      setBank(r.questions);
      setNotice(
        `Đã nhập ${r.questions.length} câu. ${r.warnings.length ? "Có cảnh báo trùng nội dung; hãy rà soát." : ""}`,
      );
    } catch (e) {
      fail(e);
    }
  }
  async function saveEditor() {
    try {
      if (attemptRef.current)
        throw Error("Hoàn tất bài đang làm trước khi sửa ngân hàng.");
      const q = { ...JSON.parse(editor), reviewStatus: "local" };
      validateQuestion(q);
      const next = editingId
          ? bank.map((x) => (x.id === editingId ? q : x))
          : [...bank, q],
        v = validateBank(next);
      if (v.warnings.length && !confirm(v.warnings.join("\n") + "\nVẫn lưu?"))
        return;
      await write("bank", next);
      setBank(next);
      setEditor("");
      setEditingId("");
      setNotice("Đã lưu câu hỏi trên thiết bị này.");
    } catch (e) {
      fail(e);
    }
  }
  async function deleteQuestion(q: Question) {
    if (attemptRef.current) {
      fail("Hoàn tất bài đang làm trước khi xóa câu hỏi.");
      return;
    }
    if (!confirm(`Xóa câu ${q.id} khỏi ngân hàng cục bộ?`)) return;
    try {
      const next = bank.filter((x) => x.id !== q.id);
      await write("bank", next);
      setBank(next);
    } catch (e) {
      fail(e);
    }
  }
  function newQuestion() {
    setEditingId("");
    setEditor(
      JSON.stringify(
        {
          id: "LOCAL-" + Date.now(),
          topic: 1,
          section: "Chủ đề",
          difficulty: 3,
          learningObjective: "Mục tiêu học tập",
          prompt: "Bệnh cảnh và yêu cầu đầy đủ",
          clinicalVignette: "",
          task: "Yêu cầu cụ thể",
          options: ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
          answer: 0,
          explanation: "Lập luận và căn cứ",
          optionExplanations: ["Lý do A", "Lý do B", "Lý do C", "Lý do D"],
          sources: [
            {
              title: "Tên nguồn",
              file: "Tên tài liệu trong thư mục",
              page: 1,
              evidence: "Trích đoạn xác minh",
            },
          ],
          images: [],
          reviewStatus: "local",
        },
        null,
        2,
      ),
    );
  }
  async function share(a: Attempt) {
    try {
      if (
        a.bankVersion !== meta?.version ||
        a.questions.some((q) => {
          const { order, ...plain } = q;
          const original = originalBankRef.current.find((x) => x.id === q.id);
          return (
            !original || JSON.stringify(plain) !== JSON.stringify(original)
          );
        })
      )
        throw Error(
          "Bộ câu dùng phiên bản cũ hoặc ngân hàng cục bộ khác bản chung. Hãy xuất ngân hàng JSON cho người nhận hoặc cập nhật repository trước khi chia sẻ đề.",
        );
      const b = new TextEncoder().encode(JSON.stringify(sharePayload(a)));
      let raw = "";
      b.forEach((n) => (raw += String.fromCharCode(n)));
      const encoded = btoa(raw)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const url = location.href.split("#")[0] + "#create?share=" + encoded;
      setShareLink(url);
      try {
        await navigator.clipboard.writeText(url);
        setNotice(
          "Đã sao chép liên kết đề. Bạn cũng có thể sao chép từ ô liên kết.",
        );
      } catch {
        setNotice("Liên kết đề đã sẵn sàng. Hãy sao chép từ ô liên kết.");
      }
    } catch (e) {
      fail(e);
    }
  }
  const filtered = bank.filter(
    (q) =>
      (!topicFilter || q.topic === topicFilter) &&
      (!levelFilter || q.difficulty === levelFilter) &&
      (!imageFilter || q.images.length) &&
      (!search ||
        (q.prompt + " " + q.section + " " + q.id)
          .toLocaleLowerCase("vi")
          .includes(search.toLocaleLowerCase("vi"))),
  );
  const aggregate = history.reduce(
    (s, a) => {
      const g = grade(a);
      return { correct: s.correct + g.correct, total: s.total + g.total };
    },
    { correct: 0, total: 0 },
  );
  const home = (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">GÓC HỌC TẬP CỦA BẠN</p>
          <h1>Hôm nay, ôn tập gì?</h1>
          <p className="muted">
            Sáu topic. Những tình huống giúp bạn hiểu sâu hơn.
          </p>
        </div>
        <button className="primary" onClick={() => go("create")}>
          <Icon name="plus" /> Tạo đề mới
        </button>
      </div>
      <section className="hero">
        <div>
          <span className="hero-tag">ĐỀ TỔNG HỢP · 6 TOPIC</span>
          <h2>
            Học hiểu.
            <br />
            Vững lâm sàng.
          </h2>
          <p>
            90 câu trắc nghiệm · 90 phút
            <br />
            Ưu tiên vận dụng và vận dụng cao.
          </p>
          <button
            onClick={() => {
              setConfig(structuredClone(defaultConfig));
              go("create");
            }}
          >
            Cấu hình đề tổng hợp <Icon name="arrow" />
          </button>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit o1" />
          <div className="orbit o2" />
          <div className="orbit o3" />
          <div className="hero-cross">✚</div>
          <span className="float-label">Bệnh cảnh → Lập luận → Lựa chọn</span>
        </div>
      </section>
      <div className="chips">
        <button
          className={!topicFilter ? "selected" : ""}
          onClick={() => setTopicFilter(0)}
        >
          Tất cả topic
        </button>
        {topics.map((t) => (
          <button
            className={topicFilter === t.id ? "selected" : ""}
            onClick={() => setTopicFilter(t.id)}
            key={t.id}
          >
            {t.short}
          </button>
        ))}
      </div>
      <div className="section-line">
        <h2>Khám phá các topic</h2>
        <span>{bank.length.toLocaleString("vi-VN")} câu trong ngân hàng</span>
      </div>
      <div className="topic-grid">
        {topics
          .filter((t) => !topicFilter || topicFilter === t.id)
          .filter(
            (t) =>
              !search ||
              (t.name + t.caption).toLowerCase().includes(search.toLowerCase()),
          )
          .map((t) => (
            <article className="topic-card" key={t.id}>
              <button
                className="thumbnail"
                style={{ background: t.color }}
                onClick={() => createFor(t.id)}
                aria-label={`Tạo đề Topic ${t.id}: ${t.name}`}
              >
                <span className="topic-num">TOPIC 0{t.id}</span>
                <div className="thumb-glyph">{t.glyph}</div>
                <span className="thumb-title">{t.short}</span>
                <span className="thumb-count">
                  {bank.filter((q) => q.topic === t.id).length} câu
                </span>
              </button>
              <div className="topic-info">
                <span className="small-icon" style={{ background: t.color }}>
                  0{t.id}
                </span>
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.caption}</p>
                  <button className="text-link" onClick={() => createFor(t.id)}>
                    Ôn topic này <span>↗</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>
      <section className="quiet-panel">
        <Icon name="bank" />
        <div>
          <strong>Kiến thức có nguồn. Lập luận có căn cứ.</strong>
          <p>
            Mở lời giải sau khi trả lời để đối chiếu tài liệu và dấu hiệu trên
            hình.
          </p>
        </div>
      </section>
    </>
  );
  const create = (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">TẠO ĐỀ KIỂM TRA</p>
          <h1>Một đề, đúng mục tiêu.</h1>
          <p className="muted">Chọn phạm vi và nhịp học phù hợp với bạn.</p>
        </div>
      </div>
      <div className="create-layout">
        <div className="panel form-panel">
          <label>
            Tên người làm bài
            <input
              value={config.name}
              maxLength={80}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="Tên hoặc biệt danh (không bắt buộc)"
            />
          </label>
          <fieldset>
            <legend>Phạm vi kiến thức</legend>
            <div className="topic-checks">
              {topics.map((t) => (
                <label key={t.id}>
                  <input
                    type="checkbox"
                    checked={config.topics.includes(t.id)}
                    onChange={() =>
                      setConfig({
                        ...config,
                        sections: [],
                        topics: config.topics.includes(t.id)
                          ? config.topics.filter((x) => x !== t.id)
                          : [...config.topics, t.id].sort(),
                      })
                    }
                  />
                  <span>
                    <strong>Topic {t.id}</strong>
                    {t.name}
                  </span>
                  <input
                    aria-label={`Trọng số Topic ${t.id}`}
                    className="weight"
                    title="Trọng số phân bố câu"
                    type="number"
                    min="0"
                    max="100"
                    value={config.topicWeights[t.id - 1]}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        topicWeights: config.topicWeights.map((w, i) =>
                          i === t.id - 1 ? Number(e.target.value) : w,
                        ),
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <p className="hint">
              Số bên phải là trọng số. Các topic có cùng trọng số được chia đều
              số câu.
            </p>
            <details className="scope">
              <summary>Chọn chủ đề nhỏ (mặc định toàn bộ)</summary>
              <div className="subtopics">
                {[
                  ...new Set(
                    bank
                      .filter((q) => config.topics.includes(q.topic))
                      .map((q) => q.section),
                  ),
                ]
                  .sort()
                  .map((s) => (
                    <label key={s}>
                      <input
                        type="checkbox"
                        checked={config.sections?.includes(s) || false}
                        onChange={() =>
                          setConfig({
                            ...config,
                            sections: config.sections?.includes(s)
                              ? config.sections.filter((x) => x !== s)
                              : [...(config.sections || []), s],
                          })
                        }
                      />
                      {s}
                    </label>
                  ))}
              </div>
            </details>
          </fieldset>
          <div className="form-row">
            <label>
              Số câu trắc nghiệm
              <input
                type="number"
                min="1"
                max="900"
                value={config.count}
                onChange={(e) =>
                  setConfig({ ...config, count: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Thời gian (phút)
              <input
                type="number"
                min="1"
                max="600"
                value={config.minutes}
                disabled={config.mode === "practice"}
                onChange={(e) =>
                  setConfig({ ...config, minutes: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <fieldset>
            <legend>Chế độ làm bài</legend>
            <div className="mode-options">
              <button
                className={config.mode === "exam" ? "selected" : ""}
                onClick={() => setConfig({ ...config, mode: "exam" })}
              >
                <strong>Kiểm tra</strong>
                <span>Có đồng hồ · lời giải sau khi nộp</span>
              </button>
              <button
                className={config.mode === "practice" ? "selected" : ""}
                onClick={() => setConfig({ ...config, mode: "practice" })}
              >
                <strong>Luyện tập</strong>
                <span>Không hạn giờ · kiểm tra từng câu</span>
              </button>
            </div>
          </fieldset>
          <fieldset>
            <legend>Tỉ lệ bốn mức độ</legend>
            <div className="difficulty-inputs">
              {levels.map((l, i) => (
                <label key={l}>
                  <span className={`level-dot d${i + 1}`} />
                  {l}
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.ratios[i]}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ratios: config.ratios.map((v, j) =>
                            i === j ? Number(e.target.value) : v,
                          ),
                        })
                      }
                    />
                    <span>%</span>
                  </div>
                </label>
              ))}
            </div>
            <p
              className={
                config.ratios.reduce((a, b) => a + b, 0) === 100
                  ? "hint"
                  : "error-text"
              }
            >
              Tổng: {config.ratios.reduce((a, b) => a + b, 0)}% / 100%
            </p>
          </fieldset>
          <label>
            Câu hình ảnh học (%)
            <input
              type="number"
              min="0"
              max="100"
              value={config.imagePercent}
              onChange={(e) =>
                setConfig({ ...config, imagePercent: Number(e.target.value) })
              }
            />
            <span className="hint">
              Dự kiến {Math.round((config.count * config.imagePercent) / 100)}{" "}
              câu có bệnh cảnh và hình trong tổng {config.count} câu.
            </span>
          </label>
        </div>
        <aside className="panel summary-panel">
          <span className="eyebrow">ĐỀ CỦA BẠN</span>
          <h2>{config.count} câu</h2>
          <div className="summary-line">
            <span>Phạm vi</span>
            <strong>{config.topics.length} topic</strong>
          </div>
          <div className="summary-line">
            <span>Thời gian</span>
            <strong>
              {config.mode === "practice"
                ? "Không giới hạn"
                : config.minutes + " phút"}
            </strong>
          </div>
          <div className="summary-line">
            <span>Câu có hình</span>
            <strong>
              {Math.round((config.count * config.imagePercent) / 100)} câu
            </strong>
          </div>
          <div className="summary-line">
            <span>Kết quả</span>
            <strong>Số đúng / tổng câu</strong>
          </div>
          <button
            className="primary full"
            onClick={() => start()}
            disabled={!bank.length}
          >
            Bắt đầu làm bài <Icon name="arrow" />
          </button>
          <p className="hint">
            Câu hỏi và phương án được xáo trộn. Bài làm được lưu trên thiết bị
            này.
          </p>
        </aside>
      </div>
    </>
  );
  function quiz() {
    if (!attempt)
      return (
        <Empty
          title="Chưa có bài đang làm"
          text="Tạo một đề mới để bắt đầu."
          action={() => go("create")}
          label="Tạo đề"
        />
      );
    const a = attempt,
      q = a.questions[a.index],
      selected = a.answers[q.id],
      checked = a.checked.includes(q.id),
      answered = Object.keys(a.answers).length,
      left = remaining(a, now);
    return (
      <>
        <div className="exam-header">
          <div>
            <p className="eyebrow">
              {a.config.mode === "exam" ? "KIỂM TRA" : "LUYỆN TẬP"} ·{" "}
              {a.config.name || "Người học"}
            </p>
            <h1>
              {a.config.topics.length === 6
                ? "Phụ khoa · Đề tổng hợp"
                : a.config.topics.map((t) => `Topic ${t}`).join(" · ")}
            </h1>
          </div>
          <div
            className={`timer ${left !== null && left < 300000 ? "urgent" : ""}`}
          >
            <span>
              {left === null ? "TỰ DO THỜI GIAN" : "THỜI GIAN CÒN LẠI"}
            </span>
            <strong>{left === null ? "∞" : clock(left)}</strong>
          </div>
          <button
            className="primary"
            onClick={() =>
              setPendingSubmit(
                `Bạn đã trả lời ${answered}/${a.questions.length} câu. Nộp bài để xem kết quả?`,
              )
            }
          >
            Nộp bài
          </button>
        </div>
        <div className="exam-progress">
          <span>
            Đã trả lời {answered}/{a.questions.length}
          </span>
          <span className="save-status">{saved}</span>
          <progress max={a.questions.length} value={answered} />
        </div>
        <div className="exam-layout">
          <div>
            <article className="panel question-panel">
              <div className="question-top">
                <span className="pill">
                  Topic {q.topic} · {q.section}
                </span>
                <button
                  className={`flag ${a.flags.includes(q.id) ? "active" : ""}`}
                  onClick={() =>
                    setActive({
                      ...a,
                      flags: a.flags.includes(q.id)
                        ? a.flags.filter((x) => x !== q.id)
                        : [...a.flags, q.id],
                    })
                  }
                >
                  <Icon name="flag" />
                  {a.flags.includes(q.id) ? "Đã đánh dấu" : "Xem lại"}
                </button>
              </div>
              <div className="question-counter">
                Câu {a.index + 1} <span>/ {a.questions.length}</span>
                <span className="difficulty-badge">
                  {levels[q.difficulty - 1]}
                </span>
              </div>
              {q.images.length > 0 && (
                <p className="case-note">
                  {q.caseProvenance ||
                    "Tình huống học tập dựa trên hình lâm sàng đã công bố."}
                </p>
              )}
              <h2 className="question-prompt">
                <Text text={q.prompt} />
              </h2>
              <Figures q={q} onZoom={setZoom} />
              <p className="hint">Chọn một đáp án đúng nhất.</p>
              <div className="answer-options">
                {q.order.map((original, i) => (
                  <button
                    className={`answer-option ${selected === original ? "selected" : ""} ${checked && q.answer === original ? "correct" : ""} ${checked && selected === original && original !== q.answer ? "wrong" : ""}`}
                    disabled={checked || left === 0}
                    aria-pressed={selected === original}
                    key={original}
                    onClick={() => updateAnswer(original)}
                  >
                    <span className="letter">{"ABCD"[i]}</span>
                    <span>
                      <Text text={q.options[original]} />
                    </span>
                    {selected === original && <Icon name="check" />}
                  </button>
                ))}
              </div>
              {a.config.mode === "practice" && !checked && (
                <button
                  className="primary"
                  disabled={selected === undefined}
                  onClick={() =>
                    setActive({ ...a, checked: [...a.checked, q.id] })
                  }
                >
                  Kiểm tra đáp án
                </button>
              )}
              {checked && <Explanation q={q} answer={selected} />}
            </article>
            <div className="question-nav">
              <button
                disabled={a.index === 0}
                onClick={() => setActive({ ...a, index: a.index - 1 })}
              >
                ← Câu trước
              </button>
              <span>
                {a.index + 1} / {a.questions.length}
              </span>
              <button
                className="primary"
                onClick={() =>
                  a.index === a.questions.length - 1
                    ? setPendingSubmit("Nộp bài và xem kết quả?")
                    : setActive({ ...a, index: a.index + 1 })
                }
              >
                {a.index === a.questions.length - 1 ? "Nộp bài" : "Câu tiếp →"}
              </button>
            </div>
          </div>
          <aside className="panel answer-sheet">
            <h3>Phiếu trả lời</h3>
            <label className="check-line">
              <input
                type="checkbox"
                checked={onlyUnanswered}
                onChange={(e) => setOnlyUnanswered(e.target.checked)}
              />
              Chỉ câu chưa trả lời
            </label>
            <div className="answer-map">
              {a.questions.map((x, i) =>
                !onlyUnanswered || a.answers[x.id] === undefined ? (
                  <button
                    key={x.id}
                    aria-label={`Câu ${i + 1}${a.answers[x.id] !== undefined ? ", đã trả lời" : ", chưa trả lời"}${a.flags.includes(x.id) ? ", đánh dấu" : ""}`}
                    className={`${i === a.index ? "current" : ""} ${a.answers[x.id] !== undefined ? "answered" : ""} ${a.flags.includes(x.id) ? "marked" : ""}`}
                    onClick={() => {
                      setActive({ ...a, index: i });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {i + 1}
                  </button>
                ) : null,
              )}
            </div>
            <div className="map-legend">
              <span>◻ Chưa làm</span>
              <span>▣ Đã chọn</span>
              <span>◈ Xem lại</span>
            </div>
            <button className="secondary full" onClick={() => share(a)}>
              Chia sẻ đề
            </button>
            <button className="text-link" onClick={exportBackup}>
              Xuất bản sao lưu
            </button>
          </aside>
        </div>
      </>
    );
  }
  function results() {
    const a = result;
    if (!a)
      return (
        <Empty
          title="Chọn một bài đã hoàn thành"
          text="Kết quả của bạn nằm trong lịch sử làm bài."
          action={() => go("history")}
          label="Mở lịch sử"
        />
      );
    const g = grade(a);
    return (
      <>
        <div className="page-title">
          <div>
            <p className="eyebrow">ĐÃ HOÀN THÀNH</p>
            <h1>Mỗi câu là một điều học được.</h1>
            <p className="muted">
              {a.config.name || "Người học"} · {date(a.submittedAt!)} ·{" "}
              {a.reason || "Đã nộp bài"}
            </p>
          </div>
          <button className="secondary" onClick={() => share(a)}>
            Chia sẻ đề
          </button>
        </div>
        <section className="result-banner">
          <div>
            <span>SỐ CÂU ĐÚNG</span>
            <h2>
              {g.correct}
              <small> / {g.total}</small>
            </h2>
            <p>Đối chiếu lời giải từng câu ở bên dưới.</p>
          </div>
          <div className="result-facts">
            <div>
              <strong>{g.wrong}</strong>
              <span>Câu sai</span>
            </div>
            <div>
              <strong>{g.blank}</strong>
              <span>Bỏ trống</span>
            </div>
            <div>
              <strong>
                {clock(Math.max(0, a.submittedAt! - a.startedAt))}
              </strong>
              <span>Thời gian</span>
            </div>
          </div>
        </section>
        <div className="actions">
          <button
            className="primary"
            disabled={g.correct === g.total}
            onClick={() => retry(a, true)}
          >
            Ôn câu sai & bỏ trống ({g.wrong + g.blank})
          </button>
          <button onClick={() => retry(a)}>Làm lại bộ câu này</button>
          <button
            onClick={() => {
              setConfig({ ...a.config, name: "", count: 90 });
              go("create");
            }}
          >
            Tạo đề cùng phạm vi
          </button>
        </div>
        <div className="analysis-grid">
          <Breakdown
            title="Theo mức độ"
            rows={levels.map((l, i) => ({
              name: l,
              qs: a.questions.filter((q) => q.difficulty === i + 1),
            }))}
            attempts={[a]}
          />
          <Breakdown
            title="Theo topic"
            rows={topics.map((t) => ({
              name: t.name,
              qs: a.questions.filter((q) => q.topic === t.id),
            }))}
            attempts={[a]}
          />
        </div>
        <div className="section-line">
          <h2>Đáp án & lời giải</h2>
          <span>{g.total} câu</span>
        </div>
        {a.questions.map((q, i) => (
          <details className="panel review-question" key={q.id}>
            <summary>
              <span
                className={`review-dot ${a.answers[q.id] === q.answer ? "good" : "bad"}`}
              >
                {a.answers[q.id] === q.answer
                  ? "✓"
                  : a.answers[q.id] === undefined
                    ? "–"
                    : "×"}
              </span>
              <span>
                <strong>Câu {i + 1}</strong> · {q.prompt}
              </span>
            </summary>
            <div className="review-body">
              <p className="muted">
                {a.answers[q.id] === undefined
                  ? "Bạn bỏ trống câu này."
                  : "Bạn chọn: " + q.options[a.answers[q.id]]}
              </p>
              <Figures q={q} onZoom={setZoom} />
              <Explanation q={q} answer={a.answers[q.id]} />
            </div>
          </details>
        ))}
      </>
    );
  }
  const historyPage = (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">LỊCH SỬ LÀM BÀI</p>
          <h1>Nhìn lại hành trình học.</h1>
          <p className="muted">
            Lịch sử trên thiết bị này. Dùng sao lưu để chuyển sang thiết bị
            khác.
          </p>
        </div>
        <button onClick={exportBackup}>
          <Icon name="download" /> Sao lưu
        </button>
      </div>
      {!history.length ? (
        <Empty
          title="Chưa có bài đã hoàn thành"
          text="Khi nộp bài, kết quả sẽ xuất hiện ở đây."
          action={() => go("create")}
          label="Làm đề đầu tiên"
        />
      ) : (
        <div className="history-list">
          {history.map((a) => {
            const g = grade(a);
            return (
              <div className="panel history-row" key={a.id}>
                <div className="history-symbol">
                  <Icon name="history" />
                </div>
                <div>
                  <h3>
                    {a.config.topics.length === 6
                      ? "Đề tổng hợp 6 topic"
                      : a.config.topics.map((t) => "Topic " + t).join(", ")}
                  </h3>
                  <p>
                    {a.config.name || "Người học"} · {date(a.submittedAt!)} ·{" "}
                    {a.config.mode === "practice" ? "Luyện tập" : "Kiểm tra"}
                  </p>
                </div>
                <strong className="history-score">
                  {g.correct}
                  <span>/{g.total} đúng</span>
                </strong>
                <button
                  onClick={() => {
                    setResult(a);
                    go("result");
                  }}
                >
                  Xem lại
                </button>
                <button
                  className="icon-button"
                  aria-label="Xóa bài này"
                  onClick={async () => {
                    if (!confirm("Xóa kết quả này trên thiết bị?")) return;
                    try {
                      const h = history.filter((x) => x.id !== a.id);
                      await write("history", h);
                      setHistory(h);
                      historyRef.current = h;
                    } catch (e) {
                      fail(e);
                    }
                  }}
                >
                  <Icon name="close" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="actions">
        <button onClick={() => backupRef.current?.click()}>
          Nhập bản sao lưu
        </button>
        <button
          onClick={() =>
            download(
              "phu-khoa-ket-qua.csv",
              historyCSV(history),
              "text/csv;charset=utf-8",
            )
          }
        >
          Xuất kết quả CSV
        </button>
        {history.length > 0 && (
          <button
            className="danger-text"
            onClick={async () => {
              if (confirm("Xóa toàn bộ lịch sử trên thiết bị?")) {
                try {
                  await write("history", []);
                  setHistory([]);
                  historyRef.current = [];
                } catch (e) {
                  fail(e);
                }
              }
            }}
          >
            Xóa lịch sử
          </button>
        )}
      </div>
    </>
  );
  const bankPage = (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">NGÂN HÀNG CÂU HỎI</p>
          <h1>Nội dung để học sâu.</h1>
          <p className="muted">
            Thay đổi tại đây được lưu cục bộ trên thiết bị của bạn.
          </p>
        </div>
        <button className="primary" onClick={newQuestion}>
          <Icon name="plus" /> Thêm câu hỏi
        </button>
      </div>
      <div className="bank-toolbar">
        <select
          aria-label="Lọc topic"
          value={topicFilter}
          onChange={(e) => {
            setTopicFilter(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value="0">Tất cả topic</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              Topic {t.id} · {t.short}
            </option>
          ))}
        </select>
        <select
          aria-label="Lọc mức độ"
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value="0">Tất cả mức độ</option>
          {levels.map((l, i) => (
            <option key={l} value={i + 1}>
              {l}
            </option>
          ))}
        </select>
        <label className="check-line">
          <input
            type="checkbox"
            checked={imageFilter}
            onChange={(e) => {
              setImageFilter(e.target.checked);
              setPage(0);
            }}
          />
          Có hình
        </label>
        <span>{filtered.length} câu</span>
      </div>
      <div className="actions">
        <button onClick={() => fileRef.current?.click()}>
          Nhập JSON / CSV
        </button>
        <button onClick={() => download("phu-khoa-ngan-hang.json", bank)}>
          Xuất JSON
        </button>
        <button
          onClick={() =>
            download(
              "phu-khoa-ngan-hang.csv",
              toCSV(bank),
              "text/csv;charset=utf-8",
            )
          }
        >
          Xuất CSV
        </button>
        <button
          onClick={() => {
            try {
              const v = validateBank(bank);
              setNotice(
                `Cấu trúc hợp lệ: ${v.questions.length} câu. ${v.warnings.length ? v.warnings.slice(0, 5).join("; ") : "Không có ID hoặc câu dẫn trùng hoàn toàn."} Kiểm tra cấu trúc không thay thế đối chiếu chuyên môn.`,
              );
            } catch (e) {
              fail(e);
            }
          }}
        >
          Kiểm tra dữ liệu
        </button>
      </div>
      {filtered.slice(page * 20, page * 20 + 20).map((q) => (
        <details className="panel bank-row" key={q.id}>
          <summary>
            <span className="pill">{q.id}</span>
            <span>{q.prompt}</span>
            <span className="muted">
              {levels[q.difficulty - 1]}
              {q.images.length ? " · Có hình" : ""}
            </span>
          </summary>
          <div className="review-body">
            <Figures q={q} onZoom={setZoom} />
            <Explanation q={q} />
            <div className="actions">
              <button
                onClick={() => {
                  setEditingId(q.id);
                  setEditor(JSON.stringify(q, null, 2));
                }}
              >
                Sửa câu hỏi
              </button>
              <button className="danger-text" onClick={() => deleteQuestion(q)}>
                Xóa
              </button>
            </div>
          </div>
        </details>
      ))}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          ← Trước
        </button>
        <span>
          Trang {page + 1} / {Math.max(1, Math.ceil(filtered.length / 20))}
        </span>
        <button
          disabled={(page + 1) * 20 >= filtered.length}
          onClick={() => setPage(page + 1)}
        >
          Tiếp →
        </button>
      </div>
    </>
  );
  const stats = (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">THỐNG KÊ KẾT QUẢ</p>
          <h1>Hiểu tiến độ của mình.</h1>
          <p className="muted">
            Chỉ sử dụng kết quả những bài bạn đã hoàn thành.
          </p>
        </div>
      </div>
      {!history.length ? (
        <Empty
          title="Chưa có dữ liệu thống kê"
          text="Hoàn thành một bài để xem kết quả theo topic và mức độ."
          action={() => go("create")}
          label="Bắt đầu làm bài"
        />
      ) : (
        <>
          <div className="stat-cards">
            <div className="panel">
              <span>Bài đã hoàn thành</span>
              <strong>{history.length}</strong>
            </div>
            <div className="panel">
              <span>Tổng câu đúng / câu đã gặp</span>
              <strong>
                {aggregate.correct}
                <small> / {aggregate.total}</small>
              </strong>
            </div>
            <div className="panel">
              <span>Tỉ lệ đúng toàn bộ lượt</span>
              <strong>
                {Math.round((aggregate.correct / aggregate.total) * 100)}%
              </strong>
            </div>
          </div>
          <div className="analysis-grid">
            <Breakdown
              title="Theo topic"
              rows={topics.map((t) => ({
                name: t.name,
                qs: history.flatMap((a) =>
                  a.questions.filter((q) => q.topic === t.id),
                ),
              }))}
              attempts={history}
            />
            <Breakdown
              title="Theo mức độ"
              rows={levels.map((l, i) => ({
                name: l,
                qs: history.flatMap((a) =>
                  a.questions.filter((q) => q.difficulty === i + 1),
                ),
              }))}
              attempts={history}
            />
          </div>
        </>
      )}
    </>
  );
  const settings = (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">CÀI ĐẶT</p>
          <h1>Góc học tập của bạn.</h1>
        </div>
      </div>
      <div className="panel settings-panel">
        <h3>Giao diện</h3>
        <button onClick={() => setDark(!dark)}>
          <Icon name={dark ? "sun" : "moon"} />
          {dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
        </button>
        <h3>Dữ liệu trên thiết bị</h3>
        <p>
          Ngân hàng đã chỉnh sửa, bài làm và lịch sử được lưu trong trình duyệt
          này. Không tự đồng bộ sang máy khác. Xóa dữ liệu trình duyệt có thể
          xóa dữ liệu học tập.
        </p>
        <div className="actions">
          <button onClick={exportBackup}>Xuất bản sao lưu đầy đủ</button>
          <button onClick={() => backupRef.current?.click()}>
            Nhập bản sao lưu
          </button>
        </div>
        <h3>Ngân hàng gốc</h3>
        <p>
          Phiên bản: {meta?.version} · {meta?.count} câu gốc · {meta?.images}{" "}
          câu có hình. Ngân hàng đang dùng: {bank.length} câu.
        </p>
        <button
          onClick={async () => {
            if (attemptRef.current) {
              fail("Hoàn tất bài đang làm trước khi đổi ngân hàng.");
              return;
            }
            if (
              confirm(
                "Khôi phục ngân hàng gốc? Các chỉnh sửa câu hỏi cục bộ sẽ được thay thế.",
              )
            )
              try {
                const r = await fetch(base + "data/bank.json");
                const original = validateBank(await r.json()).questions;
                await write("bank", original);
                setBank(original);
                setNotice("Đã khôi phục ngân hàng gốc.");
              } catch (e) {
                fail(e);
              }
          }}
        >
          Khôi phục ngân hàng gốc
        </button>
        <h3>Học ngoại tuyến</h3>
        <p>
          Sau khi các tệp được tải và lưu thành công, bạn có thể mở lại website
          khi mất mạng. Bài đang làm giữ nguyên bộ câu và thời hạn, kể cả khi
          ngân hàng được cập nhật.
        </p>
        <h3>Quyền riêng tư</h3>
        <p>
          Không gửi bài làm đến máy chủ, không có theo dõi người dùng. Website
          phục vụ ôn tập; đáp án được phát hành cùng ngân hàng tĩnh. Đồng hồ phụ
          thuộc thời gian trên thiết bị.
        </p>
        <button
          className="danger-text"
          onClick={async () => {
            if (
              confirm(
                "Xóa toàn bộ dữ liệu học tập trên thiết bị? Hãy sao lưu trước nếu cần.",
              )
            )
              try {
                await clearDB();
                setHistory([]);
                historyRef.current = [];
                setAttempt(null);
                attemptRef.current = null;
                const r = await fetch(base + "data/bank.json");
                setBank(validateBank(await r.json()).questions);
                setNotice("Đã xóa dữ liệu học tập cục bộ.");
              } catch (e) {
                fail(e);
              }
          }}
        >
          Xóa toàn bộ dữ liệu cục bộ
        </button>
      </div>
    </>
  );
  let content: React.ReactNode = home;
  if (route === "create") content = create;
  if (route === "quiz") content = quiz();
  if (route === "result") content = results();
  if (route === "history") content = historyPage;
  if (route === "bank") content = bankPage;
  if (route === "stats") content = stats;
  if (route === "settings") content = settings;
  if (route === "subjects") content = home;
  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <header className="topbar">
        <button
          className="icon-button menu-toggle"
          aria-label="Mở menu"
          onClick={() => setMenu(!menu)}
        >
          <Icon name="menu" />
        </button>
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-mark">✚</span>
          <span>
            phụ khoa<small>GÓC HỌC LÂM SÀNG</small>
          </span>
        </button>
        <div className="search-box">
          <Icon name="search" />
          <input
            aria-label="Tìm kiếm topic hoặc câu hỏi"
            placeholder="Tìm topic, kiến thức, câu hỏi…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") go("bank");
            }}
          />
          {search && (
            <button
              className="icon-button"
              aria-label="Xóa tìm kiếm"
              onClick={() => setSearch("")}
            >
              <Icon name="close" />
            </button>
          )}
        </div>
        <button className="top-create" onClick={() => go("create")}>
          <Icon name="plus" /> Tạo đề
        </button>
        <button
          className="icon-button"
          aria-label={dark ? "Chế độ sáng" : "Chế độ tối"}
          onClick={() => setDark(!dark)}
        >
          <Icon name={dark ? "sun" : "moon"} />
        </button>
        <span className="avatar">PK</span>
      </header>
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <nav>
          {nav.map(([r, label]) => (
            <button
              key={r}
              className={
                route === r || (r === "home" && route === "result")
                  ? "active"
                  : ""
              }
              onClick={() => go(r)}
            >
              <Icon
                name={r === "subjects" ? "grid" : r === "create" ? "plus" : r}
              />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="online-dot" /> Học trên thiết bị của bạn
          <p>6 topic · Kiến thức có nguồn</p>
          <small>{meta?.version || "Đang tải ngân hàng"}</small>
        </div>
      </aside>
      {menu && (
        <button
          className="menu-shade"
          aria-label="Đóng menu"
          onClick={() => setMenu(false)}
        />
      )}
      <main id="main" className="main-content">
        {error && (
          <div className="alert error" role="alert">
            <span>{error}</span>
            <button aria-label="Đóng lỗi" onClick={() => setError("")}>
              <Icon name="close" />
            </button>
          </div>
        )}
        {notice && (
          <div className="alert notice" role="status">
            <span>{notice}</span>
            <button aria-label="Đóng thông báo" onClick={() => setNotice("")}>
              <Icon name="close" />
            </button>
          </div>
        )}
        {attempt && route !== "quiz" && (
          <div className="resume">
            <span>
              Bạn có bài đang làm · {Object.keys(attempt.answers).length}/
              {attempt.questions.length} câu đã trả lời
            </span>
            <button onClick={() => go("quiz")}>Tiếp tục bài →</button>
          </div>
        )}
        {loading ? (
          <div className="loading">Đang mở góc học tập…</div>
        ) : (
          content
        )}
        <footer>
          Phụ khoa · Học hiểu, nhớ lâu{" "}
          <span>Dữ liệu bài làm lưu trên thiết bị của bạn.</span>
        </footer>
      </main>
      <input
        className="hidden"
        ref={fileRef}
        type="file"
        accept=".json,.csv"
        onChange={(e) => {
          if (e.target.files?.[0]) bankImport(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <input
        className="hidden"
        ref={backupRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          if (e.target.files?.[0]) backupImport(e.target.files[0]);
          e.target.value = "";
        }}
      />
      {pendingSubmit && (
        <div className="modal-backdrop">
          <section
            className="panel confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Xác nhận nộp bài"
          >
            <h2>Hoàn tất bài làm</h2>
            <p>{pendingSubmit}</p>
            <div className="actions">
              <button
                className="primary"
                onClick={() => {
                  setPendingSubmit("");
                  submit();
                }}
              >
                Nộp bài và xem kết quả
              </button>
              <button onClick={() => setPendingSubmit("")}>
                Tiếp tục làm bài
              </button>
            </div>
          </section>
        </div>
      )}
      {shareLink && (
        <div className="modal-backdrop">
          <section
            className="panel confirm-modal share-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Chia sẻ đề"
          >
            <h2>Chia sẻ cùng một đề</h2>
            <p>
              Liên kết giữ bộ câu và thứ tự phương án, không chứa tên, câu trả
              lời hoặc kết quả. Người nhận cần cùng phiên bản ngân hàng.
            </p>
            <label>
              Liên kết đề
              <textarea
                value={shareLink}
                readOnly
                autoFocus
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            <div className="actions">
              <button onClick={() => setShareLink("")}>Đóng liên kết</button>
            </div>
          </section>
        </div>
      )}
      {zoom && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Hình lâm sàng phóng to"
          onClick={() => setZoom("")}
        >
          <button
            className="zoom-close"
            onClick={() => setZoom("")}
            aria-label="Đóng ảnh"
          >
            ×
          </button>
          <img
            src={zoom}
            alt="Hình lâm sàng phóng to"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      {editor && (
        <div className="modal-backdrop">
          <section
            className="editor-modal panel"
            role="dialog"
            aria-modal="true"
            aria-label="Biên soạn câu hỏi"
          >
            <h2>{editingId ? "Sửa câu " + editingId : "Thêm câu hỏi"}</h2>
            <p className="hint">
              Điền bệnh cảnh, yêu cầu và bốn phương án. Mỗi phương án cần lý do
              lựa chọn. Câu có hình phải kèm bệnh cảnh cụ thể và nguồn ảnh.
            </p>
            <Editor value={editor} onChange={setEditor} bank={bank} />
            <div className="actions">
              <button className="primary" onClick={saveEditor}>
                Kiểm tra & lưu
              </button>
              <button
                onClick={() => {
                  setEditor("");
                  setEditingId("");
                }}
              >
                Hủy
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
function Empty({
  title,
  text,
  action,
  label,
}: {
  title: string;
  text: string;
  action: () => void;
  label: string;
}) {
  return (
    <div className="empty panel">
      <span className="empty-glyph">✦</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary" onClick={action}>
        {label}
      </button>
    </div>
  );
}
function Breakdown({
  title,
  rows,
  attempts,
}: {
  title: string;
  rows: { name: string; qs: Question[] }[];
  attempts: Attempt[];
}) {
  return (
    <div className="panel breakdown">
      <h3>{title}</h3>
      {rows
        .filter((r) => r.qs.length)
        .map((r) => {
          const relevant = new Set(r.qs.map((q) => q.id));
          let correct = 0,
            total = 0;
          attempts.forEach((a) =>
            a.questions
              .filter((q) => relevant.has(q.id))
              .forEach((q) => {
                total++;
                if (a.answers[q.id] === q.answer) correct++;
              }),
          );
          return (
            <div className="bar-row" key={r.name}>
              <div>
                <span>{r.name}</span>
                <strong>
                  {correct}/{total}
                </strong>
              </div>
              <div className="bar-track">
                <span
                  style={{ width: (total ? (correct / total) * 100 : 0) + "%" }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
