declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_HOST_URL: string;
    }
  }
}

export {};
