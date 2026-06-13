import { PasswordHashService } from "../applications/types/password-hash.service.type";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const bcryptPasswordHashAdapter: PasswordHashService = {
  async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  },
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
