import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/context/AppStateContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT Learning Navigator",
  description: "AIへの質問でわからない単語をハイライトして、あなたの学習すべき内容を分析するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
