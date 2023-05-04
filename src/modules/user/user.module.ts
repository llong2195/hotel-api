import { MessageComponent } from 'src/components/message.component';
import { UserEntity } from '@src/entities/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, MessageComponent],
    exports: [TypeOrmModule],
    controllers: [UserController],
})
export class UserModule {}
