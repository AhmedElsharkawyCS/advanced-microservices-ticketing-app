import createCache from "@emotion/cache"

export default function emotionCache() {
  return createCache({ key: "css" })
}
