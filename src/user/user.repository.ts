import { Repository } from 'typeorm';
import { User } from './user.entity';

export class UserRepository extends Repository<User> {}
