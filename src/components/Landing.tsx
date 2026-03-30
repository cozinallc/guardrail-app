"use client";

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] flex items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center">
        <p className="text-xs tracking-[4px] text-slate-500 mb-8 font-mono uppercase">
          AI Guardrail Gap Assessment
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-50 leading-tight mb-5">
          AI<span className="text-sky-400">ガードレール</span>
          <br />
          ギャップ診断
        </h1>
        <p className="text-base text-slate-400 leading-relaxed mb-10 max-w-md mx-auto">
          御社のAI利用状況を診断し、法令・ガイドラインに基づく
          対策ロードマップをレポートでお渡しします。
        </p>
        <button
          onClick={onStart}
          className="bg-sky-400 text-slate-900 font-semibold text-lg px-12 py-4 rounded-lg hover:bg-sky-300 transition-colors"
        >
          診断を始める →
        </button>
        <p className="text-xs text-slate-500 mt-5">
          所要時間：約5分 ｜ 無料
        </p>
      </div>
    </div>
  );
}
