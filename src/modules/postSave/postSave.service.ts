import { BaseService } from 'src/base/base.service';
import { ErrorCodes } from 'src/constants/error-code.const';
import { PostSave } from '@src/entities/post-save.entity';
import { DatabaseError } from 'src/exceptions/errors/database.error';
import { LoggerService } from 'src/logger/custom.logger';
import { InsertResult, QueryFailedError, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostSaveService extends BaseService<PostSave, Repository<PostSave>> {
    constructor(
        @InjectRepository(PostSave)
        protected readonly repository: Repository<PostSave>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }

    async getSaveForUser(userId): Promise<PostSave[]> {
        return await this.repository.find({
            where: [{ userId: userId }],
        });
    }
    async getSave(userId, postId): Promise<PostSave> {
        return await this.repository.findOne({
            where: [{ userId: userId, postId: postId }],
        });
    }
    async savePost(postId: number, userId: number): Promise<PostSave> {
        const isDuplicated = await this.repository.findOne({
            where: [{ userId, postId }],
        });

        if (isDuplicated && isDuplicated.userId == userId && isDuplicated.postId == postId) {
            throw new DatabaseError('SAVE_POST_EXIST', 'Duplicated record', ErrorCodes.SAVE_POST_EXIST);
        }
        let result: InsertResult;
        try {
            result = await this.repository.createQueryBuilder().insert().values({ userId, postId }).execute();
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    'INSERT_ERROR',
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.INSERT_ERROR,
                );
            }
            throw new DatabaseError(
                'DATABASE_CONNECTION_ERROR',
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }
        return new PostSave(result.generatedMaps[0]);
    }

    async deleteSave(postId: number, userId: number) {
        const isDuplicated = await this.repository.findOne({
            where: {
                userId,
                postId,
            },
        });

        if (!isDuplicated) {
            throw new DatabaseError('SAVE_POST_NOT_EXIST', 'SAVE_POST_NOT_EXIST', ErrorCodes.SAVE_POST_NOT_EXIST);
        }
        console.log('post', isDuplicated);

        try {
            return this.repository.delete(isDuplicated.id);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    'DELETE_ERROR',
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.DELETE_ERROR,
                );
            }
            throw new DatabaseError(
                'DATABASE_CONNECTION_ERROR',
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }
    }
}
