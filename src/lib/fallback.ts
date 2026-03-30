import { AssessmentItem, AreaScore } from "@/types";
import { AREA_LABELS } from "@/data/items";
import { TARGET_LEVEL, LEVEL_LABELS } from "./scoring";

export function generateFallbackSummary(
  totalLevel: number,
  areaLevels: AreaScore
): string {
  const weakAreas: string[] = [];
  if (areaLevels.input < TARGET_LEVEL) weakAreas.push(AREA_LABELS.input);
  if (areaLevels.output < TARGET_LEVEL) weakAreas.push(AREA_LABELS.output);
  if (areaLevels.ops < 1) weakAreas.push(AREA_LABELS.ops);

  if (totalLevel >= TARGET_LEVEL) {
    return `全体の平均レベルはLv.${totalLevel}で、推奨レベル（Lv.${TARGET_LEVEL}: ${LEVEL_LABELS[TARGET_LEVEL]}）を達成しています。引き続き現在の体制を維持しつつ、定期的な見直しを行ってください。`;
  }
  if (totalLevel >= 1) {
    return `全体の平均レベルはLv.${totalLevel}です。${weakAreas.length > 0 ? weakAreas.join("・") + "の対策にギャップがあります。" : ""}推奨レベルはLv.${TARGET_LEVEL}（${LEVEL_LABELS[TARGET_LEVEL]}）です。ルールの策定に加えて、環境設定や技術的な制御の導入を検討してください。`;
  }
  return `全体の平均レベルはLv.${totalLevel}で、対策の整備が急務です。${weakAreas.length > 0 ? "特に" + weakAreas.join("・") + "の対策が不十分です。" : ""}まずAI利用ルールの策定（Lv.1）から始め、環境設定の最適化（Lv.2）を目指してください。`;
}

export function getFallbackInsights(
  items: AssessmentItem[],
  answers: Record<string, string>
) {
  return items
    .filter((item) => {
      const opt = item.options.find((o) => o.oid === answers[item.id]);
      return opt ? opt.level < TARGET_LEVEL : true;
    })
    .map((item) => ({
      id: item.id,
      risk: item.insight.risk,
      action: item.insight.action,
      agent: item.insight.agent,
    }));
}
