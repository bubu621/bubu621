import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Claude モジュールをモック（外部 API に依存しないように）
vi.mock("@/lib/claude", () => ({
  askClaude: vi.fn().mockResolvedValue("DNSはドメイン名をIPアドレスに変換する仕組みです。"),
  extractJson: vi.fn(),
}));

import { POST } from "@/app/api/ask/route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/ask", () => {
  beforeEach(() => vi.clearAllMocks());

  it("IT-001: 正常なリクエストで 200 と回答テキストが返る", async () => {
    const req = makeRequest({ question: "DNSとは何ですか？" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.answer).toBeTruthy();
    expect(typeof body.answer).toBe("string");
  });

  it("IT-002: question が空文字のとき 400 VALIDATION_ERROR が返る", async () => {
    const req = makeRequest({ question: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("IT-003: question が 500 文字超のとき 400 VALIDATION_ERROR が返る", async () => {
    const req = makeRequest({ question: "a".repeat(501) });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("IT-004: question フィールドが存在しないとき 400 が返る", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("IT-005: Claude API がエラーを投げたとき 502 AI_ERROR が返る", async () => {
    const { askClaude } = await import("@/lib/claude");
    vi.mocked(askClaude).mockRejectedValueOnce(new Error("API timeout"));
    const req = makeRequest({ question: "テスト" });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error.code).toBe("AI_ERROR");
  });

  it("IT-006: 不正な JSON ボディのとき 400 が返る", async () => {
    const req = new NextRequest("http://localhost/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json{{{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
