import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/base/base.dto';
import { PostSave } from '@src/entities/post-save.entity';
import { Property } from 'src/utils/general.util';

import { ApiProperty } from '@nestjs/swagger';

export class SaveDto extends BaseDto<PostSave> {
    @ApiProperty({
        description: 'Save userId',
        required: true,
    })
    // @IsString()
    @Property()
    @IsOptional()
    userId: number;

    @ApiProperty({
        description: 'Post id',
        required: true,
    })
    // @IsString()
    @Property()
    @IsOptional()
    postId: number;
}

export class GetSaveDto extends BaseDto<PostSave> {
    @ApiProperty({
        description: 'Save userId',
        required: false,
    })
    // @IsString()
    @Property()
    @IsOptional()
    userId: number;

    @ApiProperty({
        description: 'Post id',
        required: false,
    })
    // @IsString()
    @Property()
    @IsOptional()
    postId: number;
}
