import type { Metadata } from "next";
import Image from "next/image";
import { Big_Shoulders_Display, Inter } from "next/font/google";
import "./globals.css";

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Turtle Soccer Archive",
  description:
    "A record of soccer organizations, their tournaments, and every edition played.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-paper text-ink min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <header className="pt-10 pb-8 border-b border-paper-line">
            <a href="/" className="inline-flex items-end gap-3">
              <Image
                src="/logo.png"
                alt="Turtle Soccer"
                width={2000}
                height={818}
                className="w-64 h-auto"
                priority
              />
              <span className="font-display text-xl tracking-tight uppercase text-turtle-green pb-1">
                Archive
              </span>
            </a>
            <p className="text-sm text-ink/50 mt-3">
              Organizations, tournaments, and every edition on record.
            </p>
          </header>
          <main className="py-10">{children}</main>
          <footer className="border-t border-paper-line py-8 text-xs text-ink/40">
            A hobby archive. Data lives in /data as plain JSON.
          </footer>
        </div>
      </body>
    </html>
  );
}
