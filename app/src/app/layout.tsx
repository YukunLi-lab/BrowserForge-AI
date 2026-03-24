import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrowserForge AI - Natural Language to Deployable Apps",
  description:
    "Transform your app ideas into production-ready code using AI-powered agents. Describe what you want, and watch BrowserForge generate, test, and deploy your application.",
  keywords: [
    "AI",
    "app generator",
    "code generation",
    "Next.js",
    "no-code",
    "low-code",
    "developer tools",
  ],
  authors: [{ name: "BrowserForge Team" }],
  openGraph: {
    title: "BrowserForge AI",
    description: "Natural Language to Deployable Apps",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
