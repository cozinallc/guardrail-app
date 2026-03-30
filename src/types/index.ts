export type Area = "input" | "output" | "ops";

export interface Option {
  oid: string;
  label: string;
  score: number;
}

export interface Insight {
  risk: string;
  action: string;
  agent: string | null;
}

export interface AssessmentItem {
  id: string;
  area: Area;
  title: string;
  scenario: string;
  options: Option[];
  legal: string;
  industries: string[];
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
