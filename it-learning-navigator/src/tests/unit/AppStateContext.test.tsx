import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AppStateProvider, useAppState } from "@/context/AppStateContext";
import type { AnalysisResult } from "@/types";

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}

const mockResult: AnalysisResult = {
  levelLabel: "ITインフラ 入門段階",
  domainScores: [{ domain: "ネットワーク", score: 2, maxScore: 5, label: "初級" }],
  highlightedWords: ["IPアドレス"],
  adviceItems: [{ priority: "high", topic: "IPアドレス基礎", comment: "まずここから" }],
};

describe("AppStateContext", () => {
  it("UT-013: 初期状態が正しい", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    expect(result.current.state.question).toBe("");
    expect(result.current.state.answer).toBe("");
    expect(result.current.state.highlightedWords).toEqual([]);
    expect(result.current.state.analysisResult).toBeNull();
  });

  it("UT-014: setQuestion で質問が更新される", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    act(() => result.current.setQuestion("DNSとは？"));
    expect(result.current.state.question).toBe("DNSとは？");
  });

  it("UT-015: addHighlight で単語が追加され、同一単語の重複追加は無視される", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    act(() => result.current.addHighlight({ word: "IPアドレス" }));
    act(() => result.current.addHighlight({ word: "IPアドレス" })); // 重複
    expect(result.current.state.highlightedWords).toHaveLength(1);
    expect(result.current.state.highlightedWords[0].word).toBe("IPアドレス");
  });

  it("UT-016: removeHighlight で指定した単語だけが削除される", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    act(() => result.current.addHighlight({ word: "IPアドレス" }));
    act(() => result.current.addHighlight({ word: "DNS" }));
    act(() => result.current.removeHighlight("IPアドレス"));
    expect(result.current.state.highlightedWords).toHaveLength(1);
    expect(result.current.state.highlightedWords[0].word).toBe("DNS");
  });

  it("UT-017: setAnswer を呼ぶとハイライット単語と分析結果がリセットされる", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    act(() => result.current.addHighlight({ word: "DNS" }));
    act(() => result.current.setAnalysisResult(mockResult));
    act(() => result.current.setAnswer("新しい回答"));
    expect(result.current.state.highlightedWords).toEqual([]);
    expect(result.current.state.analysisResult).toBeNull();
    expect(result.current.state.answer).toBe("新しい回答");
  });

  it("UT-018: reset で全状態が初期値に戻る", () => {
    const { result } = renderHook(() => useAppState(), { wrapper });
    act(() => {
      result.current.setQuestion("Q");
      result.current.setAnswer("A");
      result.current.addHighlight({ word: "DNS" });
      result.current.setAnalysisResult(mockResult);
    });
    act(() => result.current.reset());
    expect(result.current.state.question).toBe("");
    expect(result.current.state.answer).toBe("");
    expect(result.current.state.highlightedWords).toEqual([]);
    expect(result.current.state.analysisResult).toBeNull();
  });
});
