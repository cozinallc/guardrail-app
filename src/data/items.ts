import { AssessmentItem, IndustryOption, VendorOption, PolicyOption } from "@/types";

export const INDUSTRIES: IndustryOption[] = [
  { id: "ma", label: "M&A / 金融アドバイザリー" },
  { id: "finance", label: "金融（銀行・証券・保険）" },
  { id: "it", label: "IT / SI" },
  { id: "manufacturing", label: "製造" },
  { id: "healthcare", label: "医療" },
  { id: "other", label: "その他" },
];

export const VENDORS: VendorOption[] = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "copilot", label: "Microsoft Copilot" },
  { id: "gemini", label: "Gemini" },
  { id: "other", label: "その他" },
];

export const POLICIES: PolicyOption[] = [
  { id: "yes", label: "ある" },
  { id: "wip", label: "作成中" },
  { id: "no", label: "ない" },
  { id: "unknown", label: "わからない" },
];

export const UC_BOOST: Record<string, string[]> = {
  "候補": ["B1", "B2"],
  "探索": ["B1", "B2"],
  "ノンネーム": ["A1", "A2", "B2", "B4", "C2"],
  "DD": ["A1", "A2", "A3", "A4", "B1", "B2", "B4", "C2"],
  "バリュエーション": ["A2", "B1"],
  "契約書": ["A2", "A4", "B1", "B5"],
  "戦略": ["A2", "A4", "B2"],
  "リサーチ": ["A8", "B1", "B5"],
  "分析": ["A2", "B1"],
  "評価": ["A2", "B1"],
  "レポート": ["B1", "B5", "B6"],
  "社内チャット": ["A1", "A4", "C3"],
  "顧客対応": ["B1", "B3", "B6"],
  "議事録": ["A1", "A4"],
  "翻訳": ["A8", "B5"],
};

export const AREA_LABELS: Record<string, string> = {
  input: "入力側",
  output: "出力側",
  ops: "運用・管理",
};

export const AREA_COLORS: Record<string, string> = {
  input: "#2563eb",
  output: "#059669",
  ops: "#7c3aed",
};

export const AREA_BG: Record<string, string> = {
  input: "#eff6ff",
  output: "#ecfdf5",
  ops: "#f5f3ff",
};

export const AREAS = ["input", "output", "ops"] as const;

