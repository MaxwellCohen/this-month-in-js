import "../styles.css";

import { Suspense, type ReactNode, ViewTransition } from "react";

import { Footer } from "../components/footer";
import { Header } from "../components/header";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="site-shell">
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap"
        precedence="font"
      />
      <Header />
      <main className="site-main">
        <ViewTransition name="page-fade">
          <Suspense>{children}</Suspense>
        </ViewTransition>
      </main>
      <Footer />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
