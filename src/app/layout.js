import { Geist, Geist_Mono, Gowun_Batang, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun-batang",
});

const notoSansKr = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
});

export const metadata = {
  title: "안녕하세요 (Annyeonghaseyo) - 평화와 인사의 여정",
  description: "한국의 아름다운 인사말 '안녕하세요'에 담긴 문화적 깊이, 어원, 그리고 예절을 탐구하는 인터랙티브 공간입니다.",
  keywords: ["안녕하세요", "Annyeonghaseyo", "Korean Greeting", "Korean Culture", "Etymology", "Bowing Etiquette"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${gowunBatang.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-teal-500/30 selection:text-teal-200">
        {children}
      </body>
    </html>
  );
}
