import { Posts } from '@src/entities/posts.entity';
import { EntityRepository, Repository } from 'typeorm';

EntityRepository(Posts);
export class PostRepository extends Repository<Posts> {}
