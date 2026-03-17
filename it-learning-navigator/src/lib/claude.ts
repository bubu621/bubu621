import Anthropic from "@anthropic-ai/sdk";

// Why: モジュールレベルで1インスタンスを共有してコネクションを再利用する
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-haiku-4-5-20251001";
// 要件: AI回答は5秒以内、分析は3秒以内 → 外側でフェイルセーフとして8秒タイムアウト
const TIMEOUT_MS = 8_000;

export async function askClaude(prompt: string): Promise<string> {
  const response = await client.messages.create(
    {
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    },
    { timeout: TIMEOUT_MS }
  );

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }
  return content.text;
}

/**
 * Claude のレスポンスから JSON オブジェクトを抽出する
 * Why: Claude が稀に JSON の前後に説明文を付けることがあるため、正規表現で JSON 部分のみを抜き出す
 */
export function extractJson(text: string): unknown {
  // グリーディーマッチで外側の {} ブロック全体を取得する
  // Why: ネストした JSON オブジェクトを含む場合、レイジーマッチだと最初の } で切れてしまうため
  //      グリーディーマッチで最外の { から最後の } まで取得するのが正しい
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error(`JSON not found in Claude response: ${text.slice(0, 100)}`);
  }
  return JSON.parse(match[0]);
}
