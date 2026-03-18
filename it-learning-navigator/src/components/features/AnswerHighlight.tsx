"use client";

import { useRef, useMemo } from "react";
import { useTextSelection } from "@/hooks/useTextSelection";
import { useAppState } from "@/context/AppStateContext";
import { Badge } from "@/components/ui/badge";

/**
 * AI 回答テキストを表示し、テキスト選択でハイライト単語を登録するコンポーネント
 * iOS Safari 対応のため style prop で user-select: text を明示
 */
export function AnswerHighlight() {
  const { state, addHighlight, removeHighlight } = useAppState();
  const containerRef = useRef<HTMLDivElement>(null);
  const { selection, clearSelection } = useTextSelection(containerRef);

  function handleAddHighlight() {
    if (!selection) return;
    addHighlight({ word: selection.text });
    clearSelection();
  }

  // ハイライト済み単語を回答テキスト内で着色表示する
  // Why: useMemo でメモ化して highlightedWords / answer が変化した時のみ正規表現を再構築する
  const highlightedContent = useMemo(() => {
    if (state.highlightedWords.length === 0) return state.answer;

    const words = state.highlightedWords.map((w) => w.word);
    // 単語を長さ降順でソートし、短い単語が長い単語の一部にマッチしないようにする
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const pattern = sortedWords
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(${pattern})`, "g");

    const parts = state.answer.split(regex);
    return parts.map((part, i) =>
      words.includes(part) ? (
        <mark key={i} className="bg-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, [state.highlightedWords, state.answer]);

  return (
    <div className="flex flex-col gap-4">
      {/* 回答テキストエリア */}
      <div className="relative">
        <div
          ref={containerRef}
          className="rounded-lg border border-input bg-muted/30 px-4 py-3 text-sm leading-7 select-text cursor-text"
          // iOS Safari で選択を有効化するための style prop
          style={{ WebkitUserSelect: "text", userSelect: "text" }}
          aria-label="AI回答テキスト（わからない単語を選択してハイライト）"
        >
          {highlightedContent}
        </div>

        {/* 選択ポップアップ: selection の存在だけで制御（showPopup state は不要）*/}
        {selection && (
          <div
            className="absolute z-10 flex gap-1 rounded-lg border bg-popover shadow-md px-2 py-1 -top-10 left-1/2 -translate-x-1/2"
            role="tooltip"
          >
            <button
              className="text-xs font-medium text-primary hover:underline"
              onClick={handleAddHighlight}
            >
              ハイライトする
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              className="text-xs text-muted-foreground hover:underline"
              onClick={clearSelection}
            >
              キャンセル
            </button>
          </div>
        )}
      </div>

      {/* ハイライト済み単語タグ一覧 */}
      {state.highlightedWords.length > 0 ? (
        <div>
          <p className="text-xs text-muted-foreground mb-2">わからなかった単語:</p>
          <div className="flex flex-wrap gap-2" role="list" aria-label="ハイライット済み単語">
            {state.highlightedWords.map((w) => (
              <Badge
                key={w.word}
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer"
                role="listitem"
              >
                {w.word}
                <button
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => removeHighlight(w.word)}
                  aria-label={`${w.word} を削除`}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          わからない単語をドラッグして選択すると、ハイライトできます
        </p>
      )}
    </div>
  );
}
