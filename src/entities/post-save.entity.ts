import { DateAudit } from '@base/date.audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post_save')
export class PostSave extends DateAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { unique: true, name: 'user_id' })
    userId: number;

    @Column('int', { unique: true, name: 'post_id' })
    postId: number;

    constructor(partial: Partial<PostSave>) {
        super();
        Object.assign(this, partial);
    }
}
