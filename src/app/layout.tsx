import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";
import "./styles/base.scss";
import "../components/layout/styles/app-shell.scss";
import "../features/auth/styles/auth.scss";
import "../features/landing/styles/landing.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MediFlow AI — Health information, made clearer",
    template: "%s | MediFlow AI",
  },
  description:
    "A thoughtful AI-powered health information assistant for clearer questions and more informed conversations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${manrope.variable}`}
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
