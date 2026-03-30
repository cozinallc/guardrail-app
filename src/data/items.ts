import { IndustryOption, VendorOption, PolicyOption } from "@/types";
import { INPUT_ITEMS } from "./items-input";
import { OUTPUT_ITEMS } from "./items-output";
import { OPS_ITEMS } from "./items-ops";

export const INDUSTRIES: IndustryOption[] = [
  { id: "ma", label: "M&A / 金融アドバイザリー" },
  { id: "finance", label: "金融（銀行・証券・保険）" },
  { id: "it", label: "IT / SI" },
  { id: "manufacturing", label: "製造" },
  { id: "healthcare", label: "医療" },
  { id: "other", label: "その他" },
];

export const VENDORS: VendorOption[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "copilot", label: "Microsoft Copilot" },
  { id: "gemini", label: "Gemini" },
  { id: "other", label: "その他" },
];

export const POLICIES: PolicyOption[] = [
  { id: "yes", label: "ある" },
  { id: "wip", label: "作成中" },
  { id: "no", label: "ない" },
  { id: "unknown", label: "わからない" },
];

export const UC_BOOST: Record<string, string[]> = {
  "候補": ["B1", "B2", "B8"],
  "探索": ["B1", "B2", "B8"],
  "ノンネーム": ["A1", "A2", "B2", "B4", "C2"],
  "DD": ["A1", "A2", "A3", "A4", "A9", "A11", "B1", "B2", "B4", "B8", "B9", "C2", "C11", "C13"],
  "バリュエーション": ["A2", "B1", "B8", "C13"],
  "契約書": ["A2", "A4", "B1", "B5", "B9"],
  "戦略": ["A2", "A4", "B2", "A11"],
  "リサーチ": ["A8", "B1", "B5", "B10"],
  "分析": ["A2", "B1", "B8"],
  "評価": ["A2", "B1", "B8"],
  "レポート": ["B1", "B5", "B6", "B10"],
  "社内チャット": ["A1", "A4", "C3"],
  "顧客対応": ["B1", "B3", "B6", "B7"],
  "議事録": ["A1", "A4", "A9"],
  "翻訳": ["A8", "B5"],
  "クロスボーダー": ["C12", "C14", "A7"],
  "反社": ["C11"],
  "コンプライアンス": ["C9", "C10", "C14"],
  "エージェント": ["A6", "A10", "C7"],
};

export const AREA_LABELS: Record<string, string> = {
  input: "入力側",
  output: "出力側",
  ops: "運用・管理",
};

export const AREA_COLORS: Record<string, string> = {
  input: "#2563eb",
  output: "#059669",
  ops: "#7c3aed",
};

export const AREA_BG: Record<string, string> = {
  input: "#eff6ff",
  output: "#ecfdf5",
  ops: "#f5f3ff",
};

export const AREAS = ["input", "output", "ops"] as const;

// 全35項目を統合
export const ITEMS = [...INPUT_ITEMS, ...OUTPUT_ITEMS, ...OPS_ITEMS];
