"use client";

const ROADMAP = [
  {
    title: "すぐやる（1ヶ月以内）",
    level: "Lv.1〜2",
    color: "#dc2626",
    bg: "#fef2f2",
    description: "ルール策定・環境設定の最適化",
  },
  {
    title: "次にやる（3ヶ月以内）",
    level: "Lv.3",
    color: "#059669",
    bg: "#ecfdf5",
    description: "エージェント化の検討・構築",
  },
  {
    title: "将来的に検討（6ヶ月〜）",
    level: "Lv.4",
    color: "#7c3aed",
    bg: "#f5f3ff",
    description: "専用製品の導入（Bedrock Guardrails等）",
  },
];

export default function RoadmapSection() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        推奨ロードマップ
      </h3>
      {ROADMAP.map((r, i) => (
        <div key={i} className="flex gap-3 mb-3 last:mb-0">
          <div className="min-w-[120px]">
            <div className="text-xs font-semibold" style={{ color: r.color }}>
              {r.title}
            </div>
            <div className="text-[10px] text-slate-400">{r.level}</div>
          </div>
          <div
            className="flex-1 rounded-lg px-3 py-2"
            style={{ backgroundColor: r.bg }}
          >
            <span className="text-sm text-slate-700">{r.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
