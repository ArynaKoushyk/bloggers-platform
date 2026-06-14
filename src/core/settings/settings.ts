import { SignOptions } from "jsonwebtoken";

export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "bloggers",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_ACCESS_TOKEN_EXPIRES_IN: "1h" as SignOptions["expiresIn"],
};
