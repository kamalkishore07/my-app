import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kamal's Diary - Personal Calendar & Finance Tracker",
  description: "A beautiful, personal space to capture your thoughts, track your expenses, manage todos, and organize your daily life. Built with Next.js and MongoDB.",
  keywords: ["diary", "calendar", "finance tracker", "todo list", "expense tracker", "personal journal", "daily planner"],
  authors: [{ name: "Kamal Kishore" }],
  creator: "Kamal Kishore",
  publisher: "Kamal Kishore",

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: "Kamal's Diary - Personal Calendar & Finance Tracker",
    description: "A beautiful, personal space to capture your thoughts, track your expenses, and organize your daily life.",
    siteName: "Kamal's Diary",
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: "Kamal's Diary - Personal Calendar & Finance Tracker",
    description: "A beautiful, personal space to capture your thoughts, track your expenses, and organize your daily life.",
  },

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Viewport and theme
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
  },
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
        {children}
      </body>
    </html>
  );
}
