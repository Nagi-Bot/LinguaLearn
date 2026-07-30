import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="description" content="Master English grammar, vocabulary, and more with interactive lessons and games. Your personal AI-powered English learning platform." />
        <meta name="keywords" content="english learning, grammar, vocabulary, duolingo alternative, learn english" />
        <meta property="og:title" content="LinguaLearn - Master English" />
        <meta property="og:description" content="Interactive English learning platform with AI-powered grammar correction" />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
