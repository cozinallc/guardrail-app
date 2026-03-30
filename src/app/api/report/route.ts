import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { profile, items, areaLevels, totalLevel, summary, email } =
    await request.json();

  const AREA_LABELS: Record<string, string> = {
    input: "入力側",
    output: "出力側",
    ops: "運用・管理",
  };

  const lines: string[] = [];
  lines.push("=".repeat(60));
  lines.push("  AIガードレール・ギャップ診断レポート");
  lines.push("=".repeat(60));
  lines.push("");
  lines.push(`業界: ${profile.industry}`);
  lines.push(`AIサービス: ${profile.vendors?.join(", ")}`);
  lines.push(`ユースケース: ${profile.useCases}`);
  lines.push("");
  lines.push("-".repeat(60));
  lines.push("  第1部：成熟度レベルとサマリ");
  lines.push("-".repeat(60));
  lines.push("");
  lines.push(`全体平均: Lv.${totalLevel}（推奨: Lv.2 仕組み化）`);
  lines.push(`  入力側: Lv.${areaLevels.input}`);
  lines.push(`  出力側: Lv.${areaLevels.output}`);
  lines.push(`  運用・管理: Lv.${areaLevels.ops}`);
  lines.push("");
  lines.push(`所見: ${summary}`);
  lines.push("");

  lines.push("-".repeat(60));
  lines.push("  第2部：全項目詳細");
  lines.push("-".repeat(60));
  lines.push("");

  const areas = ["input", "output", "ops"];
  areas.forEach((area) => {
    const areaItems = items.filter((i: any) => i.area === area);
    if (areaItems.length === 0) return;
    lines.push(`■ ${AREA_LABELS[area]}`);
    lines.push("");

    areaItems.forEach((item: any) => {
      const LEVEL_NAMES: Record<number, string> = { 0: "未対策", 1: "ルール化", 2: "仕組み化", 3: "構造的防止" };
      const badge = item.level >= 2 ? "[OK]" : item.level >= 1 ? "[注意]" : "[要対策]";
      lines.push(`  ${badge} ${item.title} [Lv.${item.level}: ${LEVEL_NAMES[item.level] || "不明"}]`);
      lines.push(`  現状: ${item.answer}`);
      if (item.note) lines.push(`  補足: ${item.note}`);

      if (item.level < 2) {
        if (item.insight?.risk)
          lines.push(`  リスク: ${item.insight.risk}`);
        if (item.insight?.action)
          lines.push(`  推奨アクション: ${item.insight.action}`);
        if (item.insight?.agent)
          lines.push(`  エージェント化: ${item.insight.agent}`);
      }
      lines.push(`  根拠法令: ${item.legal}`);
      lines.push("");
    });
  });

  lines.push("-".repeat(60));
  lines.push("  第3部：推奨ロードマップ");
  lines.push("-".repeat(60));
  lines.push("");
  lines.push("▶ すぐやる（1ヶ月以内）[Lv.1〜2]");
  lines.push("  ルール策定・環境設定の最適化");
  lines.push("");
  lines.push("▶ 次にやる（3ヶ月以内）[Lv.3]");
  lines.push("  エージェント化の検討・構築");
  lines.push("");
  lines.push("▶ 将来的に検討（6ヶ月〜）[Lv.4]");
  lines.push("  専用製品の導入（Bedrock Guardrails等）");
  lines.push("");

  lines.push("-".repeat(60));
  lines.push("  第4部：エージェント化提案");
  lines.push("-".repeat(60));
  lines.push("");
  lines.push(
    "ルール（Lv.1）と環境設定（Lv.2）だけでは「うっかりミス」や"
  );
  lines.push(
    "「意図的な迂回」を防げません。以下はエージェント化（Lv.3）で"
  );
  lines.push("技術的に解決できる領域です。");
  lines.push("");
  lines.push("・案件間の情報分離 → 案件別エージェントで構造的に防止");
  lines.push("・入力フィルタリング → PII・機密情報の自動検知・ブロック");
  lines.push("・利用ログの自動取得 → エージェント経由で全記録");
  lines.push("・出力チェック → 機密情報・PII自動マスキング");
  lines.push("・Shadow AI対策 → エージェント経由のみ利用許可");
  lines.push("");
  lines.push("=".repeat(60));
  lines.push(
    "  エージェント設計・構築のご相談はお気軽にお問い合わせください"
  );
  lines.push("=".repeat(60));

  const content = lines.join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="AI_Guardrail_Report.txt"',
    },
  });
}
