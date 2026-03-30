"use client";

export default function CTASection() {
  return (
    <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] rounded-xl p-8 text-center mb-5">
      <h3 className="text-lg font-bold text-slate-50 mb-2">
        ルールだけでは防げない項目があります
      </h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        エージェント化で技術的にリスクを防ぐ仕組みを構築できます。
        <br />
        案件分離・入出力フィルタリング・ログ自動取得を実現します。
      </p>
      <a
        href="mailto:contact@example.com?subject=AIガードレール診断について"
        className="inline-block bg-sky-400 text-slate-900 font-semibold px-8 py-3 rounded-lg hover:bg-sky-300 transition-colors"
      >
        エージェント設計のご相談 →
      </a>
    </div>
  );
}
