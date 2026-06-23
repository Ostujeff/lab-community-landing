import type { Metadata } from "next";
import { Unbounded, Commissioner } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Лаборатория ИИ — сообщество резидентов",
  description:
    "Закрытое сообщество для тех, кто уже пробует делать AI-продукты и хочет довести один из них до рабочей версии.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${commissioner.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
