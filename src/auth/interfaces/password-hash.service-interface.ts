export interface IPasswordHashService {
  generateHash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
};
