import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: {
    default: "PrepzyAI | Modern Interview Prep",
    template: "%s | PrepzyAI",
  },
  description: "Level the playing field with AI-driven interview preparation. Practice with realistic AI agents and get data-driven feedback.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}