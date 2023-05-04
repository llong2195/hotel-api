import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { DateAudit } from '@base/date.audit.entity';
import { UserEntity } from './user.entity';

@Entity('post')
export class Posts extends DateAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { unique: true, name: 'authorId' })
    authorId: number;

    @Column('varchar', { unique: true, name: 'title', length: 500 })
    title: string;

    @Column('varchar', { unique: true, name: 'detail' })
    detail: string;

    @Column('varchar', { unique: true, name: 'postTime' })
    postTime: number;

    @Column('int', { unique: true, name: 'price' })
    price: number;
    @Column('int', { unique: true, name: 'min_price' })
    minPrice: number;
    @Column('int', { unique: true, name: 'max_price' })
    maxPrice: number;

    @Column('int', { unique: true, name: 'time_unit' })
    timeUnit: number;

    @Column('varchar', { unique: true, name: 'address' })
    address: string;

    @Column('int', { unique: true, name: 'postType' })
    postType: number;

    @Column('int', { unique: true, name: 'status' })
    status: number;

    @Column('varchar', { unique: true, name: 'image' })
    image: string;

    constructor(partial: Partial<Posts>) {
        super();
        Object.assign(this, partial);
    }
}

export class PostEX extends Posts {
    @JoinColumn({ name: 'author' })
    author: UserEntity;
}
