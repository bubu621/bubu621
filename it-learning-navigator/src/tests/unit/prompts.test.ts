import { describe, it, expect } from "vitest";
import { buildAskPrompt, buildAnalyzePrompt } from "@/lib/prompts";

describe("buildAskPrompt", () => {
  it("UT-001: 質問文がプロンプトに埋め込まれる", () => {
    const prompt = buildAskPrompt("DNSとは何ですか？");
    expect(prompt).toContain("DNSとは何ですか？");
  });

  it("UT-002: IT初心者向けの教師ペルソナが含まれる", () => {
    const prompt = buildAskPrompt("test");
    expect(prompt).toContain("IT初心者向けの技術教師");
  });

  it("UT-003: 回答文字数の指示が含まれる", () => {
    const prompt = buildAskPrompt("test");
    expect(prompt).toContain("300〜500文字");
  });
});

describe("buildAnalyzePrompt", () => {
  it("UT-004: 質問・回答・ハイライト単語がすべてプロンプトに含まれる", () => {
    const prompt = buildAnalyzePrompt(
      "DNSとは？",
      "DNSはドメインを変換します",
      ["IPアドレス", "ネームサーバー"]
    );
    expect(prompt).toContain("DNSとは？");
    expect(prompt).toContain("DNSはドメインを変換します");
    expect(prompt).toContain("- IPアドレス");
    expect(prompt).toContain("- ネームサーバー");
  });

  it("UT-005: ハイライト単語が空のとき「なし」と表示される", () => {
    const prompt = buildAnalyzePrompt("質問", "回答", []);
    expect(prompt).toContain("（なし）");
  });

  it("UT-006: answer が 2000 文字を超える場合は切り詰められる", () => {
    const longAnswer = "a".repeat(3000);
    const prompt = buildAnalyzePrompt("質問", longAnswer, []);
    // プロンプト全体の長さが 3000 文字分の answer を含まないことを確認
    const answerOccurrences = (prompt.match(/a{2001,}/g) ?? []).length;
    expect(answerOccurrences).toBe(0);
    expect(prompt).toContain("a".repeat(2000));
  });

  it("UT-007: JSONのみ返すよう制約が含まれる", () => {
    const prompt = buildAnalyzePrompt("q", "a", []);
    expect(prompt).toContain("JSONのみ");
  });
});
