import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, isGeminiAvailable } from "@/lib/gemini";
import { generateFallbackSummary, getFallbackInsights } from "@/lib/fallback";

export async function POST(request: NextRequest) {
  const { profile, items, areaScores, totalScore } = await request.json();

  // Always generate fallback first
  const fallbackSummary = generateFallbackSummary(totalScore, areaScores);
  const fallbackInsights = items
    .filter((i: any) => i.score < 75)
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
        .filter((i: any) => i.score < 75)
        .map(
          (i: any) =>
            `- ${i.id} ${i.title}: ${i.score}点 (回答: ${i.answer})${i.note ? ` 補足: ${i.note}` : ""} [${i.legal}]`
        )
        .join("\n");

      const prompt = `あなたはAIガードレール診断の専門家です。
以下の診断結果に基づき、JSONで回答してください。

業界: ${profile.industry}
ユースケース: ${profile.useCases}
総合スコア: ${totalScore}%
領域別: 入力${areaScores.input}% / 出力${areaScores.output}% / 運用${areaScores.ops}%

スコア75未満の項目:
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
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch (e) {
      console.error("Gemini analyze error:", e);
    }
  }

  // Return fallback
  return NextResponse.json({
    summary: fallbackSummary,
    items: fallbackInsights,
  });
}