export const ITEMS: AssessmentItem[] = [
  // === 入力側（8項目） ===
  {
    id: "A1", area: "input", title: "個人情報の入力制限",
    scenario: "ノンネームシートや資料に含まれる人名・連絡先を、そのままAIに入れてしまうリスクへの対策は？",
    options: [
      { oid: "A1a", label: "技術的にブロックされる", score: 100 },
      { oid: "A1b", label: "警告が出るが入力はできる", score: 75 },
      { oid: "A1c", label: "ルールがあり周知している", score: 50 },
      { oid: "A1d", label: "ルールはあるが周知できていない", score: 25 },
      { oid: "A1e", label: "何もしていない", score: 0 },
    ],
    legal: "個情法27条・28条・23条",
    industries: ["all"],
    insight: {
      risk: "個人情報がAIベンダーに渡ると個情法上の第三者提供に該当し得ます。海外ベンダーの場合は越境移転規制も適用されます。",
      action: "AI利用ガイドラインに個人情報の入力禁止を明記し、全員に周知してください。",
      agent: "エージェントの入力フローにPII自動検知を組み込み、個人情報を含む入力をブロックできます。",
    },
  },
  {
    id: "A2", area: "input", title: "未公開情報の入力制限",
    scenario: "まだ公表されていない買収計画や対象企業の情報をAIに入れることへの対策は？",
    options: [
      { oid: "A2a", label: "技術的にブロックされる", score: 100 },
      { oid: "A2b", label: "警告が出るが入力はできる", score: 75 },
      { oid: "A2c", label: "ルールがあり周知している", score: 50 },
      { oid: "A2d", label: "ルールはあるが周知できていない", score: 25 },
      { oid: "A2e", label: "何もしていない", score: 0 },
    ],
    legal: "金商法166条・167条の2",
    industries: ["ma", "finance"],
    insight: {
      risk: "未公開の買収計画や業績予想をAIに入力すると、ベンダー側にデータが渡ります。金商法のインサイダー取引規制に抵触するリスクがあります。",
      action: "未公開情報のAI入力リスクを社内研修で周知し、Businessプランでトレーニング利用をOFFにしてください。",
      agent: "案件別エージェントを構築し、データソースを案件ごとに分離することで情報混在を構造的に防げます。",
    },
  },
  {
    id: "A3", area: "input", title: "案件間の情報分離",
    scenario: "A案件で入れた情報がB案件の回答に混ざるリスクへの対策は？",
    options: [
      { oid: "A3a", label: "案件ごとに完全に分離した環境", score: 100 },
      { oid: "A3b", label: "案件ごとに別アカウント", score: 75 },
      { oid: "A3c", label: "案件ごとに別スレッド（同じアカウント）", score: 50 },
      { oid: "A3d", label: "特に分けていない", score: 0 },
    ],
    legal: "金商法166条",
    industries: ["ma", "finance"],
    insight: {
      risk: "同じアカウントで複数案件を扱うと、メモリ機能やコンテキスト保持で情報が混在します。金商法のチャイニーズウォールがAI上で崩壊することを意味します。",
      action: "最低限メモリ機能をOFFにし案件ごとに別スレッドを使ってください。理想は案件ごとに別環境を用意することです。",
      agent: "エージェント化の最大のメリットです。案件別エージェントを構築すれば情報混在は構造的に起き得なくなります。",
    },
  },
  {
    id: "A4", area: "input", title: "営業秘密の入力制限",
    scenario: "自社やクライアントの秘密情報をAIに入れることへの対策は？",
    options: [
      { oid: "A4a", label: "技術的にブロックされる", score: 100 },
      { oid: "A4b", label: "ルールがあり周知している", score: 50 },
      { oid: "A4c", label: "何もしていない", score: 0 },
    ],
    legal: "不正競争防止法",
    industries: ["all"],
    insight: {
      risk: "営業秘密をAIに入力すると秘密管理性が失われ、不正競争防止法上の保護を主張できなくなる可能性があります。",
      action: "入力禁止リストに「営業秘密」を明示的に追加してください。戦略・ノウハウ・未公開財務情報が該当します。",
      agent: "エージェントの入力フィルタリングで機密情報のパターンを検知・ブロックできます。",
    },
  },
  {
    id: "A5", area: "input", title: "トレーニングデータ利用の確認",
    scenario: "AIに入れたデータが、AIの学習に使われない設定になっていますか？",
    options: [
      { oid: "A5a", label: "Business/Enterpriseプランで学習利用OFF", score: 100 },
      { oid: "A5b", label: "設定でオプトアウト済み", score: 75 },
      { oid: "A5c", label: "確認していない", score: 0 },
    ],
    legal: "各ベンダーAUP",
    industries: ["all"],
    insight: {
      risk: "ChatGPTの無料・Plusプランでは入力データがモデルのトレーニングに使われます。業務データが学習に使われると他ユーザーへの回答に影響する可能性があります。",
      action: "ChatGPT Businessプランに切り替えてトレーニングデータ利用をOFFに設定してください。",
      agent: null,
    },
  },
  {
    id: "A6", area: "input", title: "プロンプトインジェクション対策",
    scenario: "外部資料にAIを騙す指示が埋め込まれている攻撃への対策は？",
    options: [
      { oid: "A6a", label: "技術的に検知・ブロックしている", score: 100 },
      { oid: "A6b", label: "ルールがあり周知している", score: 50 },
      { oid: "A6c", label: "何もしていない", score: 5 },
      { oid: "A6d", label: "この攻撃を知らない", score: 0 },
    ],
    legal: "各ベンダーAUP",
    industries: ["all"],
    insight: {
      risk: "外部からもらった資料にAIを騙す指示が埋め込まれていると、AIの安全機能が無効化され本来出力すべきでない情報を出力してしまう可能性があります。",
      action: "まず「プロンプトインジェクション」というリスクの存在をチームに共有してください。外部資料をAIに読ませる前に目視確認する運用が最初のステップです。",
      agent: "エージェントの入力フローにプロンプトインジェクション検知を組み込むことで技術的に防御できます。",
    },
  },
  {
    id: "A7", area: "input", title: "データ保管先の把握",
    scenario: "AIに入れたデータがどの国のサーバーに保管されているか把握していますか？",
    options: [
      { oid: "A7a", label: "保管先の国・地域を把握している", score: 100 },
      { oid: "A7b", label: "ベンダー名は知っているが保管先は未確認", score: 50 },
      { oid: "A7c", label: "考えたことがない", score: 0 },
    ],
    legal: "個情法28条",
    industries: ["all"],
    insight: {
      risk: "ChatGPTやCopilotのデータは海外サーバーに保管されています。個情法では外国への第三者提供に本人同意または適切な体制確認が必要です。",
      action: "利用しているAIベンダーのデータ保管先を確認し記録に残してください。個情法の「外的環境の把握」義務への対応です。",
      agent: null,
    },
  },
  {
    id: "A8", area: "input", title: "著作権コンテンツの入力制限",
    scenario: "他社のレポートや記事をAIに入れて分析させることへの対策は？",
    options: [
      { oid: "A8a", label: "入れないルールがある", score: 100 },
      { oid: "A8b", label: "特に意識していない", score: 0 },
    ],
    legal: "著作権法30条の4",
    industries: ["all"],
    insight: {
      risk: "他社のレポートや記事をAIに入力して要約・分析させる場合、著作権法上の「享受目的」との併存が問題になる可能性があります。",
      action: "著作権のある資料のAI入力に関するルールを利用ガイドラインに追加してください。",
      agent: null,
    },
  },

  // === 出力側（6項目） ===
  {
    id: "B1", area: "output", title: "AI出力の事実確認",
    scenario: "AIの出力に実在しないデータや間違った数字が含まれるリスクへの対策は？",
    options: [
      { oid: "B1a", label: "必ず人間が全件確認してから使う", score: 100 },
      { oid: "B1b", label: "重要なものだけ確認", score: 50 },
      { oid: "B1c", label: "そのまま使うことが多い", score: 0 },
    ],
    legal: "AI事業者GL・会社法",
    industries: ["all"],
    insight: {
      risk: "AIは事実と異なる情報をもっともらしく生成します。買収候補リストに実在しない企業が含まれたり、財務データに誤りがあると判断を誤るリスクがあります。",
      action: "AIの出力は必ず人間が確認してから使用するルールを徹底してください。特に数値データは元ソースとの照合が必要です。",
      agent: "エージェント化だけではハルシネーションは防げません。Lv.4の専用製品か人間レビューとの併用が必要です。",
    },
  },
  {
    id: "B2", area: "output", title: "社外提出前の機密情報チェック",
    scenario: "AIの出力をクライアントに見せるとき、別案件の情報が混ざっていないか確認していますか？",
    options: [
      { oid: "B2a", label: "社外に出す前に必ずチェック", score: 100 },
      { oid: "B2b", label: "人によってはそのまま出す", score: 25 },
      { oid: "B2c", label: "AIの出力を社外に出すことはない", score: 75 },
      { oid: "B2d", label: "考えたことがない", score: 0 },
    ],
    legal: "金商法167条の2",
    industries: ["ma", "finance"],
    insight: {
      risk: "AIが作った資料にA案件の未公開情報が混入しそれをB案件のクライアントに見せると、金商法の情報伝達規制に抵触するリスクがあります。",
      action: "AIの出力を社外に出す前に「別案件の情報が混ざっていないか」を確認するチェックリストを作成してください。",
      agent: "エージェントの出力フローに機密情報チェックを組み込むことで自動検知が可能です。",
    },
  },
  {
    id: "B3", area: "output", title: "最終判断は人間が行うルール",
    scenario: "AIが「見送り」と判断したとき、人間が改めて判断していますか？",
    options: [
      { oid: "B3a", label: "必ず人間が最終判断するルールがある", score: 100 },
      { oid: "B3b", label: "暗黙の了解だが明文化されていない", score: 50 },
      { oid: "B3c", label: "AIの判断をそのまま使うこともある", score: 0 },
    ],
    legal: "AI事業者GL・会社法",
    industries: ["all"],
    insight: {
      risk: "AIの判断をそのまま採用して有望な案件を逃すリスクがあります。取締役の善管注意義務の観点からAI判断への過度な依存は問題になり得ます。",
      action: "AIの出力はあくまで参考情報であり最終判断は必ず人間が行うルールを明文化してください。",
      agent: null,
    },
  },
  {
    id: "B4", area: "output", title: "AI出力の個人情報除去",
    scenario: "AIの出力に個人名や連絡先がそのまま含まれるリスクへの対策は？",
    options: [
      { oid: "B4a", label: "出力時に自動除去される", score: 100 },
      { oid: "B4b", label: "目視で確認して除去", score: 50 },
      { oid: "B4c", label: "確認していない", score: 5 },
      { oid: "B4d", label: "考えたことがない", score: 0 },
    ],
    legal: "個情法",
    industries: ["all"],
    insight: {
      risk: "AIが作った資料に入力時の個人名や連絡先がそのまま出力されるリスクがあります。これを社外に出すと個人情報の漏洩になります。",
      action: "AI出力に個人情報が含まれていないか確認するステップを業務フローに組み込んでください。",
      agent: "エージェントの出力フローにPII自動マスキング機能を組み込むことで個人情報を自動除去できます。",
    },
  },
  {
    id: "B5", area: "output", title: "AI出力の著作権チェック",
    scenario: "AIの出力に他社レポートの文章がそのまま含まれるリスクへの対策は？",
    options: [
      { oid: "B5a", label: "著作権チェックをしている", score: 100 },
      { oid: "B5b", label: "確認していない", score: 5 },
      { oid: "B5c", label: "何が問題かわからない", score: 0 },
    ],
    legal: "著作権法",
    industries: ["all"],
    insight: {
      risk: "AIが他社のレポートや記事の文章をほぼそのまま出力する場合があり、クライアントに提出すると著作権侵害のリスクがあります。",
      action: "AI出力のリサーチ資料は元ソースとの類似性を確認するステップを入れてください。",
      agent: null,
    },
  },
  {
    id: "B6", area: "output", title: "AI利用の開示",
    scenario: "AIで作った資料をクライアントに出すとき、AIを使ったことを伝えていますか？",
    options: [
      { oid: "B6a", label: "「AI利用」と明記している", score: 100 },
      { oid: "B6b", label: "人間で最終化するので明記していない", score: 50 },
      { oid: "B6c", label: "考えたことがない", score: 0 },
    ],
    legal: "AI事業者GL",
    industries: ["all"],
    insight: {
      risk: "AI事業者ガイドラインではAI生成コンテンツの開示が推奨されています。現時点で法的義務ではありませんが今後規制強化の可能性があります。",
      action: "現在の運用が合理的であれば維持しつつ、将来的にはAI利用の開示方針を決めておくことを推奨します。",
      agent: null,
    },
  },

  // === 運用・管理（6項目） ===
  {
    id: "C1", area: "ops", title: "利用ログの記録・保管",
    scenario: "問題が起きたとき「誰がいつ何をAIに聞いたか」を確認できますか？",
    options: [
      { oid: "C1a", label: "ログ管理ツールで記録", score: 100 },
      { oid: "C1b", label: "ChatGPT/Copilotの履歴で十分", score: 50 },
      { oid: "C1c", label: "記録を残していない", score: 5 },
      { oid: "C1d", label: "考えたことがない", score: 0 },
    ],
    legal: "AI事業者GL・金商法",
    industries: ["all"],
    insight: {
      risk: "AIに関するインシデントが発生した場合「誰がいつ何を入力しAIが何を出力したか」の記録がないと原因究明も対応もできません。",
      action: "ChatGPT Businessの管理コンソールで利用状況を定期確認してください。重要案件でのAI利用は「AI利用メモ」を残す運用を追加してください。",
      agent: "エージェント経由の全入出力は自動的に記録されます。Copilot Studioなら会話ログがPower Platform上に自動保存されます。",
    },
  },
  {
    id: "C2", area: "ops", title: "案件終了後のデータ削除",
    scenario: "案件終了後、AIに入れた対象企業の情報を削除していますか？",
    options: [
      { oid: "C2a", label: "削除するルールがある", score: 100 },
      { oid: "C2b", label: "気づいたら削除", score: 25 },
      { oid: "C2c", label: "削除していない", score: 5 },
      { oid: "C2d", label: "考えたことがない", score: 0 },
    ],
    legal: "NDA・個情法",
    industries: ["ma", "finance"],
    insight: {
      risk: "案件終了後もAIにDD資料や対象企業情報が残っていると別案件への情報混入リスクがあります。NDA上の守秘義務違反にもなり得ます。",
      action: "案件クローズ時のチェックリストに「AIのチャット履歴削除」を追加してください。ChatGPT Businessの管理コンソールから削除可能です。",
      agent: "案件別エージェントを構築すれば案件終了時にエージェントごと削除することで完全なデータクリアが可能です。",
    },
  },
  {
    id: "C3", area: "ops", title: "Shadow AI対策",
    scenario: "従業員が個人のChatGPTアカウントで業務データを使うリスクへの対策は？",
    options: [
      { oid: "C3a", label: "技術的にブロック", score: 100 },
      { oid: "C3b", label: "禁止ルールがあり周知", score: 50 },
      { oid: "C3c", label: "管理していない", score: 5 },
      { oid: "C3d", label: "わからない", score: 0 },
    ],
    legal: "不競法・個情法",
    industries: ["all"],
    insight: {
      risk: "従業員が個人のChatGPTアカウントで業務データを処理するとトレーニングデータに使われるリスクがあり会社の管理が及びません。",
      action: "会社が認めたAI以外の利用を禁止するルールを周知してください。",
      agent: "エージェント経由でのみAIを利用可能にしChatGPTへの直接アクセスをブロックすることで技術的に防止できます。",
    },
  },
  {
    id: "C4", area: "ops", title: "インシデント対応フロー",
    scenario: "AIが機密情報を含む回答をしたら、誰に報告してどう対応しますか？",
    options: [
      { oid: "C4a", label: "対応手順が整備されている", score: 100 },
      { oid: "C4b", label: "都度対応する", score: 25 },
      { oid: "C4c", label: "考えたことがない", score: 0 },
    ],
    legal: "AI事業者GL",
    industries: ["all"],
    insight: {
      risk: "AIが機密情報を含む回答をしてしまった場合、対応手順がないと初動が遅れ被害が拡大します。",
      action: "「1.該当チャットを保存 2.上長に報告 3.必要に応じてクライアントに通知」の3ステップを文書化してください。",
      agent: null,
    },
  },
  {
    id: "C5", area: "ops", title: "AIガバナンス体制",
    scenario: "経営層が関与してAI利用方針やリスク管理を統括する体制はありますか？",
    options: [
      { oid: "C5a", label: "経営層が関与した体制がある", score: 100 },
      { oid: "C5b", label: "担当者はいるが経営層は未関与", score: 50 },
      { oid: "C5c", label: "体制はない", score: 5 },
      { oid: "C5d", label: "わからない", score: 0 },
    ],
    legal: "AI事業者GL",
    industries: ["all"],
    insight: {
      risk: "経営層がAI利用のリスクを把握していないとインシデント発生時に適切な判断ができません。AI事業者ガイドラインでも経営層の関与が求められています。",
      action: "四半期に1回、経営層がAI利用状況をレビューする場を設けてください。",
      agent: null,
    },
  },
  {
    id: "C6", area: "ops", title: "利用ルールの定期見直し",
    scenario: "AIの利用ルールやベンダーポリシーは頻繁に変わります。定期的に見直していますか？",
    options: [
      { oid: "C6a", label: "定期的に見直している", score: 100 },
      { oid: "C6b", label: "作ったきり見直していない", score: 25 },
      { oid: "C6c", label: "ルール自体がない", score: 0 },
    ],
    legal: "AI事業者GL",
    industries: ["all"],
    insight: {
      risk: "AIサービスの利用規約やベンダーポリシーは頻繁に変更されます。ルールを作ったまま見直さないと気づかないうちに規約違反や法令違反になるリスクがあります。",
      action: "四半期ごとにAI利用ルールとベンダーポリシーの変更点を確認する仕組みを作ってください。",
      agent: null,
    },
  },
];
