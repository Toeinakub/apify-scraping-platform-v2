import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/ToasterProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Lead Intelligence",
  description: "AI Lead Intelligence – Lead insights and scraping platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
              <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                    AI
                  </div>
                  <span className="font-bold hidden sm:inline-block">AI Lead Intelligence</span>
                </Link>
                <div className="flex items-center gap-6 text-sm font-medium">
                  <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
                  <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
                  <Link href="/scrape" className="transition-colors hover:text-foreground/80 text-foreground/60">Scrape</Link>
                  <Link href="/sessions" className="transition-colors hover:text-foreground/80 text-foreground/60">Sessions</Link>
                  <Link href="/analytics" className="transition-colors hover:text-foreground/80 text-foreground/60">Analytics</Link>
                  <Link href="/mock/dashboards" className="transition-colors hover:text-foreground/80 text-foreground/60">Insights</Link>
                  <Link href="/mock" className="transition-colors hover:text-foreground/80 text-foreground/60">Mock</Link>
                </div>
              </div>
            </nav>
            <main>{children}</main>
          </div>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
