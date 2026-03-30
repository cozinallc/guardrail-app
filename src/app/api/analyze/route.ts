import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, isGeminiAvailable } from "@/lib/gemini";
import { generateFallbackSummary } from "@/lib/fallback";
import { TARGET_LEVEL, LEVEL_LABELS } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  const { profile, items, areaLevels, totalLevel } = await request.json();

  // Always generate fallback first
  const fallbackSummary = generateFallbackSummary(totalLevel, areaLevels);
  const fallbackInsights = items
    .filter((i: any) => i.level < TARGET_LEVEL)
    .map((i: any) => ({
      id: i.id,
      risk: i.insight?.risk || "",
      action: i.insight?.action || "",
      agent: i.insight?.agent || null,
    }));

  // If Gemini API is available, enhance insights
  if (isGeminiAvailable()) {
    try {
      const genAI = getGeminiClient()!;
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const itemsSummary = items
        .filter((i: any) => i.level < TARGET_LEVEL)
        .map(
          (i: any) =>
            `- ${i.id} ${i.title}: Lv.${i.level}（${LEVEL_LABELS[i.level] || "不明"}）(回答: ${i.answer})${i.note ? ` 補足: ${i.note}` : ""} [${i.legal}]`
        )
        .join("\n");

      const prompt = `あなたはAIガードレール診断の専門家です。
以下の診断結果に基づき、JSONで回答してください。

成熟度モデル: Lv.0=未対策、Lv.1=ルール化、Lv.2=仕組み化、Lv.3=構造的防止
推奨レベル: Lv.2（仕組み化）

業界: ${profile.industry}
ユースケース: ${profile.useCases}
全体平均: Lv.${totalLevel}
領域別: 入力Lv.${areaLevels.input} / 出力Lv.${areaLevels.output} / 運用Lv.${areaLevels.ops}

推奨レベル未満の項目:
${itemsSummary}

以下のJSON形式で出力してください（余計な説明不要、JSONのみ）:
{
  "summary": "総合所見を2〜3文で。ユースケースに即した具体的な内容にしてください。",
  "items": [
    {
      "id": "A1",
      "risk": "なぜ危ないか1〜2文。法律用語は使わずやさしい日本語で。",
      "action": "具体的な推奨アクション1〜2文。",
      "agent": "エージェント化での対応方法（該当しない場合はnull）"
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch (e) {
      console.error("Gemini analyze error:", e);
    }
  }

  return NextResponse.json({
    summary: fallbackSummary,
    items: fallbackInsights,
  });
}
