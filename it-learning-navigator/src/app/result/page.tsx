"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DomainScoreBar } from "@/components/features/DomainScoreBar";
import { AdviceList } from "@/components/features/AdviceList";
import { useAppState } from "@/context/AppStateContext";

export default function ResultPage() {
  const router = useRouter();
  const { state, reset } = useAppState();

  // 分析結果がない状態でアクセスされたらトップへ
  // Why: isLoaded を effect 内で setState すると lint エラー（cascading render）になるため
  //      state.analysisResult の存在チェックで直接条件分岐する
  useEffect(() => {
    if (!state.analysisResult) {
      router.replace("/");
    }
  }, [state.analysisResult, router]);

  function handleReset() {
    reset();
    router.push("/");
  }

  if (!state.analysisResult) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">読み込み中...</div>
      </main>
    );
  }

  const { levelLabel, domainScores, highlightedWords, adviceItems } = state.analysisResult;

  return (
    <main className="min-h-screen flex flex-col p-4 pb-12">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        {/* ヘッダー */}
        <h1 className="text-xl font-bold">あなたの理解レベル分析</h1>

        {/* 立ち位置セクション */}
        <section aria-labelledby="level-heading">
          <div className="flex items-center gap-2 mb-3">
            <span aria-hidden>📊</span>
            <h2 id="level-heading" className="font-semibold">現在の立ち位置</h2>
          </div>
          <p className="text-lg font-bold text-primary mb-4">{levelLabel}</p>
          <DomainScoreBar scores={domainScores} />
        </section>

        <hr className="border-border" />

        {/* ハイライト単語セクション */}
        <section aria-labelledby="words-heading">
          <div className="flex items-center gap-2 mb-3">
            <span aria-hidden>📝</span>
            <h2 id="words-heading" className="font-semibold">わからなかった単語</h2>
          </div>
          {highlightedWords.length > 0 ? (
            <ul className="flex flex-col gap-1" aria-label="ハイライットした単語一覧">
              {highlightedWords.map((word) => (
                <li key={word} className="text-sm flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {word}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600 font-medium">
              全ての単語が理解できていました！次のレベルへ進みましょう 🎉
            </p>
          )}
        </section>

        <hr className="border-border" />

        {/* アドバイスセクション */}
        <section aria-labelledby="advice-heading">
          <div className="flex items-center gap-2 mb-3">
            <span aria-hidden>🎯</span>
            <h2 id="advice-heading" className="font-semibold">次に学ぶべきこと</h2>
          </div>
          <AdviceList items={adviceItems} />
        </section>

        {/* アクション */}
        <Button onClick={handleReset} className="w-full mt-2" aria-label="もう一度質問する">
          🔄 もう一度質問する
        </Button>
      </div>
    </main>
  );
}
