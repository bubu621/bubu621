// プロンプトテンプレート
// Why: プロンプトをコードから分離することで、AIの挙動調整時にコアロジックを触らずに済む

const MAX_ANSWER_CHARS = 2000;

export function buildAskPrompt(question: string): string {
  return `あなたはIT初心者向けの技術教師です。
以下の質問に対して、IT業界に入ったばかりの方にもわかりやすく、
しかし技術的に正確な回答を日本語で返してください。
回答は300〜500文字程度にまとめてください。
専門用語を使う場合は、その単語が独立して選択しやすいよう、
自然な形で文章に配置してください。

質問: ${question}`;
}

export function buildAnalyzePrompt(
  question: string,
  answer: string,
  highlightedWords: string[]
): string {
  // クライアントから送られてくる answer を上限でトリムする
  // Why: 悪意ある入力による過大なトークン消費を防ぐ
  const safeAnswer = answer.slice(0, MAX_ANSWER_CHARS);

  const wordsList =
    highlightedWords.length > 0
      ? highlightedWords.map((w) => `- ${w}`).join("\n")
      : "（なし）";

  return `あなたはIT学習アドバイザーです。
以下の情報から、ユーザーのIT理解レベルを分析し、学習アドバイスを生成してください。

# 質問
${question}

# AIの回答
${safeAnswer}

# ユーザーがわからなかった単語
${wordsList}
（※「なし」の場合は「全て理解できていた」と判断してください）

# 出力形式（JSONのみ返してください。説明文は不要です）
{
  "level_label": "全体的な習熟度を一言で（例: ITインフラ 入門段階）",
  "domain_scores": [
    {
      "domain": "領域名（ネットワーク/セキュリティ/開発・プログラミング/クラウド/データベース から該当するもの）",
      "score": 0,
      "max_score": 5,
      "label": "未入門/初級/中級/上級/熟練 のいずれか"
    }
  ],
  "highlighted_words": ["単語1", "単語2"],
  "advice_items": [
    {
      "priority": "high/medium/low",
      "topic": "学習トピック名",
      "comment": "一言アドバイス（30文字以内）"
    }
  ]
}

制約:
- domain_scores は質問内容に関係する領域のみ含める（1〜3件）
- advice_items は 2〜4件
- わからなかった単語が「なし」の場合は advice_items の優先度を全て "low" にする
- 回答はJSONのみ。前後の説明文・マークダウンコードブロックは不要`;
}
