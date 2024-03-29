// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
await import("./src/env.mjs");
import bundleAnalyzer from "@next/bundle-analyzer"
const withBA = bundleAnalyzer({
  enabled: !!process.env.ANALYZE
})

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.S3_HOST_URL,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["jotai-devtools"],
  // experimental: {
  //   swcPlugins: [
  //     [
  //       'next-superjson-plugin',
  //       {},
  //     ],
  //   ],
  // },
};
// TODO: Fix superjson
export default withBA(config);
