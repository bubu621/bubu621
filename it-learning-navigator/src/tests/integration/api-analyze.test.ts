import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// vi.mock はホイストされるためトップレベル変数を参照できない
// vi.hoisted() を使って定数を事前に定義する
const { mockAnalyzeResponse } = vi.hoisted(() => ({
  mockAnalyzeResponse: {
    level_label: "ITインフラ 入門段階",
    domain_scores: [
      { domain: "ネットワーク", score: 2, max_score: 5, label: "初級" },
    ],
    highlighted_words: ["IPアドレス"],
    advice_items: [
      { priority: "high", topic: "IPアドレス基礎", comment: "まずここから" },
    ],
  },
}));

vi.mock("@/lib/claude", () => ({
  askClaude: vi.fn().mockResolvedValue(JSON.stringify(mockAnalyzeResponse)),
  extractJson: vi.fn().mockReturnValue(mockAnalyzeResponse),
}));

import { POST } from "@/app/api/analyze/route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  question: "DNSとは何ですか？",
  answer: "DNSはドメインを変換します",
  highlighted_words: [{ word: "IPアドレス" }],
};

describe("POST /api/analyze", () => {
  beforeEach(() => vi.clearAllMocks());

  it("IT-007: 正常リクエストで 200 と AnalysisResult が返る", async () => {
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.levelLabel).toBe("ITインフラ 入門段階");
    expect(body.domainScores).toHaveLength(1);
    expect(body.adviceItems[0].priority).toBe("high");
  });

  it("IT-008: highlighted_words が空配列でも 200 が返る（スキップケース）", async () => {
    const req = makeRequest({ ...validBody, highlighted_words: [] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("IT-009: question が空のとき 400 VALIDATION_ERROR が返る", async () => {
    const req = makeRequest({ ...validBody, question: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("IT-010: answer が 2000 文字超のとき 400 VALIDATION_ERROR が返る", async () => {
    const req = makeRequest({ ...validBody, answer: "a".repeat(2001) });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("IT-011: highlighted_words が配列でないとき 400 が返る", async () => {
    const req = makeRequest({ ...validBody, highlighted_words: "invalid" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("IT-012: Claude API がエラーを投げたとき 502 AI_ERROR が返る", async () => {
    const { askClaude } = await import("@/lib/claude");
    vi.mocked(askClaude).mockRejectedValueOnce(new Error("timeout"));
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error.code).toBe("AI_ERROR");
  });
});
