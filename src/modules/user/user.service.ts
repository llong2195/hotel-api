import { BaseService } from 'src/base/base.service';
import { PaginationDto } from 'src/base/pagination.dto';
import { DefaultSetting } from 'src/constants/app-setting';
import { ErrorCodes } from 'src/constants/error-code.const';
import { UserEntity } from '@src/entities/user.entity';
import { DatabaseError } from 'src/exceptions/errors/database.error';
import { LoggerService } from 'src/logger/custom.logger';
import { DeleteResult, InsertResult, QueryFailedError, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService extends BaseService<UserEntity, Repository<UserEntity>> {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly repository: Repository<UserEntity>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }

    async getAll(): Promise<UserEntity[]> {
        return await this.repository.find();
    }

    /**
     * @param {string} code
     * @param {boolean} getFullInfo
     * @param {string} fields
     *
     * @returns Promise<GetUserDto | UserEntity>
     */
    async getUser(code: string, getFullInfo: boolean = false, fields?: string[]): Promise<GetUserDto | UserEntity> {
        const user = new GetUserDto();
        if (fields) {
            fields = fields.filter(field => {
                return user.hasProperty(field);
            });

            if (!fields.includes('code')) fields.push('code');
            if (!fields.includes('id')) fields.push('id');
        }

        const result = await this.getOne({ code }, !getFullInfo && fields ? fields : null);

        if (!result) throw new DatabaseError('USER_NOT_EXIST', "User doesn't exist", ErrorCodes.USER_NOT_EXIST);

        if (!getFullInfo) {
            user.setAttributes(result);

            return user;
        }

        return result;
    }

    /**
     * @param {CreateUserDto} userData
     *
     * @returns Promise<User>
     */
    async createUser(userData: CreateUserDto): Promise<UserEntity> {
        userData.avatar = DefaultSetting.DEFAULT_AVATAR;
        const isDuplicated = await this.repository.findOne({
            where: [
                { code: userData.code },
                { phoneNumber: userData.phoneNumber ? userData.phoneNumber : '-' },
                { email: userData.email ? userData.email : '-' },
            ],
        });

        if (isDuplicated) {
            throw isDuplicated.code == userData.code
                ? new DatabaseError(
                      'USER_CODE_ALREADY_EXISTS',
                      'Duplicated User Code',
                      ErrorCodes.USER_CODE_ALREADY_EXISTS,
                  )
                : new DatabaseError(
                      'USER_PHONE_NUMBER_ALREADY_EXISTS',
                      'Duplicated Phone Number',
                      ErrorCodes.USER_PHONE_NUMBER_ALREADY_EXISTS,
                  );
        }

        let result: InsertResult;
        try {
            result = await this.repository.createQueryBuilder().insert().values(userData).execute();
        } catch (error: unknown) {
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

        return new UserEntity(result.generatedMaps[0]);
    }

    /**
     * @param {string} code
     * @param {UpdateUserDto} userData
     *
     * @returns Promise<User>
     */
    async updateUser(code: string, userData: Record<string, unknown>): Promise<UserEntity> {
        try {
            //Update Record in User Table

            const res = await this.repository
                .createQueryBuilder()
                .update()
                .set(userData)
                .where('code = :code', { code: code })
                .execute();
            console.log('data', userData);
        } catch (error: unknown) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    'UPDATE_ERROR',
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.UPDATE_ERROR,
                );
            }
            throw new DatabaseError(
                'DATABASE_CONNECTION_ERROR',
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }

        return await this.repository.findOne({ where: { code: code } });
    }

    async updateTotalPost(id: number) {
        try {
            //Update Record in User Table
            console.log('userID', id);

            const res = await this.repository
                .createQueryBuilder()
                .update()
                .set({ totalPost: () => 'total_post + 1' })
                .where('id = :id', { id: id })
                .execute();
        } catch (error: unknown) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    'UPDATE_ERROR',
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.UPDATE_ERROR,
                );
            }
            throw new DatabaseError(
                'DATABASE_CONNECTION_ERROR',
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }

        return await this.repository.findOne({ where: { id: id } });
    }

    /**
     * @param {string} code
     *
     * @returns Promise<DeleteResult>
     */
    async deleteUser(code: string): Promise<DeleteResult> {
        return this.repository.delete({ code: code });
    }

    /**
     * @param {number} page
     * @param {number} limit
     * @param {string[]} fields
     * @returns
     */
    async paginateUser(page: number, limit: number, fields?: string[]): Promise<PaginationDto<GetUserDto>> {
        if (fields) {
            const user = new GetUserDto();
            fields = fields.filter(field => {
                return user.hasProperty(field);
            });
            fields.push('code');
        }

        const rawPagination = await this.paginate(page, limit, fields);
        const rawData = rawPagination.data;

        const userPagination = new PaginationDto<GetUserDto>();

        const newData: GetUserDto[] = [];
        rawData.forEach((user: UserEntity) => {
            newData.push(new GetUserDto(user));
        });

        userPagination.data = newData;
        userPagination.meta = rawPagination.meta;

        return userPagination;
    }

    /**
     *
     * @param id
     * @returns
     */
    async getUserById(id: number): Promise<UserEntity> {
        // console.log("id", id);

        // const query = this.repository.createQueryBuilder()
        // query.select("*")
        //     .where("id = :id", { id })
        const user = await this.repository.findOne({
            where: [{ id: id }],
        });
        return user;
        // console.log("userQuery", query.getQuery());

        // return query.getOne()
    }

    async updateUserById(id, data: unknown): Promise<any> {
        try {
            const result = await this.repository.update(id, data);
            if (result.affected) {
                return await this.repository.findOneBy({ id });
            } else {
                throw new DatabaseError('UPDATE_ERROR', 'UserId không tồn tại', ErrorCodes.UPDATE_ERROR);
            }
        } catch (error) {
            throw new DatabaseError('UPDATE_ERROR', error as Record<string, unknown>, ErrorCodes.UPDATE_ERROR);
        }
    }
}
