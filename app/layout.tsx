import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SEVER_URL } from "@/lib/constants";
import {ThemeProvider} from 'next-themes';
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // optional but good for performance
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | Prostone`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SEVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={true}>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
