import { SignOptions } from "jsonwebtoken";

//!! спросить про dotenv
export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "bloggers",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_ACCESS_TOKEN_EXPIRES_IN: "1h" as SignOptions["expiresIn"],
  GMAIL_USER: process.env.GMAIL_USER || "aryna.koushyk@gmail.com",
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || "falkhvetpfpmtwoc",
  FRONTEND_URL: process.env.FRONTEND_URL || "https://somesite.com",
};
