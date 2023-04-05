import { env } from "../env.mjs";

const baseUrl = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "";

export default baseUrl;
