"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { AppState, HighlightedWord, AnalysisResult } from "@/types";

type Action =
  | { type: "SET_QUESTION"; question: string }
  | { type: "SET_ANSWER"; answer: string }
  | { type: "ADD_HIGHLIGHT"; word: HighlightedWord }
  | { type: "REMOVE_HIGHLIGHT"; word: string }
  | { type: "SET_ANALYSIS_RESULT"; result: AnalysisResult }
  | { type: "RESET" };

const initialState: AppState = {
  question: "",
  answer: "",
  highlightedWords: [],
  analysisResult: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_QUESTION":
      return { ...state, question: action.question };
    case "SET_ANSWER":
      return { ...state, answer: action.answer, highlightedWords: [], analysisResult: null };
    case "ADD_HIGHLIGHT": {
      // 同一単語の重複追加を防ぐ
      const exists = state.highlightedWords.some(
        (w) => w.word === action.word.word
      );
      if (exists) return state;
      return { ...state, highlightedWords: [...state.highlightedWords, action.word] };
    }
    case "REMOVE_HIGHLIGHT":
      return {
        ...state,
        highlightedWords: state.highlightedWords.filter(
          (w) => w.word !== action.word
        ),
      };
    case "SET_ANALYSIS_RESULT":
      return { ...state, analysisResult: action.result };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type AppStateContextValue = {
  state: AppState;
  setQuestion: (question: string) => void;
  setAnswer: (answer: string) => void;
  addHighlight: (word: HighlightedWord) => void;
  removeHighlight: (word: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  reset: () => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setQuestion = useCallback(
    (question: string) => dispatch({ type: "SET_QUESTION", question }),
    []
  );
  const setAnswer = useCallback(
    (answer: string) => dispatch({ type: "SET_ANSWER", answer }),
    []
  );
  const addHighlight = useCallback(
    (word: HighlightedWord) => dispatch({ type: "ADD_HIGHLIGHT", word }),
    []
  );
  const removeHighlight = useCallback(
    (word: string) => dispatch({ type: "REMOVE_HIGHLIGHT", word }),
    []
  );
  const setAnalysisResult = useCallback(
    (result: AnalysisResult) => dispatch({ type: "SET_ANALYSIS_RESULT", result }),
    []
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return (
    <AppStateContext.Provider
      value={{ state, setQuestion, setAnswer, addHighlight, removeHighlight, setAnalysisResult, reset }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
