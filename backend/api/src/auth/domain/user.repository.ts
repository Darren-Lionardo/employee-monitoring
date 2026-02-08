import { LoginDto } from '../dto/login.dto';
import { User } from './user.entity';

export interface UserRepository {
  create(email: string, password: string, role: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  find(id: string): Promise<User | null>;
  update(id: string, data: Partial<LoginDto>): Promise<User>;
  delete(email: string): Promise<void>;
}
