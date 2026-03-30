"use client";
import { Profile, IndustryOption, VendorOption, PolicyOption } from "@/types";
import { INDUSTRIES, VENDORS, POLICIES } from "@/data/items";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
  onNext: () => void;
}

export default function StepProfile({ profile, setProfile, onNext }: Props) {
  const isValid =
    profile.industry &&
    profile.vendors.length > 0 &&
    profile.policy &&
    profile.useCases.trim();

  const toggleVendor = (id: string) => {
    const vendors = profile.vendors.includes(id)
      ? profile.vendors.filter((v) => v !== id)
      : [...profile.vendors, id];
    setProfile({ ...profile, vendors });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs text-slate-500 mb-2">STEP 1 / 3</p>
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          御社のAI利用状況
        </h2>

        {/* Q1: Industry */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-slate-700 block mb-3">
            Q1. 業界
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INDUSTRIES.map((i: IndustryOption) => (
              <button
                key={i.id}
                onClick={() => setProfile({ ...profile, industry: i.id })}
                className={`p-3 rounded-lg text-sm text-left transition-colors ${
                  profile.industry === i.id
                    ? "border-2 border-blue-600 bg-blue-50 text-slate-800"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Vendors */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-slate-700 block mb-3">
            Q2. AIサービス（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {VENDORS.map((v: VendorOption) => {
              const selected = profile.vendors.includes(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => toggleVendor(v.id)}
                  className={`px-5 py-2.5 rounded-full text-sm transition-colors ${
                    selected
                      ? "border-2 border-blue-600 bg-blue-50 text-slate-800"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {selected && "✓ "}
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Q3: Policy */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-slate-700 block mb-3">
            Q3. AI利用ルール
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POLICIES.map((p: PolicyOption) => (
              <button
                key={p.id}
                onClick={() => setProfile({ ...profile, policy: p.id })}
                className={`p-3 rounded-lg text-sm text-left transition-colors ${
                  profile.policy === p.id
                    ? "border-2 border-blue-600 bg-blue-50 text-slate-800"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q4: Use cases */}
        <div className="mb-10">
          <label className="text-sm font-semibold text-slate-700 block mb-3">
            Q4. AIの具体的な使い方
          </label>
          <textarea
            value={profile.useCases}
            onChange={(e) =>
              setProfile({ ...profile, useCases: e.target.value })
            }
            placeholder="例：買収候補の探索、ノンネームシートの初期評価、議事録作成など"
            className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-lg text-base font-semibold transition-colors ${
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-slate-300 text-white cursor-not-allowed"
          }`}
        >
          診断を始める →
        </button>
      </div>
    </div>
  );
}
