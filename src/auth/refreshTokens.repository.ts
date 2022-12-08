import { Repository } from 'typeorm';
import { RefreshToken } from './refreshToken.entity';

export class RefreshTokensRepository extends Repository<RefreshToken> {}
