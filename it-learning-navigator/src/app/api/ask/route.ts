import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";
import { buildAskPrompt } from "@/lib/prompts";
import type { AskRequest, AskResponse, ApiErrorResponse } from "@/types";

const MAX_QUESTION_LENGTH = 500;

export async function POST(req: NextRequest) {
  let body: AskRequest;
  try {
    body = await req.json();
  } catch {
    return errorResponse("VALIDATION_ERROR", "リクエストの形式が不正です", 400);
  }

  const { question } = body;

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return errorResponse("VALIDATION_ERROR", "質問を入力してください", 400);
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return errorResponse(
      "VALIDATION_ERROR",
      `質問は${MAX_QUESTION_LENGTH}文字以内で入力してください`,
      400
    );
  }

  try {
    const prompt = buildAskPrompt(question.trim());
    const answer = await askClaude(prompt);
    const res: AskResponse = { answer };
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.error("[/api/ask] Claude API error:", err);
    return errorResponse(
      "AI_ERROR",
      "回答の取得に失敗しました。もう一度お試しください",
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
