import type { Metadata } from "next";

// Pages personnelles : jamais indexées.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CompteLayout({ children }: LayoutProps<"/compte">) {
  return children;
}
