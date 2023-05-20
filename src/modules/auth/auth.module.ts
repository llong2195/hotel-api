import ComponentService from 'src/components/component';
import { MessageComponent } from 'src/components/message.component';
import { Auth } from '@src/entities/auth.entity';
import { PostSave } from '@src/entities/post-save.entity';
import { UserEntity } from '@src/entities/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostSaveService } from '../postSave/postSave.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthServices } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth, UserEntity, PostSave]),
        JwtModule.register({
            global: true,
            secret: 'jwtConstants.secret',
            signOptions: { expiresIn: '60h' },
        }),
    ],
    providers: [AuthServices, MessageComponent, UserService, ComponentService, PostSaveService],
    exports: [TypeOrmModule, AuthServices, AuthServices],
    controllers: [AuthController],
})
export class AuthModule {}
