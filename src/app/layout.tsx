import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LumaLoad — Recovery Load OS",
  description:
    "Evidence-grounded neurological demand cartography for concussion recovery. Plan the day. Protect the recovery.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${ibmPlexMono.variable}`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            zIndex: 9999,
          }}
          className="skip-to-content"
        >
          Skip to main content
        </a>

        <div style={{ flex: 1, paddingBottom: "50px" }}>
          {children}
        </div>

        {/* Persistent Medical Disclaimer Chrome */}
        <footer
          className="persistent-disclaimer-chrome"
          role="contentinfo"
          aria-label="Medical Disclaimer"
        >
          <p>
            <strong>Medical Notice:</strong> LumaLoad is a planning aid, not a medical device.
            It does not diagnose, treat, or provide clearance. Your healthcare
            professional&apos;s instructions always take priority.
          </p>
        </footer>
      </body>
    </html>
  );
}
