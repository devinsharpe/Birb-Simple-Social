import type { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
