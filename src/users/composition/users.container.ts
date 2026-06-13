import { bcryptPasswordHashAdapter } from "../../auth/adapters/bcrypt-password-hash.adapter";
import { createUsersService } from "../applications/users.service";
import { mongoUsersRepository } from "../repositories/mongo-users.repository";

const passwordHashService = bcryptPasswordHashAdapter;
export const usersService = createUsersService(mongoUsersRepository, passwordHashService);
