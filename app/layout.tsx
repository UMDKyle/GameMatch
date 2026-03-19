import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GameMatch — AI Game Recommendations",
  description:
    "Describe the kind of game you want and get personalized recommendations instantly. No filters, no dropdowns — just plain English.",
  openGraph: {
    title: "GameMatch — AI Game Recommendations",
    description:
      "Describe the kind of game you want and get personalized recommendations instantly.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GameMatch — AI Game Recommendations",
    description:
      "Describe the kind of game you want and get personalized recommendations instantly.",
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
