import { BaseDto } from 'src/base/base.dto';
import { UserEntity } from '@src/entities/user.entity';
import { Property } from 'src/utils/general.util';

export class GetUserDto extends BaseDto<UserEntity> {
    @Property()
    id: number;

    @Property()
    code: string;

    @Property()
    phoneNumber: string;

    @Property()
    email: string;

    @Property()
    name: string;

    @Property()
    gender: number;

    @Property()
    language: string;

    @Property()
    birthday: string;

    @Property()
    avatar: string;

    @Property()
    address: string;

    @Property()
    totalPost: number;
}
