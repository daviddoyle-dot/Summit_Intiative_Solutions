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
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "https://summitinitiativesolutions.com",
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
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
