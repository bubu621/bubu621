# 実装メモ

## 実装済みファイル一覧

```
it-learning-navigator/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # SCR-001: 質問入力画面
│   │   ├── answer/page.tsx             # SCR-002: 回答・ハイライト画面
│   │   ├── result/page.tsx             # SCR-003: 分析結果・アドバイス画面
│   │   ├── api/ask/route.ts            # POST /api/ask
│   │   ├── api/analyze/route.ts        # POST /api/analyze
│   │   └── layout.tsx                  # RootLayout（AppStateProvider 注入）
│   ├── components/features/
│   │   ├── QuestionForm.tsx            # 質問入力フォーム
│   │   ├── AnswerHighlight.tsx         # テキスト選択ハイライト
│   │   ├── DomainScoreBar.tsx          # 領域別スコアバー（アニメーション付き）
│   │   └── AdviceList.tsx             # 学習アドバイスリスト
│   ├── context/AppStateContext.tsx     # グローバル状態（Context + useReducer）
│   ├── hooks/useTextSelection.ts       # テキスト選択検出フック
│   ├── lib/
│   │   ├── claude.ts                   # Claude API クライアント
│   │   └── prompts.ts                  # プロンプトテンプレート
│   ├── services/api.ts                 # クライアント側 fetch ラッパー
│   └── types/index.ts                  # 全型定義
└── .env.example                        # 環境変数テンプレート
```

## ビルド確認

- `npx tsc --noEmit`: エラーなし
- `npm run build`: 成功（全ページ生成済み）

## 起動手順

```bash
cd it-learning-navigator
cp .env.example .env.local
# .env.local に ANTHROPIC_API_KEY を設定
npm run dev
# → http://localhost:3000
```

## 設計レビュー申し送り事項への対応

| 申し送り | 対応 |
|---------|------|
| APIキー保護 | `.gitignore` に `.env*` が含まれていることを確認済み |
| `extractJson` の堅牢化 | レイジーマッチ + JSON.parse エラーは `AI_ERROR` として返す |
| `answer` 上限チェック | `/api/analyze` で 2000 文字超を 400 エラーで弾く |
| Claude API タイムアウト | `TIMEOUT_MS = 8000` で AbortSignal 相当の timeout 設定 |
| iOS Safari テキスト選択 | `style={{ WebkitUserSelect: "text", userSelect: "text" }}` を明示 |
