import { SignOptions } from "jsonwebtoken";
import { config } from "dotenv";

config();

const REFRESH_TOKEN_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

//!! спросить про dotenv
export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "bloggers",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string, 
  JWT_ACCESS_TOKEN_EXPIRES_IN: "10s" as SignOptions["expiresIn"],
  JWT_REFRESH_TOKEN_EXPIRES_IN: "20s" as SignOptions["expiresIn"],
  REFRESH_TOKEN_COOKIE_NAME: "refreshToken",
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
  },
  REFRESH_TOKEN_CLEAR_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
  },
  GMAIL_USER: process.env.GMAIL_USER || "aryna.koushyk@gmail.com",
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  FRONTEND_URL: process.env.FRONTEND_URL || "https://somesite.com",
};
