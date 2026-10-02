import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://tributetomessi.online"),
  alternates: {
    canonical: "/",
  },
  title: "Tribute to Messi — One World. One Legend. One Message.",
  description:
    "A global fan tribute to Lionel Messi — celebrating his greatest moments, magical memories, career, and the fans who witnessed them.",
  keywords: [
    "Messi",
    "Lionel Messi",
    "Messi tribute",
    "Messi fans",
    "Messi moments",
    "Messi career",
    "Tribute to Messi",
    ],
 openGraph: {
  title: "Tribute to Messi — One World. One Legend. One Message.",
  description:
    "A global fan tribute to Lionel Messi — celebrating his greatest moments, magical memories, career, and the fans who witnessed them.",
  url: "https://tributetomessi.online",
  siteName: "Tribute to Messi",
  type: "website",
  images: ["/og-image.png"],
},
twitter: {
  card: "summary_large_image",
  title: "Tribute to Messi — One World. One Legend. One Message.",
  description:
    "A global fan tribute to Lionel Messi — celebrating his greatest moments, magical memories, career, and the fans who witnessed them.",
  images: ["/og-image.png"],
},
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body className="min-h-full flex flex-col">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Tribute to Messi",
        url: "https://tributetomessi.online",
        description:
          "A global fan tribute to Lionel Messi — celebrating his greatest moments, magical memories, career, and the fans who witnessed them.",
        about: {
          "@type": "Person",
          name: "Lionel Messi",
        },
      }),
    }}
  />
  {children}
</body>
    </html>
  );
}
