import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const generateAppleSecret = () => {
  if (
    !process.env.APPLE_TEAM_ID ||
    !process.env.APPLE_SERVICE_ID ||
    !process.env.APPLE_PRIVATE_KEY
  )
    throw new Error("Missing environment variables");

  return jwt.sign(
    {
      iat: new Date().getTime() / 1000,
    },
    `${process.env.APPLE_PRIVATE_KEY}`,
    {
      audience: "https://appleid.apple.com",
      issuer: process.env.APPLE_TEAM_ID,
      expiresIn: "180d",
      header: {
        alg: "ES256",
        kid: process.env.APPLE_KEY_ID,
      },
      subject: process.env.APPLE_SERVICE_ID,
    }
  );
};

try {
  const secret = generateAppleSecret();
  console.log("----- Apple Auth Secret -----\n" + secret);
  process.exit(0);
} catch (err) {
  console.log(err);
  process.exit(1);
}
