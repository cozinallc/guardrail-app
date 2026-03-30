import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, isGeminiAvailable } from "@/lib/gemini";
import { ITEMS, UC_BOOST } from "@/data/items";

export async function POST(request: NextRequest) {
  const { industry, useCases } = await request.json();

  // Fallback: keyword matching
  const boosted = new Set<string>();
  if (useCases) {
    Object.entries(UC_BOOST).forEach(([kw, ids]) => {
      if (useCases.includes(kw)) ids.forEach((id) => boosted.add(id));
    });
  }

  // If Gemini API is available, enhance with LLM
  if (isGeminiAvailable()) {
    try {
      const genAI = getGeminiClient()!;
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const itemList = ITEMS.map((i) => `${i.id}: ${i.title}`).join("\n");
      const prompt = `あなたはAIガードレールの専門家です。
以下のマスターリストから、ユーザーの業界とユースケースに特に重要な項目を選定してください。

マスターリスト:
${itemList}

業界: ${industry}
ユースケース: ${useCases}

重要度が高い項目のIDだけをカンマ区切りで出力してください。例: A1,A3,B1,C2
余計な説明は不要です。`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const ids = text.split(/[,\s]+/).filter((id) => /^[ABC]\d+$/.test(id));
      ids.forEach((id) => boosted.add(id));
    } catch (e) {
      console.error("Gemini mapping error:", e);
    }
  }

  return NextResponse.json({
    boostedIds: Array.from(boosted),
  });
}
