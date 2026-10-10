export type Source = {
  title: string;
  file?: string;
  page?: number;
  evidence?: string;
  url?: string;
  year?: string | number;
  accessed?: string;
};
export type ClinicalImage = {
  id: string;
  assetPath: string;
  sourceUrl: string;
  figure?: string;
  credit: string;
  license: string;
  licenseUrl?: string;
};
export type Question = {
  id: string;
  topic: number;
  section: string;
  difficulty: number;
  learningObjective: string;
  prompt: string;
  clinicalVignette: string;
  task: string;
  options: string[];
  answer: number;
  explanation: string;
  optionExplanations: string[];
  sources: Source[];
  images: ClinicalImage[];
  caseGroup?: string;
  caseProvenance?: string;
  reviewStatus: string;
};
export type Config = {
  name: string;
  topics: number[];
  count: number;
  minutes: number;
  ratios: number[];
  imagePercent: number;
  mode: "exam" | "practice";
  topicWeights: number[];
  sections?: string[];
};
export type ExamQuestion = Question & { order: number[] };
export type Attempt = {
  id: string;
  bankVersion: string;
  config: Config;
  questions: ExamQuestion[];
  answers: Record<string, number>;
  flags: string[];
  checked: string[];
  index: number;
  startedAt: number;
  deadline: number | null;
  submittedAt: number | null;
  status: "active" | "submitted";
  seed: number;
  reason?: string;
};
export type Metadata = {
  version: string;
  count: number;
  topics: Record<string, number>;
  images: number;
  builtAt: string;
};
export const topics = [
  {
    id: 1,
    name: "Xuất huyết tử cung bất thường",
    short: "AUB",
    caption: "Chu kỳ · Nội mạc · Xuất huyết thai kỳ",
    color: "#dceadf",
    glyph: "◉",
  },
  {
    id: 2,
    name: "Nhiễm trùng sinh dục & STI",
    short: "STI",
    caption: "Viêm âm đạo · Viêm vùng chậu · Dự phòng",
    color: "#e5e5f2",
    glyph: "✳",
  },
  {
    id: 3,
    name: "U xơ & bệnh tuyến-cơ tử cung",
    short: "Tử cung",
    caption: "Bệnh học · Hình ảnh · Lựa chọn điều trị",
    color: "#f5e5d2",
    glyph: "◎",
  },
  {
    id: 4,
    name: "Khối u buồng trứng",
    short: "Phần phụ",
    caption: "Siêu âm · MRI · Phân tầng nguy cơ",
    color: "#dce9ee",
    glyph: "◌",
  },
  {
    id: 5,
    name: "HPV & tổn thương cổ tử cung",
    short: "Cổ tử cung",
    caption: "Tầm soát · CIN · Quản lý bất thường",
    color: "#efdfdf",
    glyph: "◇",
  },
  {
    id: 6,
    name: "Tránh thai & phá thai an toàn",
    short: "Sức khỏe sinh sản",
    caption: "Tư vấn · Lựa chọn phương pháp · Theo dõi",
    color: "#e9ead4",
    glyph: "✦",
  },
];
export const levels = ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"];
export const defaultConfig: Config = {
  name: "",
  topics: [1, 2, 3, 4, 5, 6],
  count: 90,
  minutes: 90,
  ratios: [10, 10, 40, 40],
  imagePercent: 20,
  mode: "exam",
  topicWeights: [1, 1, 1, 1, 1, 1],
};
