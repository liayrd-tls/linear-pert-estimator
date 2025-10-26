import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linear PERT Estimator",
  description: "PERT estimation and visualization for Linear tasks and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
