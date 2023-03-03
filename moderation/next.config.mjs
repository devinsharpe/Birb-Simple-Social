!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
}

export default config;
