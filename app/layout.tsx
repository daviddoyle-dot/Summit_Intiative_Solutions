import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const SITE_NAME = "Summit Initiative Solutions";
const SITE_DESCRIPTION =
  "Summit Initiative Solutions helps leaders optimize their people, processes, and systems to increase returns on investment.";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Organizational Optimization Consulting`,
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://summitinitiativesolutions.com"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "https://summitinitiativesolutions.com",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0e17] text-white">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
