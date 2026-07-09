import { mongoUsersRepository } from "../../users/repositories/mongo-users.repository";
import { bcryptPasswordHashAdapter } from "../adapters/bcrypt-password-hash.adapter";
import { jwtAdapter } from "../adapters/jwt.adapter";
import { nodemailerAdapter } from "../adapters/nodemailer.adapter";
import { createAuthService } from "../applications/auth.service";

export const authService = createAuthService(
  mongoUsersRepository,
  bcryptPasswordHashAdapter,
  jwtAdapter,
  nodemailerAdapter
);
