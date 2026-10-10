import {
  type Question,
  type Config,
  type Attempt,
  type ExamQuestion,
  levels,
} from "./types";
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(input: T[], random: () => number) {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function allocate(total: number, weights: number[]) {
  if (
    !Number.isInteger(total) ||
    total < 0 ||
    weights.some((w) => !Number.isFinite(w) || w < 0) ||
    !weights.some((w) => w > 0)
  )
    throw Error("Số lượng hoặc tỉ lệ không hợp lệ.");
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum),
    out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, f: v - out[i] }))
    .sort((a, b) => b.f - a.f || a.i - b.i);
  for (let i = 0; i < left; i++) out[order[i].i]++;
  return out;
}
type Edge = { to: number; rev: number; cap: number; initial: number };
// Integer max-flow allocates real inventory while preserving row and column quotas.
function matrixFlow(
  rows: number[],
  cols: number[],
  caps: number[][],
  random: () => number,
): number[][] | null {
  const nr = rows.length,
    nc = cols.length,
    S = nr + nc,
    T = S + 1,
    g: Edge[][] = Array.from({ length: T + 1 }, () => []);
  function edge(a: number, b: number, c: number) {
    const e: Edge = { to: b, rev: g[b].length, cap: c, initial: c },
      r: Edge = { to: a, rev: g[a].length, cap: 0, initial: 0 };
    g[a].push(e);
    g[b].push(r);
    return e;
  }
  rows.forEach((n, i) => edge(S, i, n));
  cols.forEach((n, j) => edge(nr + j, T, n));
  const cells = shuffle(
    Array.from({ length: nr }, (_, i) =>
      Array.from({ length: nc }, (_, j) => [i, j]),
    ).flat(),
    random,
  );
  const refs: Edge[][] = Array.from({ length: nr }, () => []);
  for (const [i, j] of cells) refs[i][j] = edge(i, nr + j, caps[i][j]);
  let flow = 0;
  while (true) {
    const prev: Array<[number, number] | null> = Array(g.length).fill(null),
      q = [S];
    prev[S] = [-1, -1];
    for (let k = 0; k < q.length && !prev[T]; k++) {
      const a = q[k];
      for (let i = 0; i < g[a].length; i++) {
        const e = g[a][i];
        if (e.cap > 0 && !prev[e.to]) {
          prev[e.to] = [a, i];
          q.push(e.to);
        }
      }
    }
    if (!prev[T]) break;
    let n = Infinity;
    for (let v = T; v !== S;) {
      const [a, i] = prev[v]!;
      n = Math.min(n, g[a][i].cap);
      v = a;
    }
    for (let v = T; v !== S;) {
      const [a, i] = prev[v]!,
        e = g[a][i];
      e.cap -= n;
      g[v][e.rev].cap += n;
      v = a;
    }
    flow += n;
  }
  return flow === rows.reduce((a, b) => a + b, 0)
    ? refs.map((r) => r.map((e) => e.initial - e.cap))
    : null;
}
export function validateConfig(c: Config) {
  if (
    !c ||
    !Array.isArray(c.topics) ||
    !Array.isArray(c.ratios) ||
    !Array.isArray(c.topicWeights) ||
    c.topicWeights.length !== 6 ||
    c.topicWeights.some((w) => !Number.isFinite(w) || w < 0) ||
    !["exam", "practice"].includes(c.mode) ||
    (c.sections !== undefined &&
      (!Array.isArray(c.sections) ||
        c.sections.some((s) => typeof s !== "string")))
  )
    throw Error("Cấu hình đề không hợp lệ.");
  if (
    !c.topics.length ||
    new Set(c.topics).size !== c.topics.length ||
    c.topics.some((t) => !Number.isInteger(t) || t < 1 || t > 6)
  )
    throw Error("Chọn ít nhất một topic hợp lệ.");
  if (!Number.isInteger(c.count) || c.count < 1 || c.count > 900)
    throw Error("Số câu phải từ 1 đến 900.");
  if (
    c.ratios.length !== 4 ||
    c.ratios.some((x) => !Number.isFinite(x) || x < 0) ||
    Math.abs(c.ratios.reduce((a, b) => a + b, 0) - 100) > 0.001
  )
    throw Error("Tổng tỉ lệ bốn mức độ phải bằng 100%.");
  if (!Number.isFinite(c.minutes) || c.minutes < 1 || c.minutes > 600)
    throw Error("Thời gian phải từ 1 đến 600 phút.");
  if (
    !Number.isFinite(c.imagePercent) ||
    c.imagePercent < 0 ||
    c.imagePercent > 100
  )
    throw Error("Tỉ lệ câu có hình phải từ 0 đến 100%.");
}
export function generate(
  bank: Question[],
  config: Config,
  version: string,
  recent: Attempt[] = [],
  seed = crypto.getRandomValues(new Uint32Array(1))[0],
  now = Date.now(),
): Attempt {
  validateConfig(config);
  const rand = rng(seed),
    pool = bank.filter(
      (q) =>
        config.topics.includes(q.topic) &&
        (!config.sections?.length || config.sections.includes(q.section)),
    );
  const frequency = new Map<string, number>();
  recent
    .slice(0, 5)
    .forEach((a, i) =>
      a.questions.forEach((q) =>
        frequency.set(q.id, (frequency.get(q.id) || 0) + (5 - i)),
      ),
    );
  const topicQuotas = allocate(
      config.count,
      config.topics.map((t) => config.topicWeights[t - 1] ?? 1),
    ),
    levelQuotas = allocate(config.count, config.ratios),
    imN = Math.round((config.count * config.imagePercent) / 100);
  let im = config.topics.map((t) =>
    levels.map((_, l) =>
      pool.filter(
        (q) => q.topic === t && q.difficulty === l + 1 && q.images.length,
      ),
    ),
  );
  const allImages = pool.filter((q) => q.images.length),
    groups = new Map<string, Question[]>();
  for (const q of allImages) {
    const key =
      q.caseGroup ||
      q.images
        .map((x) => x.id)
        .sort()
        .join("|");
    groups.set(key, [...(groups.get(key) || []), q]);
  }
  const plain = config.topics.map((t) =>
    levels.map((_, l) =>
      pool.filter(
        (q) => q.topic === t && q.difficulty === l + 1 && !q.images.length,
      ),
    ),
  );
  let imCap = im.map((r) => r.map((c) => c.length));
  const plainCap = plain.map((r) => r.map((c) => c.length));
  let imagePlan: number[][] | null = null,
    plainPlan: number[][] | null = null;
  // Find a compatible allocation of the image subset, then fill all residual quotas.
  // Several seeded flows explore alternate margins; never relax a requested quota.
  for (let trial = 0; trial < 128; trial++) {
    const representatives = [...groups.values()].map((qs) => {
      const candidates = shuffle(qs, rand);
      if (trial === 0)
        candidates.sort(
          (a, b) => (frequency.get(a.id) || 0) - (frequency.get(b.id) || 0),
        );
      return candidates[0];
    });
    im = config.topics.map((t) =>
      levels.map((_, l) =>
        representatives.filter((q) => q.topic === t && q.difficulty === l + 1),
      ),
    );
    imCap = im.map((r) => r.map((c) => c.length));
    const weights = levelQuotas.map((n, l) =>
      Math.min(
        n,
        imCap.reduce((sum, r) => sum + r[l], 0),
      ),
    );
    if (imN && !weights.some(Boolean)) break;
    let imageLevels = imN ? allocate(imN, weights) : [0, 0, 0, 0];
    if (trial > 0 && imN) {
      imageLevels = [0, 0, 0, 0];
      for (let n = 0; n < imN; n++) {
        const eligible = shuffle(
          [0, 1, 2, 3].filter((l) => imageLevels[l] < weights[l]),
          rand,
        );
        if (!eligible.length) break;
        imageLevels[eligible[0]]++;
      }
    }
    if (
      imageLevels.reduce((a, b) => a + b, 0) !== imN ||
      imageLevels.some((n, l) => n > levelQuotas[l])
    )
      continue;
    // Append a dummy non-image column, giving image rows freedom inside each topic quota.
    const first = matrixFlow(
      topicQuotas,
      [...imageLevels, config.count - imN],
      imCap.map((r, i) => [...r, topicQuotas[i]]),
      rand,
    );
    if (!first) continue;
    const img = first.map((r) => r.slice(0, 4)),
      resRows = topicQuotas.map(
        (n, i) => n - img[i].reduce((a, b) => a + b, 0),
      ),
      resCols = levelQuotas.map((n, l) => n - imageLevels[l]);
    const p = matrixFlow(resRows, resCols, plainCap, rand);
    if (p) {
      imagePlan = img;
      plainPlan = p;
      break;
    }
  }
  if (!imagePlan || !plainPlan) {
    const stock = config.topics
      .map(
        (t, i) =>
          `Topic ${t}: ${im[i].flat().length + plain[i].flat().length} câu (${im[i].flat().length} có hình)`,
      )
      .join("; ");
    throw Error(
      `Không tìm được đề đủ câu và các nhóm hình khác nhau theo đồng thời các tỉ lệ bạn chọn. ${stock}. Hãy giảm số câu/tỉ lệ hình, đổi độ khó, chọn thêm phạm vi hoặc bổ sung câu hỏi.`,
    );
  }
  const take = (list: Question[], n: number) =>
    shuffle(list, rand)
      .sort((a, b) => (frequency.get(a.id) || 0) - (frequency.get(b.id) || 0))
      .slice(0, n);
  const chosen: Question[] = [];
  config.topics.forEach((_, i) =>
    levels.forEach((_, l) => {
      chosen.push(
        ...take(im[i][l], imagePlan![i][l]),
        ...take(plain[i][l], plainPlan![i][l]),
      );
    }),
  );
  const questions = shuffle(chosen, rand).map((q) => ({
    ...structuredClone(q),
    order: shuffle([0, 1, 2, 3], rand),
  }));
  return {
    id: crypto.randomUUID(),
    bankVersion: version,
    config: structuredClone(config),
    questions,
    answers: {},
    flags: [],
    checked: [],
    index: 0,
    startedAt: now,
    deadline: config.mode === "exam" ? now + config.minutes * 60000 : null,
    submittedAt: null,
    status: "active",
    seed,
  };
}
export function remaining(a: Attempt, now = Date.now()) {
  return a.deadline === null
    ? null
    : Math.max(0, Math.min(a.config.minutes * 60000, a.deadline - now));
}
export function finish(
  a: Attempt,
  now = Date.now(),
  reason = "Nộp bài",
): Attempt {
  return a.status === "submitted"
    ? a
    : {
        ...a,
        status: "submitted",
        submittedAt: Math.min(now, a.deadline ?? now),
        reason,
      };
}
export function grade(a: Attempt) {
  const correct = a.questions.filter(
      (q) => a.answers[q.id] === q.answer,
    ).length,
    blank = a.questions.filter((q) => a.answers[q.id] === undefined).length;
  return {
    correct,
    blank,
    wrong: a.questions.length - correct - blank,
    total: a.questions.length,
  };
}
export function replay(
  a: Attempt,
  version: string,
  wrongOnly = false,
  now = Date.now(),
): Attempt {
  const questions = a.questions
    .filter((q) => !wrongOnly || a.answers[q.id] !== q.answer)
    .map((q) => ({
      ...structuredClone(q),
      order: shuffle([0, 1, 2, 3], Math.random),
    }));
  if (!questions.length) throw Error("Bạn đã trả lời đúng tất cả các câu.");
  return {
    ...a,
    id: crypto.randomUUID(),
    bankVersion: version,
    config: {
      ...a.config,
      count: questions.length,
      mode: wrongOnly ? "practice" : a.config.mode,
    },
    questions,
    answers: {},
    flags: [],
    checked: [],
    index: 0,
    startedAt: now,
    deadline:
      wrongOnly || a.config.mode === "practice"
        ? null
        : now + a.config.minutes * 60000,
    status: "active",
    submittedAt: null,
    reason: undefined,
  };
}
export function safeUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}
export function validateQuestion(q: unknown): asserts q is Question {
  if (!q || typeof q !== "object") throw Error("Câu hỏi phải là một bản ghi.");
  const v = q as Question;
  for (const k of [
    "id",
    "section",
    "learningObjective",
    "prompt",
    "task",
    "explanation",
    "reviewStatus",
  ] as const)
    if (typeof v[k] !== "string" || !v[k].trim() || v[k].length > 50000)
      throw Error(`Thiếu hoặc sai trường ${k}.`);
  if (
    typeof v.clinicalVignette !== "string" ||
    !Number.isInteger(v.topic) ||
    v.topic < 1 ||
    v.topic > 6 ||
    !Number.isInteger(v.difficulty) ||
    v.difficulty < 1 ||
    v.difficulty > 4
  )
    throw Error(`Câu ${v.id}: topic, mức độ hoặc bệnh cảnh không hợp lệ.`);
  if (
    !Array.isArray(v.options) ||
    v.options.length !== 4 ||
    v.options.some((x) => typeof x !== "string" || !x.trim()) ||
    new Set(v.options.map((x) => x.trim())).size !== 4 ||
    !Number.isInteger(v.answer) ||
    v.answer < 0 ||
    v.answer > 3
  )
    throw Error(`Câu ${v.id}: cần bốn lựa chọn khác nhau và đáp án 0–3.`);
  if (
    !Array.isArray(v.optionExplanations) ||
    v.optionExplanations.length !== 4 ||
    v.optionExplanations.some((x) => typeof x !== "string" || !x.trim())
  )
    throw Error(`Câu ${v.id}: thiếu giải thích bốn phương án.`);
  if (
    !Array.isArray(v.sources) ||
    !v.sources.length ||
    v.sources.some(
      (s) => !s.title || (!s.file && !s.url) || (s.url && !safeUrl(s.url)),
    )
  )
    throw Error(`Câu ${v.id}: nguồn không hợp lệ.`);
  if (!Array.isArray(v.images))
    throw Error(`Câu ${v.id}: images phải là danh sách.`);
  if (v.images.length) {
    if (v.clinicalVignette.trim().length < 40 || !v.caseProvenance)
      throw Error(
        `Câu ${v.id}: câu hình cần bệnh cảnh cụ thể và nguồn gốc bệnh cảnh.`,
      );
    for (const im of v.images)
      if (
        !/^images\/[a-zA-Z0-9_.-]+\.(png|jpg|jpeg|gif|webp|svg)$/i.test(
          im.assetPath,
        ) ||
        !safeUrl(im.sourceUrl) ||
        !im.credit ||
        !im.license
      )
        throw Error(`Câu ${v.id}: ảnh/nguồn/quyền sử dụng không hợp lệ.`);
  }
}
export function validateBank(value: unknown) {
  if (!Array.isArray(value) || value.length > 20000)
    throw Error("Ngân hàng phải là danh sách không quá 20.000 câu.");
  const ids = new Set<string>(),
    prompts = new Set<string>(),
    warnings: string[] = [];
  for (const q of value) {
    validateQuestion(q);
    if (ids.has(q.id)) throw Error(`ID trùng: ${q.id}`);
    ids.add(q.id);
    const p = q.prompt
      .normalize("NFC")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();
    if (prompts.has(p)) warnings.push(`Nội dung trùng: ${q.id}`);
    prompts.add(p);
  }
  return { questions: value as Question[], warnings };
}
export function sharePayload(a: Attempt) {
  return {
    v: 1,
    bank: a.bankVersion,
    seed: a.seed,
    config: { ...a.config, name: "" },
    ids: a.questions.map((q) => q.id),
    orders: a.questions.map((q) => q.order),
  };
}
export function fromShare(
  value: unknown,
  bank: Question[],
  version: string,
  now = Date.now(),
): Attempt {
  const s = value as ReturnType<typeof sharePayload>;
  if (!s || s.v !== 1 || s.bank !== version)
    throw Error(
      "Liên kết cần đúng phiên bản ngân hàng. Hãy cập nhật website hoặc nhờ người gửi tạo lại đề.",
    );
  validateConfig(s.config);
  if (
    !Array.isArray(s.ids) ||
    s.ids.length !== s.config.count ||
    s.ids.length > 900 ||
    new Set(s.ids).size !== s.ids.length ||
    !Array.isArray(s.orders) ||
    s.orders.length !== s.ids.length
  )
    throw Error("Liên kết đề không hợp lệ.");
  const questions = s.ids.map((id, i) => {
    const q = bank.find((q) => q.id === id),
      o = s.orders[i];
    if (
      !q ||
      !s.config.topics.includes(q.topic) ||
      !Array.isArray(o) ||
      o.length !== 4 ||
      new Set(o).size !== 4 ||
      o.some((n) => !Number.isInteger(n) || n < 0 || n > 3)
    )
      throw Error("Câu hỏi hoặc thứ tự đáp án trong liên kết không hợp lệ.");
    return { ...structuredClone(q), order: o };
  });
  return {
    id: crypto.randomUUID(),
    bankVersion: version,
    config: { ...s.config, name: "" },
    questions,
    answers: {},
    flags: [],
    checked: [],
    index: 0,
    startedAt: now,
    deadline: s.config.mode === "exam" ? now + s.config.minutes * 60000 : null,
    submittedAt: null,
    status: "active",
    seed: s.seed,
  };
}
