import * as React from "react"
import Head from "next/head"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Layout from "@components/Layout"
import { CacheProvider } from "@emotion/react"
import { createEmotionCache, theme } from "@theme"
import axiosBuilder from "@api/axiosBuilder"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()
export default function AppComponent(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, currentUser } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>ticketing</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout user={currentUser}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  )
}

AppComponent.getInitialProps = async ({ ctx, Component }) => {
  try {
    const { data } = await axiosBuilder(ctx).get("/api/users/me")
    const pageProps = await Component.getInitialProps?.(ctx)
    return { pageProps, ...data }
  } catch (error) {
    return {}
  }
}
