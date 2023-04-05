import * as nodemailer from "nodemailer";
import { env } from "../env.mjs";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: parseInt(env.EMAIL_PORT, 10),
  secure: Boolean(parseInt(env.EMAIL_SECURE, 10)),
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD
  }
});

export default transporter;
