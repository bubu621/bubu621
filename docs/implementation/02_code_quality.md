# コード品質レポート

## サマリー

| 観点 | 評価 | 指摘数（修正済含む） |
|------|------|---------------------|
| 静的解析 | ⭕ | 2件（修正済）|
| コード品質 | ⭕ | 1件（Low）|
| セキュリティ | ⭕ | 0件 |
| パフォーマンス | ⚠️ | 2件（Low）|
| 保守性 | ⭕ | 1件（Low）|

---

## 詳細

### 1. 静的解析

#### 修正前の指摘（修正済）

| # | ファイル | 行 | 指摘内容 | 重大度 | 対応 |
|---|---------|-----|---------|--------|------|
| 1 | `app/answer/page.tsx` | 5 | `Link` が import されているが未使用 | Warning | ✅ import 削除 |
| 2 | `app/result/page.tsx` | 20 | effect 内で直接 `setState` を呼び出している（cascading render） | Error | ✅ `isLoaded` state を削除し `state.analysisResult` の存在チェックで代替 |

#### 修正後の確認結果

```
$ npm run lint    → 0 errors, 0 warnings
$ npx tsc --noEmit → 0 errors
$ npm run test    → 30/30 PASS
```

#### TypeScript strict mode 確認

- `any` 型の使用: 0件（禁止規約遵守）
- `NEXT_PUBLIC_` プレフィックス付きの機密情報: 0件（APIキーはサーバーサイドのみ）

---

### 2. コード品質メトリクス

| ファイル | 行数 | 複雑度の目安 | 最大ネスト深度 | 指摘 |
|---------|------|------------|--------------|------|
| app/answer/page.tsx | 119 | 低 | 3 | なし |
| app/result/page.tsx | 96 | 低 | 3 | なし |
| components/features/AnswerHighlight.tsx | 128 | 中 | 4 | 後述 |
| context/AppStateContext.tsx | 107 | 低 | 2 | なし |
| lib/prompts.ts | 70 | 低 | 1 | なし |
| lib/claude.ts | 41 | 低 | 2 | なし |
| app/api/ask/route.ts | 51 | 低 | 2 | なし |
| app/api/analyze/route.ts | 85 | 中 | 3 | なし |
| services/api.ts | 55 | 低 | 2 | なし |
| types/index.ts | 85 | - | - | なし |

**指摘:**

| # | ファイル | 行 | 指摘内容 | 重大度 |
|---|---------|-----|---------|--------|
| 1 | `components/features/AnswerHighlight.tsx` | 30〜45 | `renderHighlightedText` 内の正規表現ビルドがレンダリングごとに実行される。`highlightedWords` の変化時のみ再計算すれば十分 | Low |

---

### 3. セキュリティ

| # | 観点 | 確認結果 |
|---|------|---------|
| 1 | APIキーのクライアント露出 | `ANTHROPIC_API_KEY` は `process.env` 経由でサーバーサイドのみ参照。`NEXT_PUBLIC_` プレフィックスなし ✅ |
| 2 | XSS | React の JSX は自動エスケープ。`dangerouslySetInnerHTML` の使用なし ✅ |
| 3 | CSRF | JSON ボディ + 認証なし（Cookie 未使用）のため CSRF 攻撃対象外 ✅ |
| 4 | SQLインジェクション | DB なし（MVPはステートレス設計）✅ |
| 5 | CORS | Next.js デフォルト（同一オリジン）✅ |
| 6 | 入力値検証 | `/api/ask`: 文字数上限 500。`/api/analyze`: 文字数上限 2000 ✅ |
| 7 | 依存パッケージの脆弱性 | `npm audit` 0 vulnerabilities ✅ |
| 8 | プロンプトインジェクション | `buildAnalyzePrompt` 内で `answer` を 2000 文字でトリム ✅ |

---

### 4. パフォーマンス

| # | ファイル | 指摘内容 | 重大度 |
|---|---------|---------|--------|
| 1 | `components/features/AnswerHighlight.tsx` | `renderHighlightedText` がレンダリングのたびに正規表現を構築する。`useMemo` でメモ化するとより効率的 | Low |
| 2 | `components/features/DomainScoreBar.tsx` | `useEffect` の初回遅延（100ms）は固定値。将来的に `CSS transition-delay` または `Framer Motion` で置き換えると柔軟 | Low |

**MVP 規模では実用上問題なし。**

---

### 5. 保守性

| # | 観点 | 確認結果 | 指摘 |
|---|------|---------|------|
| 1 | 命名の一貫性 | `snake_case`（API レスポンス）と `camelCase`（型定義）の変換が `api/analyze/route.ts` に集中していて明確 ✅ | |
| 2 | ディレクトリ構成 | 詳細設計書の構成と完全一致 ✅ | |
| 3 | エラーハンドリング | API Routes は全エラーを `AI_ERROR` / `VALIDATION_ERROR` / `INTERNAL_ERROR` に分類。クライアント側は `ApiError` クラスで統一 ✅ | |
| 4 | ログ出力 | `console.error` が `/api/ask` と `/api/analyze` の catch ブロックにあり、エラー追跡に必要最低限の情報あり ✅ | |
| 5 | コメント | Why コメントが適切に記載されている（`extractJson` のレイジーマッチ理由、iOS Safari 対応理由など）✅ | |
| 6 | `AnswerHighlight.tsx` の `showPopup` state | `selection` の存在と `showPopup` state が二重管理になっている。`showPopup && hasSelection` で制御しているが、`selection` が `null` になっても `showPopup` が `true` のままになりうる | Low |

---

## 改善提案（優先度順）

| # | 優先度 | 対象 | 提案内容 | 工数目安 |
|---|--------|------|---------|---------|
| 1 | Medium | `AnswerHighlight.tsx` | `showPopup` state を廃止して `selection` の有無だけでポップアップ表示を制御。コードが単純化され二重管理がなくなる | 30分 |
| 2 | Low | `AnswerHighlight.tsx` | `renderHighlightedText` を `useMemo` でメモ化（`[state.highlightedWords, state.answer]` 依存）して不要な正規表現再構築を防ぐ | 15分 |
| 3 | Low | `app/api/analyze/route.ts` | `domain_scores` / `advice_items` の型ガードを追加。現在 `as AnalyzeResponse` でキャストしているため、Claude が不正な shape を返した場合にランタイムエラーになる可能性がある | 1時間 |

### 提案1の修正例（`AnswerHighlight.tsx`）

```tsx
// Before: showPopup state と selection の二重管理
const [showPopup, setShowPopup] = useState(false);

// After: selection の存在だけでポップアップ制御
// showPopup state を削除し、selection !== null をそのまま使う
{selection && (
  <div className="absolute z-10 ...">
    <button onClick={handleAddHighlight}>ハイライトする</button>
    <button onClick={clearSelection}>キャンセル</button>
  </div>
)}
```

### 提案2の修正例（`AnswerHighlight.tsx`）

```tsx
// Before: レンダリングごとに正規表現を再構築
function renderHighlightedText(text: string) { ... }

// After: useMemo でメモ化
const highlightedContent = useMemo(() => {
  if (state.highlightedWords.length === 0) return state.answer;
  // ... 正規表現ロジック
}, [state.highlightedWords, state.answer]);
```

---

## 総評

コード全体のクォリティは MVP 規模として高水準。型安全性・セキュリティ・エラーハンドリングのいずれも設計通りに実装されている。
Lint エラー 2件は修正済み。残存指摘はすべて Low レベルで、現状のままコードレビューゲートに進んで問題ない。
