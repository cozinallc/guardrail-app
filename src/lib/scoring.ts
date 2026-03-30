import { AssessmentItem, AssessmentItemWithBoost, AreaScore } from "@/types";
import { ITEMS, UC_BOOST, AREAS } from "@/data/items";

export function getFilteredItems(industry: string): AssessmentItem[] {
  return ITEMS.filter(
    (i) => i.industries.includes("all") || i.industries.includes(industry)
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

export function getItemScore(
  item: AssessmentItem,
  answers: Record<string, string>
): number {
  const opt = item.options.find((o) => o.oid === answers[item.id]);
  return opt ? opt.score : 0;
}

export function getAreaScores(
  items: AssessmentItem[],
  answers: Record<string, string>
): AreaScore {
  const scores: AreaScore = { input: 0, output: 0, ops: 0 };
  AREAS.forEach((area) => {
    const areaItems = items.filter((i) => i.area === area);
    if (areaItems.length > 0) {
      scores[area] = Math.round(
        areaItems.reduce((s, i) => s + getItemScore(i, answers), 0) /
          areaItems.length
      );
    }
  });
  return scores;
}

export function getTotalScore(
  items: AssessmentItem[],
  answers: Record<string, string>
): number {
  if (items.length === 0) return 0;
  return Math.round(
    items.reduce((s, i) => s + getItemScore(i, answers), 0) / items.length
  );
}

export function scoreColor(score: number): string {
  if (score >= 75) return "#059669";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}
