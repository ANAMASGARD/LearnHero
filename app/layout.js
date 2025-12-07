import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProviderWrapper } from "@/components/theme-provider";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";

// Force dynamic rendering for all pages (Clerk requires runtime env vars)
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "learnhero",
  description: "learnhero is a platform for AI course generator for STEM and more .",
};

// Clerk publishable key - this is a PUBLIC key, safe to include in code
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_ZXF1aXBwZWQtbGVtbWluZy02My5jbGVyay5hY2NvdW50cy5kZXYk';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderWrapper>
          <Provider>{children}</Provider>
          <FloatingThemeToggle />
          <Toaster />
        </ThemeProviderWrapper>
      </body>
    </html>
    </ClerkProvider>
  );
}
