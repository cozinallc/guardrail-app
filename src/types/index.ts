export type Area = "input" | "output" | "ops";

export interface Option {
  oid: string;
  label: string;
  score: number;
}

export interface RoadmapLevel {
  do: string;        // 具体的にやること
  stops: string;     // 止められるもの
  cantStop: string;  // 止められないもの
}

export interface Roadmap {
  lv1: RoadmapLevel; // ルール
  lv2: RoadmapLevel; // 環境制限
  lv3: RoadmapLevel; // エージェント化
  lv4: RoadmapLevel; // 専用製品
}

export interface Insight {
  risk: string;
  action: string;
  agent: string | null;
  roadmap: Roadmap;
}

export interface AssessmentItem {
  id: string;
  area: Area;
  title: string;
  scenario: string;
  options: Option[];
  legal: string;
  industries: string[];
  alwaysShow: boolean;   // trueなら業界・ユースケースに関係なく常に表示
  targetScore: number;   // 推奨レベル（100=必須, 66=推奨, 33=将来検討）
  insight: Insight;
}

export interface AssessmentItemWithBoost extends AssessmentItem {
  boosted: boolean;
}

export interface Profile {
  industry: string;
  vendors: string[];
  policy: string;
  useCases: string;
}

export interface AreaScore {
  input: number;
  output: number;
  ops: number;
}

export interface AnalyzeResult {
  summary: string;
  items: Array<{
    id: string;
    risk: string;
    action: string;
    agent: string | null;
  }>;
}

export interface IndustryOption {
  id: string;
  label: string;
}

export interface VendorOption {
  id: string;
  label: string;
}

export interface PolicyOption {
  id: string;
  label: string;
}
