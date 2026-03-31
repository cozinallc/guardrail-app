import { AssessmentItem, AssessmentItemWithBoost, AreaScore } from "@/types";
import { ITEMS, UC_BOOST, AREAS } from "@/data/items";

// 最低推奨レベル（全項目統一）
export const TARGET_LEVEL = 2;

// レベル名称
export const LEVEL_LABELS: Record<number, string> = {
  0: "未対策",
  1: "ルール化",
  2: "仕組み化",
  3: "構造的防止",
};

/**
 * 業界 + ユースケースで項目をフィルタリング
 */
export function getFilteredItems(
  industry: string,
  useCases: string
): AssessmentItem[] {
  const industryFiltered = ITEMS.filter(
    (i) => i.industries.includes("all") || i.industries.includes(industry)
  );

  const boostedIds = new Set<string>();
  if (useCases) {
    Object.entries(UC_BOOST).forEach(([kw, ids]) => {
      if (useCases.includes(kw)) ids.forEach((id) => boostedIds.add(id));
    });
  }

  return industryFiltered.filter(
    (i) => i.alwaysShow || boostedIds.has(i.id)
  );
}

export function applyBoost(
  items: AssessmentItem[],
  useCases: string
): AssessmentItemWithBoost[] {
  const boosted = new Set<string>();
  if (useCases) {
    Object.entries(UC_BOOST).forEach(([kw, ids]) => {
      if (useCases.includes(kw)) ids.forEach((id) => boosted.add(id));
    });
  }
  return items.map((i) => ({ ...i, boosted: boosted.has(i.id) }));
}

/**
 * 項目の現在レベルを取得（0〜3）
 */
export function getItemLevel(
  item: AssessmentItem,
  answers: Record<string, string>
): number {
  const opt = item.options.find((o) => o.oid === answers[item.id]);
  return opt ? opt.level : 0;
}

/**
 * 領域ごとの平均レベル（小数1桁）
 */
export function getAreaLevels(
  items: AssessmentItem[],
  answers: Record<string, string>
): AreaScore {
  const levels: AreaScore = { input: 0, output: 0, ops: 0 };
  AREAS.forEach((area) => {
    const areaItems = items.filter((i) => i.area === area);
    if (areaItems.length > 0) {
      const avg =
        areaItems.reduce((s, i) => s + getItemLevel(i, answers), 0) /
        areaItems.length;
      levels[area] = Math.round(avg * 10) / 10; // 小数1桁
    }
  });
  return levels;
}

/**
 * 全体の平均レベル（小数1桁）
 */
export function getTotalLevel(
  items: AssessmentItem[],
  answers: Record<string, string>
): number {
  if (items.length === 0) return 0;
  const avg =
    items.reduce((s, i) => s + getItemLevel(i, answers), 0) / items.length;
  return Math.round(avg * 10) / 10;
}

/**
 * レベルに基づく色
 */
export function levelColor(level: number): string {
  if (level >= 2) return "#059669"; // 緑: 仕組み化以上
  if (level >= 1) return "#d97706"; // 黄: ルール化
  return "#dc2626";                 // 赤: 未対策
}
