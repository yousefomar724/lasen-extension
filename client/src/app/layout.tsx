import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

// Font files can be colocated inside of `app`
const zarid = localFont({
  src: "../../public/fonts/zarid.woff",
  display: "swap",
  variable: "--font-zarid",
})

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "لسان - أداة تحسين الكتابة باللغة العربية",
  description:
    "أداة ذكية تساعدك على تحسين كتابتك باللغة العربية الفصحى، مع تصحيح القواعد وتحويل العامية إلى الفصحى",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} ${zarid.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
