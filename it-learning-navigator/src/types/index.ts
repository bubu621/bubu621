// データモデル設計書の型定義をそのまま移植

export type HighlightedWord = {
  word: string;
  positionStart?: number;
  positionEnd?: number;
};

export type DomainScore = {
  domain: string;
  score: number;
  maxScore: number;
  label: string;
};

export type AdviceItem = {
  priority: "high" | "medium" | "low";
  topic: string;
  comment: string;
};

export type AnalysisResult = {
  levelLabel: string;
  domainScores: DomainScore[];
  highlightedWords: string[];
  adviceItems: AdviceItem[];
};

export type AppState = {
  // SCR-001 → SCR-002 に引き継ぐ
  question: string;
  answer: string;
  // SCR-002 で操作
  highlightedWords: HighlightedWord[];
  // SCR-003 で表示
  analysisResult: AnalysisResult | null;
};

// API リクエスト / レスポンス型

export type AskRequest = {
  question: string;
};

export type AskResponse = {
  answer: string;
};

export type AnalyzeRequest = {
  question: string;
  answer: string;
  highlighted_words: { word: string; position_start?: number; position_end?: number }[];
};

export type AnalyzeResponse = {
  level_label: string;
  domain_scores: { domain: string; score: number; max_score: number; label: string }[];
  highlighted_words: string[];
  advice_items: { priority: "high" | "medium" | "low"; topic: string; comment: string }[];
};

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AI_ERROR"
  | "INTERNAL_ERROR"
  | "UNKNOWN";

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

// クライアント側で使うカスタムエラー
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}
