"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import type { DomainScore } from "@/types";

type Props = {
  scores: DomainScore[];
};

const LABEL_COLORS: Record<string, string> = {
  未入門: "text-muted-foreground",
  初級: "text-blue-500",
  中級: "text-green-500",
  上級: "text-orange-500",
  熟練: "text-purple-500",
};

export function DomainScoreBar({ scores }: Props) {
  // アニメーション: 読み込み時に 0 から実際のスコアまで伸ばす
  const [animatedScores, setAnimatedScores] = useState<number[]>(
    scores.map(() => 0)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(scores.map((s) => (s.score / s.maxScore) * 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [scores]);

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="IT領域別スコア">
      {scores.map((score, i) => (
        <div key={score.domain} role="listitem">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">{score.domain}</span>
            <span className={`text-xs font-medium ${LABEL_COLORS[score.label] ?? ""}`}>
              {score.label}
            </span>
          </div>
          <Progress
            value={animatedScores[i]}
            className="h-2 transition-all duration-700"
            aria-label={`${score.domain}: ${score.label} (${score.score}/${score.maxScore})`}
          />
        </div>
      ))}
    </div>
  );
}
