import { Auth } from '@src/entities/auth.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {}
