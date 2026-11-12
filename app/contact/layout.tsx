import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: "Pull up a chair: book a conversation with David S. Doyle.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
