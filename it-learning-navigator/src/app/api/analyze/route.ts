import { NextRequest, NextResponse } from "next/server";
import { askClaude, extractJson } from "@/lib/claude";
import { buildAnalyzePrompt } from "@/lib/prompts";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ApiErrorResponse,
  AnalysisResult,
} from "@/types";

const MAX_ANSWER_LENGTH = 2000;

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return errorResponse("VALIDATION_ERROR", "リクエストの形式が不正です", 400);
  }

  const { question, answer, highlighted_words } = body;

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return errorResponse("VALIDATION_ERROR", "質問が不正です", 400);
  }
  if (!answer || typeof answer !== "string" || answer.trim().length === 0) {
    return errorResponse("VALIDATION_ERROR", "回答が不正です", 400);
  }
  if (answer.length > MAX_ANSWER_LENGTH) {
    return errorResponse(
      "VALIDATION_ERROR",
      `回答は${MAX_ANSWER_LENGTH}文字以内で送信してください`,
      400
    );
  }
  if (!Array.isArray(highlighted_words)) {
    return errorResponse("VALIDATION_ERROR", "ハイライト単語リストが不正です", 400);
  }

  const wordStrings = highlighted_words
    .filter((w) => w && typeof w.word === "string")
    .map((w) => w.word.trim())
    .filter((w) => w.length > 0);

  try {
    const prompt = buildAnalyzePrompt(question.trim(), answer.trim(), wordStrings);
    const rawText = await askClaude(prompt);
    const parsed = extractJson(rawText) as AnalyzeResponse;

    // Claude のレスポンスを AnalysisResult 型（camelCase）に変換
    const result: AnalysisResult = {
      levelLabel: parsed.level_label,
      domainScores: (parsed.domain_scores ?? []).map((d) => ({
        domain: d.domain,
        score: d.score,
        maxScore: d.max_score,
        label: d.label,
      })),
      highlightedWords: wordStrings,
      adviceItems: (parsed.advice_items ?? []).map((a) => ({
        priority: a.priority,
        topic: a.topic,
        comment: a.comment,
      })),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[/api/analyze] Error:", err);
    return errorResponse(
      "AI_ERROR",
      "分析の生成に失敗しました。もう一度お試しください",
      502
    );
  }
}

function errorResponse(
  code: ApiErrorResponse["error"]["code"],
  message: string,
  status: number
) {
  const body: ApiErrorResponse = { error: { code, message } };
  return NextResponse.json(body, { status });
}
