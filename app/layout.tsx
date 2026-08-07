import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/src/components/site/Header";
import Particles from "@/src/components/site/Particles";
import { ThemeProvider } from "@/src/components/ui";
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
  title: "VideoVault | Download videos from your favorite platforms",
  description:
    "Paste a video URL, choose quality and format, and download instantly.",
};

const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('videovault-theme');
    var isDark = saved === 'dark' || ((!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-full flex flex-col relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_25%,transparent),transparent_60%)]" />
            <Particles count={32} />
          </div>
          <Navbar />
          <main className="flex-1 relative z-0">{children}</main>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
