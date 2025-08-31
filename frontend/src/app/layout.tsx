import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: "페르소나 기반 일정 관리",
  description: "김윤옥을 위한 페르소나 기반 일정 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
