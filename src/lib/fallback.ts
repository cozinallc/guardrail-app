import { AssessmentItem, AreaScore, Profile } from "@/types";
import { AREA_LABELS } from "@/data/items";

export function generateFallbackSummary(
  totalScore: number,
  areaScores: AreaScore
): string {
  const weakAreas: string[] = [];
  if (areaScores.input < 50) weakAreas.push(AREA_LABELS.input);
  if (areaScores.output < 50) weakAreas.push(AREA_LABELS.output);
  if (areaScores.ops < 30) weakAreas.push(AREA_LABELS.ops);

  if (totalScore >= 75) {
    return `総合スコアは${totalScore}%で、全体的に良好な対策状況です。引き続き現在の体制を維持しつつ、定期的な見直しを行ってください。`;
  }
  if (totalScore >= 40) {
    return `総合スコアは${totalScore}%です。${weakAreas.length > 0 ? weakAreas.join("・") + "の対策にギャップがあります。" : ""}まずルール策定と環境設定から着手し、エージェント化による技術的な対策を検討されることを推奨します。`;
  }
  return `総合スコアは${totalScore}%で、対策の整備が急務です。${weakAreas.length > 0 ? "特に" + weakAreas.join("・") + "の対策が不十分です。" : ""}まずAI利用ルールの策定と環境設定の最適化から始めてください。`;
}

export function getFallbackInsights(
  items: AssessmentItem[],
  answers: Record<string, string>
) {
  return items
    .filter((item) => {
      const opt = item.options.find((o) => o.oid === answers[item.id]);
      return opt ? opt.score < 75 : true;
    })
    .map((item) => ({
      id: item.id,
      risk: item.insight.risk,
      action: item.insight.action,
      agent: item.insight.agent,
    }));
}
