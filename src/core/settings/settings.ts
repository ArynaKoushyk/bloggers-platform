import { SignOptions } from "jsonwebtoken";

//!! спросить про dotenv
export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "bloggers",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "secret",
  JWT_ACCESS_TOKEN_EXPIRES_IN: "10s" as SignOptions["expiresIn"],
  JWT_REFRESH_TOKEN_EXPIRES_IN: "20s" as SignOptions["expiresIn"],
  REFRESH_TOKEN_COOKIE_MAX_AGE:30 * 24 * 60 * 60 * 1000,
  GMAIL_USER: process.env.GMAIL_USER || "aryna.koushyk@gmail.com",
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || "falkhvetpfpmtwoc",
  FRONTEND_URL: process.env.FRONTEND_URL || "https://somesite.com",
};
