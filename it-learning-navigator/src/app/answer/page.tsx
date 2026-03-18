"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnswerHighlight } from "@/components/features/AnswerHighlight";
import { useAppState } from "@/context/AppStateContext";
import { analyzeHighlights } from "@/services/api";
import { ApiError } from "@/types";

export default function AnswerPage() {
  const router = useRouter();
  const { state, setAnalysisResult, reset } = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 質問・回答がない状態でアクセスされたらトップへ戻す
  useEffect(() => {
    if (!state.question || !state.answer) {
      router.replace("/");
    }
  }, [state.question, state.answer, router]);

  async function handleAnalyze() {
    setError(null);
    setIsLoading(true);
    try {
      const result = await analyzeHighlights(
        state.question,
        state.answer,
        state.highlightedWords
      );
      setAnalysisResult(result);
      router.push("/result");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("分析の生成に失敗しました。もう一度お試しください");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    reset();
    router.push("/");
  }

  if (!state.question || !state.answer) return null;

  return (
    <main className="min-h-screen flex flex-col p-4">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        {/* ヘッダー */}
        <button
          onClick={handleBack}
          className="text-sm text-muted-foreground hover:text-foreground self-start"
          aria-label="質問し直す"
        >
          ← 質問し直す
        </button>

        {/* 質問テキスト */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">あなたの質問:</p>
          <p className="text-sm font-medium">「{state.question}」</p>
        </div>

        <hr className="border-border" />

        {/* AI回答 + ハイライト */}
        <div>
          <p className="text-sm font-semibold mb-3">AIの回答</p>
          <AnswerHighlight />
        </div>

        <hr className="border-border" />

        {/* エラー */}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {/* アクションボタン */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full"
            aria-label="分析する"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                分析中...
              </span>
            ) : (
              "OK → 分析する"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={isLoading || state.highlightedWords.length > 0}
            className="w-full"
            aria-label="ハイライトなしでスキップ"
          >
            ハイライトなし → スキップ
          </Button>
        </div>
      </div>
    </main>
  );
}
