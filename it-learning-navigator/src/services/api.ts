"use client";

import { ApiError } from "@/types";
import type {
  AskRequest,
  AskResponse,
  AnalyzeRequest,
  AnalysisResult,
  ApiErrorCode,
  HighlightedWord,
} from "@/types";

async function callApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: { code: "UNKNOWN" as ApiErrorCode, message: "エラーが発生しました" } }));
    throw new ApiError(
      err.error?.code ?? "UNKNOWN",
      err.error?.message ?? "エラーが発生しました",
      res.status
    );
  }

  return res.json() as Promise<T>;
}

export async function askQuestion(question: string): Promise<string> {
  const body: AskRequest = { question };
  const res = await callApi<AskResponse>("/api/ask", body);
  return res.answer;
}

export async function analyzeHighlights(
  question: string,
  answer: string,
  highlightedWords: HighlightedWord[]
): Promise<AnalysisResult> {
  const body: AnalyzeRequest = {
    question,
    answer,
    highlighted_words: highlightedWords.map((w) => ({
      word: w.word,
      position_start: w.positionStart,
      position_end: w.positionEnd,
    })),
  };
  return callApi<AnalysisResult>("/api/analyze", body);
}
