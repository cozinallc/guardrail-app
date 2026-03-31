"use client";
import { useState, useEffect } from "react";
import { AssessmentItemWithBoost, Profile, AnalyzeResult } from "@/types";
import { AREAS, AREA_LABELS, AREA_COLORS, INDUSTRIES } from "@/data/items";
import {
  getItemLevel,
  getAreaLevels,
  getTotalLevel,
  levelColor,
  TARGET_LEVEL,
  LEVEL_LABELS,
} from "@/lib/scoring";
import RadarChart from "./RadarChart";
import RoadmapSection from "./RoadmapSection";
import CTASection from "./CTASection";

interface Props {
  items: AssessmentItemWithBoost[];
  answers: Record<string, string>;
  notes: Record<string, string>;
  profile: Profile;
  onReset: () => void;
}

export default function StepResult({
  items,
  answers,
  notes,
  profile,
  onReset,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [downloading, setDownloading] = useState(false);

  const areaLevels = getAreaLevels(items, answers);
  const totalLevel = getTotalLevel(items, answers);

  // Fetch LLM analysis on mount
  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            items: items.map((i) => ({
              id: i.id,
              title: i.title,
              area: i.area,
              level: getItemLevel(i, answers),
              answer:
                i.options.find((o) => o.oid === answers[i.id])?.label || "",
              note: notes[i.id] || "",
              legal: i.legal,
              insight: i.insight,
            })),
            areaLevels,
            totalLevel,
          }),
        });
        const data = await res.json();
        setAnalysis(data);
      } catch {
        // Use fallback if API fails
      }
    }
    fetchAnalysis();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          items: items.map((i) => ({
            id: i.id,
            title: i.title,
            area: i.area,
            level: getItemLevel(i, answers),
            answer:
              i.options.find((o) => o.oid === answers[i.id])?.label || "",
            note: notes[i.id] || "",
            legal: i.legal,
            insight: i.insight,
          })),
          areaLevels,
          totalLevel,
          summary:
            analysis?.summary ||
            `全体の平均レベルはLv.${totalLevel}です。`,
          email,
        }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AI_Guardrail_Report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF download failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  // Get insight for an item - prefer LLM analysis, fallback to hardcoded
  const getInsight = (itemId: string) => {
    if (analysis?.items) {
      const llmInsight = analysis.items.find((i) => i.id === itemId);
      if (llmInsight) return llmInsight;
    }
    const item = items.find((i) => i.id === itemId);
    return item?.insight || null;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">診断結果</h2>

        {/* Area level cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {AREAS.map((area) => (
            <div
              key={area}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div
                  className="w-1 h-4 rounded"
                  style={{ backgroundColor: AREA_COLORS[area] }}
                />
                <span className="text-xs font-semibold text-slate-600">
                  {AREA_LABELS[area]}
                </span>
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: levelColor(areaLevels[area]) }}
              >
                Lv.{areaLevels[area]}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                最低推奨: Lv.{TARGET_LEVEL}（{LEVEL_LABELS[TARGET_LEVEL]}）
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <p className="text-sm text-slate-700 leading-relaxed">
            {analysis?.summary ||
              `全体の平均レベルはLv.${totalLevel}です。${
                areaLevels.ops < 1
                  ? "運用・管理面の整備が急務です。"
                  : ""
              }${
                areaLevels.output < 1
                  ? "出力側のチェック体制にギャップがあります。"
                  : ""
              }推奨レベルはLv.2（仕組み化）です。まずルール策定と環境設定から着手し、技術的な制御の導入を検討されることを推奨します。`}
          </p>
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
          <RadarChart
            labels={items.map((i) => i.title)}
            data={items.map((i) => getItemLevel(i, answers))}
            target={items.map(() => TARGET_LEVEL)}
          />
        </div>

        {/* Item details */}
        {AREAS.map((area) => {
          const areaItems = items.filter((i) => i.area === area);
          if (!areaItems.length) return null;
          return (
            <div key={area} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-1 h-5 rounded"
                  style={{ backgroundColor: AREA_COLORS[area] }}
                />
                <h3 className="text-base font-semibold text-slate-900">
                  {AREA_LABELS[area]}
                </h3>
              </div>

              {areaItems.map((item) => {
                const lvl = getItemLevel(item, answers);
                const isExpanded = expanded === item.id;
                const selectedOption = item.options.find(
                  (o) => o.oid === answers[item.id]
                );
                const insight = getInsight(item.id);

                return (
                  <div
                    key={item.id}
                    className="mb-1 rounded-xl border border-slate-200 bg-white overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpanded(isExpanded ? null : item.id)
                      }
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: levelColor(lvl) }}
                      />
                      <span className="flex-1 text-sm text-slate-700">
                        {item.title}
                      </span>
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{ color: levelColor(lvl) }}
                      >
                        Lv.{lvl}
                      </span>
                      <span
                        className={`text-[10px] text-slate-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 text-sm leading-relaxed">
                        <div className="text-xs text-slate-500 mb-3">
                          回答：{selectedOption?.label || "未回答"}
                          {notes[item.id] && ` / ${notes[item.id]}`}
                        </div>

                        {lvl < TARGET_LEVEL && insight?.risk && (
                          <div className="bg-red-50 rounded-lg p-3 mb-2">
                            <div className="font-semibold text-red-900 text-[11px] mb-1">
                              リスク
                            </div>
                            <div className="text-red-800 text-sm">
                              {insight.risk}
                            </div>
                          </div>
                        )}

                        {lvl < TARGET_LEVEL && insight?.action && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-2">
                            <div className="font-semibold text-blue-900 text-[11px] mb-1">
                              推奨アクション
                            </div>
                            <div className="text-blue-800 text-sm">
                              {insight.action}
                            </div>
                          </div>
                        )}

                        {lvl < TARGET_LEVEL && insight?.agent && (
                          <div className="bg-emerald-50 rounded-lg p-3 mb-2">
                            <div className="font-semibold text-emerald-900 text-[11px] mb-1">
                              エージェント化
                            </div>
                            <div className="text-emerald-800 text-sm">
                              {insight.agent}
                            </div>
                          </div>
                        )}

                        {lvl >= TARGET_LEVEL && (
                          <div className="bg-emerald-50 rounded-lg p-3">
                            <div className="text-emerald-800 text-sm">
                              現在の対策を維持してください。
                            </div>
                          </div>
                        )}

                        {/* 4段階ロードマップ */}
                        {lvl < TARGET_LEVEL && item.insight?.roadmap && (
                          <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 px-3 py-2">
                              <span className="text-[11px] font-semibold text-slate-700">4段階ロードマップ</span>
                            </div>
                            {[
                              { key: "lv1" as const, label: "Lv.1 ルール", color: "#dc2626", bg: "#fef2f2" },
                              { key: "lv2" as const, label: "Lv.2 環境制限", color: "#d97706", bg: "#fffbeb" },
                              { key: "lv3" as const, label: "Lv.3 エージェント", color: "#059669", bg: "#ecfdf5" },
                              { key: "lv4" as const, label: "Lv.4 専用製品", color: "#7c3aed", bg: "#f5f3ff" },
                            ].map((lv) => {
                              const rm = item.insight.roadmap[lv.key];
                              return (
                                <div key={lv.key} className="border-t border-slate-100 px-3 py-2">
                                  <div className="text-[10px] font-semibold mb-1" style={{ color: lv.color }}>{lv.label}</div>
                                  <div className="text-xs text-slate-600 leading-relaxed">{rm.do}</div>
                                  <div className="flex gap-3 mt-1">
                                    <span className="text-[10px] text-emerald-700">止められる: {rm.stops}</span>
                                    <span className="text-[10px] text-red-600">限界: {rm.cantStop}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 mt-2">
                          {item.legal}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Roadmap */}
        <RoadmapSection />

        {/* PDF Download */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            レポートのダウンロード
          </h3>
          <div className="mb-4">
            <label className="text-xs text-slate-500 block mb-2">
              メールアドレス（任意）
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {downloading ? "生成中..." : "レポートをダウンロード（PDF）"}
          </button>
        </div>

        {/* CTA */}
        <CTASection />

        {/* Reset */}
        <button
          onClick={onReset}
          className="w-full py-3 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm hover:bg-slate-50 transition-colors"
        >
          最初からやり直す
        </button>
      </div>
    </div>
  );
}
