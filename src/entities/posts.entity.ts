import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { DateAudit } from '@base/date.audit.entity';
import { UserEntity } from './user.entity';

@Entity('post')
export class Posts extends DateAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'authorId' })
    authorId: number;

    @Column({ type: 'varchar', name: 'title', length: 500 })
    title: string;

    @Column({ type: 'varchar', name: 'detail' })
    detail: string;

    @Column({ type: 'varchar', name: 'postTime', default: 'CURRENT_TIMESTAMP' })
    postTime: number;

    @Column({ type: 'int', name: 'price', default: '0' })
    price: number;

    @Column({ type: 'int', name: 'time_unit', default: '0' })
    timeUnit: number;

    @Column({ type: 'varchar', name: 'address' })
    address: string;

    @Column({ type: 'int', name: 'postType', default: '0' })
    postType: number;

    @Column({ type: 'int', name: 'status', default: '0' })
    status: number;

    @Column({ type: 'varchar', name: 'image' })
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
