import { Posts } from '@src/entities/posts.entity';
import { PaginatedDto } from 'src/api-response/api-response.dto';
import { BaseController } from 'src/base/base.controller';
import { iPaginationOption } from 'src/base/pagination.dto';
import ComponentService from 'src/components/component';
import { MessageComponent } from 'src/components/message.component';
import { ErrorCodes } from 'src/constants/error-code.const';
import { TokenDto } from 'src/dtos/token.dto';
import { InvalidValueError } from 'src/exceptions/errors/invalid-value.error';

import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DataSource, Like } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostDto, GetPostEXDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import * as db from './db';
@ApiBearerAuth()
@ApiTags('Post')
@Controller('post')
export class PostController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly postService: PostService,
        private readonly configService: ConfigService,
        private readonly component: ComponentService,
        private i18n: MessageComponent,
        private dataSource: DataSource,
    ) {
        super(i18n);
    }

    @Get()
    async findPost(
        @Query() token: TokenDto,
        @Query() paging: iPaginationOption,
        @Query() searchPost: GetPostDto,
    ): Promise<any> {
        console.log('params: ', token);
        if (!token.code || !token) {
            throw new InvalidValueError('INVALID_USER_CODE_AND_ID', 'USER_NOT_EXIST', ErrorCodes.INVALID_USER_CODE);
        }
        // fake address ha noi
        // const posts = await this.dataSource.manager.getRepository(Posts).find();
        // await Promise.all([
        //     posts.map(post => {
        //         const city = db.vn.province[0];
        //         const rawdistrict = db.vn.district.filter(i => i.idProvince == city.idProvince);
        //         const district = rawdistrict[Math.floor(Math.random() * rawdistrict.length)];
        //         const rawcommune = db.vn.commune.filter(i => i.idDistrict == district.idDistrict);
        //         const commune = rawcommune[Math.floor(Math.random() * rawcommune.length)];
        //         const address = `${commune.name},${district.name},${city.name}`;
        //         return this.dataSource.manager.getRepository(Posts).update({ id: post.id }, { address: address });
        //     }),
        // ]);
        try {
            const postData = await this.postService.find(searchPost, paging);
            const getPostData = postData as unknown as PaginatedDto<GetPostEXDto>;
            for (const rs of getPostData.data) {
                // Get more company address data
                await this.component.setExtraData(rs, token);
            }
            return getPostData;
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Get(':id')
    async getById(@Query() token: TokenDto, @Param('id') id: number): Promise<any> {
        console.log('params: ', token);
        if (!token.code || !token) {
            throw new InvalidValueError('INVALID_USER_CODE_AND_ID', 'USER_NOT_EXIST', ErrorCodes.INVALID_USER_CODE);
        }
        try {
            const postData = await this.postService.findById(id);
            const getPostData = postData as unknown as PaginatedDto<GetPostEXDto>;
            for (const rs of getPostData.data) {
                // Get more company address data
                await this.component.setExtraData(rs, token);
            }
            return getPostData;
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Get('/save-post/:id')
    async getSavePost(@Param('id') id: number, @Query() paging: iPaginationOption): Promise<any> {
        try {
            let token = new TokenDto();
            token.userId = id;
            const res = await this.postService.getUserSavePost(id, paging);
            const getPostData = res as unknown as PaginatedDto<GetPostEXDto>;
            for (const rs of getPostData.data) {
                // Get more company address data
                await this.component.setExtraData(rs, token);
            }
            return getPostData;
            // return res.map((item) => ({ ...item, isSave: 1 }))
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Post()
    async createPost(@Body() postData: CreatePostDto): Promise<Posts> {
        console.log('postData', postData);

        let user = await this.userService.getUserById(postData.authorId);
        if (!user) {
            throw new InvalidValueError('USER_NOT_EXIST', 'USER_NOT_EXIST', ErrorCodes.INVALID_USER_CODE);
        }
        try {
            const res = await this.postService.createPost(postData);
            if (res) {
                await this.userService.updateTotalPost(postData.authorId);
            }
            return res;
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Patch('/:id')
    async updatePost(@Param('id') id: number, @Body() postData: UpdatePostDto): Promise<any> {
        console.log('data', id, postData);
        try {
            return await this.postService.updatePostById(id, postData as unknown as Record<string, unknown>);
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }
}
