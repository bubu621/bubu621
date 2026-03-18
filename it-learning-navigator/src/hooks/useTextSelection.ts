"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";

export type SelectionInfo = {
  text: string;
  rect: DOMRect;
};

/**
 * 指定したコンテナ内でのテキスト選択を検出するフック
 * Why: SCR-002 のハイライト機能のコアロジックをコンポーネントから分離する
 */
export function useTextSelection(containerRef: RefObject<HTMLElement | null>) {
  const [selection, setSelection] = useState<SelectionInfo | null>(null);

  const clearSelection = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleSelectionChange() {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        setSelection(null);
        return;
      }

      const text = sel.toString().trim();
      if (!text) {
        setSelection(null);
        return;
      }

      // 選択範囲がコンテナ内に含まれているか確認
      const range = sel.getRangeAt(0);
      const currentContainer = containerRef.current;
      if (!currentContainer || !currentContainer.contains(range.commonAncestorContainer)) {
        setSelection(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      setSelection({ text, rect });
    }

    // iOS Safari では user-select: text が必要なため CSS で対応済みの前提
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [containerRef]);

  return { selection, clearSelection };
}
