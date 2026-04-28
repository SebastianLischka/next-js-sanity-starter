import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getDrFlexScriptUrl, isDrFlexEnabled } from "@/lib/dr-flex";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
function getMetadataBase(): URL | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;
  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
}

const metadataBase = getMetadataBase();
const openGraphImages = metadataBase
  ? [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ]
  : undefined;

export const metadata: Metadata = {
  metadataBase,
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    template: "%s | Schema UI",
    default: "Sanity Next.js Website | Schema UI",
  },
  openGraph: {
    images: openGraphImages,
    locale: "en_US",
    type: "website",
  },
  robots: !isProduction ? "noindex, nofollow" : "index, follow",
};

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const drFlexScriptUrl =
  isDrFlexEnabled() && getDrFlexScriptUrl() ? getDrFlexScriptUrl() : null;
const isVercelSpeedInsightsEnabled =
  process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ENABLED === "true";

async function VercelSpeedInsights() {
  if (!isVercelSpeedInsightsEnabled) {
    return null;
  }

  const { SpeedInsights } = await import("@vercel/speed-insights/next");
  return <SpeedInsights />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {drFlexScriptUrl && <script src={drFlexScriptUrl} />}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overscroll-none",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="top-center" richColors />
        <VercelSpeedInsights />
      </body>
    </html>
  );
}
