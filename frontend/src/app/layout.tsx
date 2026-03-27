import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MockPilotAI — AI-Powered Interview Preparation",
    template: "%s | MockPilotAI",
  },
  description:
    "Ace your next interview with MockPilotAI — the AI-powered mock interview platform with real-time feedback, personalized coaching, and industry-specific question banks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}