"use client";
import { AssessmentItemWithBoost } from "@/types";
import { AREAS, AREA_LABELS, AREA_COLORS, AREA_BG } from "@/data/items";

interface Props {
  items: AssessmentItemWithBoost[];
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  notes: Record<string, string>;
  setNotes: (n: Record<string, string>) => void;
  onNext: () => void;
}

export default function StepAssessment({
  items,
  answers,
  setAnswers,
  notes,
  setNotes,
  onNext,
}: Props) {
  const total = items.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total && total > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs text-slate-500 mb-2">STEP 2 / 3</p>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          対策状況の確認
        </h2>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-8 mt-4">
          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${total ? (answered / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">
            {answered}/{total}
          </span>
        </div>

        {AREAS.map((area) => {
          const areaItems = items.filter((i) => i.area === area);
          if (!areaItems.length) return null;
          return (
            <div key={area} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-1 h-6 rounded"
                  style={{ backgroundColor: AREA_COLORS[area] }}
                />
                <h3 className="text-lg font-semibold text-slate-900">
                  {AREA_LABELS[area]}
                </h3>
              </div>

              {areaItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-4 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {item.boosted && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium shrink-0 mt-0.5">
                        重点
                      </span>
                    )}
                    <p className="text-sm font-medium text-slate-700">
                      {item.title}
                    </p>
                  </div>

                  <p
                    className="text-sm text-slate-500 leading-relaxed rounded-lg p-3 mb-3"
                    style={{ backgroundColor: AREA_BG[item.area] }}
                  >
                    {item.scenario}
                  </p>

                  <div className="flex flex-col gap-1.5 mb-3">
                    {item.options.map((opt) => (
                      <button
                        key={opt.oid}
                        onClick={() =>
                          setAnswers({ ...answers, [item.id]: opt.oid })
                        }
                        className={`p-2.5 rounded-lg text-sm text-left transition-colors ${
                          answers[item.id] === opt.oid
                            ? "border-2 font-medium"
                            : "border border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                        style={
                          answers[item.id] === opt.oid
                            ? {
                                borderColor: AREA_COLORS[item.area],
                                backgroundColor: AREA_BG[item.area],
                                color: "#334155",
                              }
                            : {}
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="補足（任意）"
                    value={notes[item.id] || ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [item.id]: e.target.value })
                    }
                    className="w-full p-2 rounded-md border border-slate-200 text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>
          );
        })}

        <button
          onClick={onNext}
          disabled={!allAnswered}
          className={`w-full py-4 rounded-lg text-base font-semibold transition-colors mt-2 ${
            allAnswered
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-slate-300 text-white cursor-not-allowed"
          }`}
        >
          {allAnswered
            ? "診断結果を見る →"
            : `あと${total - answered}項目`}
        </button>
      </div>
    </div>
  );
}
