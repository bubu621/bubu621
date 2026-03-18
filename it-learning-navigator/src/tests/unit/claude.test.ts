import { describe, it, expect, vi } from "vitest";

// Anthropic SDK はブラウザ環境（jsdom）では初期化時にエラーを投げるためモックする
vi.mock("@anthropic-ai/sdk", () => {
  function MockAnthropic() {
    return { messages: { create: vi.fn() } };
  }
  return { default: MockAnthropic };
});

import { extractJson } from "@/lib/claude";

describe("extractJson", () => {
  it("UT-008: 純粋な JSON 文字列をパースできる", () => {
    const text = '{"level_label":"入門段階","domain_scores":[]}';
    const result = extractJson(text) as Record<string, unknown>;
    expect(result.level_label).toBe("入門段階");
    expect(result.domain_scores).toEqual([]);
  });

  it("UT-009: JSON の前後に説明文が付いていても JSON 部分を抽出できる", () => {
    const text = 'はい、以下が結果です。\n{"level_label":"中級"}\nご確認ください。';
    const result = extractJson(text) as Record<string, unknown>;
    expect(result.level_label).toBe("中級");
  });

  it("UT-010: マークダウンコードブロック内の JSON を抽出できる", () => {
    const text = "```json\n{\"level_label\":\"上級\"}\n```";
    const result = extractJson(text) as Record<string, unknown>;
    expect(result.level_label).toBe("上級");
  });

  it("UT-011: JSON が存在しない場合はエラーをスローする", () => {
    expect(() => extractJson("JSONがありません")).toThrow(
      "JSON not found in Claude response"
    );
  });

  it("UT-012: 不正な JSON の場合は SyntaxError をスローする", () => {
    expect(() => extractJson("{invalid: json}")).toThrow(SyntaxError);
  });
});
