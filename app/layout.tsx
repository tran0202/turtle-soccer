import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Big_Shoulders_Inline_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders_Inline_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Turtle Soccer Archive",
  description:
    "A record of soccer organizations, their competitions, and every edition played.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body text-lg bg-paper text-ink min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <header className="pt-10 pb-8 border-b border-paper-line flex items-end justify-between flex-wrap gap-4">
            <a href="/" className="inline-flex items-end gap-3">
              <Image
                src="/logo.png"
                alt="Turtle Soccer"
                width={2000}
                height={818}
                className="w-64 h-auto"
                priority
              />
              <span className="font-display text-2xl tracking-tight uppercase text-turtle-green pb-1">
                Archive
              </span>
            </a>
            <nav className="pb-1 flex items-center gap-6">
              <Link
                href="/organizations"
                className="font-display text-xl uppercase tracking-tight text-turtle-blue hover:text-turtle-green transition-colors"
              >
                Organizations
              </Link>
              <Link
                href="/competitions"
                className="font-display text-xl uppercase tracking-tight text-turtle-blue hover:text-turtle-green transition-colors"
              >
                Competitions
              </Link>
            </nav>
          </header>
          <main className="py-10">{children}</main>
          <footer className="py-8 text-sm text-ink/40">
            A hobby non-commercial archive for the love of soccer.
          </footer>
        </div>
      </body>
    </html>
  );
}
