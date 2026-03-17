# IT Learning Navigator

AIへの質問回答の中でわからない単語をハイライトすることで、ユーザーの理解レベルを分析し、学習すべき内容をアドバイスするWebアプリ。

## 機能

- AIに技術的な質問を入力 → 回答を取得
- 回答文中でわからない単語をテキスト選択してハイライト
- ハイライト単語からIT理解レベルを分析、学習アドバイスを表示

## 技術スタック

- **フロントエンド**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **AI**: Claude API (claude-haiku-4-5)
- **インフラ**: Vercel (Hobby プラン)

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開き、Anthropic API キーを設定してください:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx
```

APIキーは [Anthropic Console](https://console.anthropic.com/) から取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開きます。

## スクリプト

| コマンド | 内容 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm run test` | テスト実行 (Vitest) |
| `npm run test:coverage` | カバレッジ計測 |

## デプロイ（Vercel）

1. GitHub リポジトリと Vercel を連携
2. Vercel の **Environment Variables** に `ANTHROPIC_API_KEY` を設定
3. `main` ブランチへの push で自動デプロイ

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router（画面 + API Routes）
│   ├── page.tsx            # SCR-001: 質問入力画面
│   ├── answer/page.tsx     # SCR-002: 回答・ハイライト画面
│   ├── result/page.tsx     # SCR-003: 分析結果画面
│   └── api/                # POST /api/ask, POST /api/analyze
├── components/features/    # 機能コンポーネント
├── context/                # グローバル状態管理
├── hooks/                  # カスタムフック
├── lib/                    # Claude API クライアント + プロンプト
├── services/               # クライアント側 API 呼び出し
└── types/                  # 型定義
```
