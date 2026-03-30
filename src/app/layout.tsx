import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIガードレール・ギャップ診断",
  description:
    "御社のAI利用状況を診断し、法令・ガイドラインに基づく対策ロードマップをレポートでお渡しします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
