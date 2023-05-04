import ComponentService from 'src/components/component';
import { MessageComponent } from 'src/components/message.component';
import { Auth } from '@src/entities/auth.entity';
import { Posts } from '@src/entities/posts.entity';
import { PostSave } from '@src/entities/post-save.entity';
import { UserEntity } from '@src/entities/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthServices } from '../auth/auth.service';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { PostSaveController } from './postSave.controller';
import { PostSaveService } from './postSave.service';

@Module({
    imports: [TypeOrmModule.forFeature([PostSave, UserEntity, Auth, Posts])],
    providers: [MessageComponent, UserService, ComponentService, AuthServices, PostService, PostSaveService],
    exports: [TypeOrmModule],
    controllers: [PostSaveController],
})
export class PostSaveModule {}
