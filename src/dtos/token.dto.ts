import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/base/base.dto';
import { Property } from 'src/utils/general.util';

import { ApiProperty } from '@nestjs/swagger';

class Obj {}

export class TokenDto extends BaseDto<Obj> {
    @ApiProperty({
        description: "Post's id",
        required: false,
    })
    @Property()
    @IsOptional()
    userId: number;

    @ApiProperty({
        description: "Post's author",
        required: false,
    })
    @Property()
    @IsOptional()
    code: string;
}
