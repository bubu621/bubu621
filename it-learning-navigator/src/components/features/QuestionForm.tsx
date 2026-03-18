"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/context/AppStateContext";
import { askQuestion } from "@/services/api";
import { ApiError } from "@/types";

const MAX_LENGTH = 500;

const EXAMPLES = [
  "DNSとは何ですか？",
  "HTTPSとHTTPの違いは？",
  "Gitのブランチとは何ですか？",
];

export function QuestionForm() {
  const router = useRouter();
  const { setQuestion, setAnswer } = useAppState();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!input.trim() || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const answer = await askQuestion(input.trim());
      setQuestion(input.trim());
      setAnswer(answer);
      router.push("/answer");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("回答の取得に失敗しました。もう一度お試しください");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Shift+Enter で改行、Enter のみで送信
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full min-h-32 rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
        placeholder="質問を入力してください... (Shift+Enter で改行)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={MAX_LENGTH}
        disabled={isLoading}
        aria-label="質問入力フォーム"
      />

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>例: 「{EXAMPLES[0]}」</span>
        <span className={input.length > MAX_LENGTH * 0.9 ? "text-destructive" : ""}>
          {input.length}/{MAX_LENGTH}
        </span>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
        className="w-full"
        aria-label="質問する"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            回答を取得中...
          </span>
        ) : (
          "質問する →"
        )}
      </Button>
    </div>
  );
}
