import ComponentService from 'src/components/component';
import { MessageComponent } from 'src/components/message.component';
import { Auth } from '@src/entities/auth.entity';
import { Posts } from '@src/entities/posts.entity';
import { PostSave } from '@src/entities/post-save.entity';
import { UserEntity } from '@src/entities/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthServices } from '../auth/auth.service';
import { PostSaveService } from '../postSave/postSave.service';
import { UserService } from '../user/user.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Posts, PostRepository, UserEntity, Auth, PostSave])],
    providers: [PostService, MessageComponent, UserService, ComponentService, AuthServices, PostSaveService],
    exports: [TypeOrmModule],
    controllers: [PostController],
})
export class PostModule {}
