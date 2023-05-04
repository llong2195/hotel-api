import { DateAudit } from '@base/date.audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends DateAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'code', length: 12 })
    code: string;

    @Column({ type: 'varchar', name: 'phone_number', length: 50 })
    phoneNumber: string;

    @Column({ type: 'varchar', name: 'email', nullable: true, length: 100, default: "''" })
    email: string | null;

    @Column({ type: 'varchar', name: 'name', nullable: true, length: 100, default: "''" })
    name: string | null;

    @Column({ type: 'tinyint', name: 'gender', default: 0, comment: '0: other | 1: male | 2: female' })
    gender: number;

    @Column({
        type: 'varchar',
        name: 'language',
        length: 12,
        default: 'vi',
        comment: 'vi: Vietnamese | en: English | ...',
    })
    language: string;

    @Column({ type: 'date', name: 'birthday', nullable: true })
    birthday: string | null;

    @Column({ type: 'int', name: 'status', comment: '0: inactive| 1: active| 2: block| 3: delete', default: () => 0 })
    status: number;

    @Column({ type: 'varchar', name: 'avatar', nullable: true, length: 255, default: "''" })
    avatar: string | null;

    @Column({ type: 'varchar', name: 'address', nullable: true, length: 255, default: "''" })
    address: string | null;

    @Column({ type: 'varchar', name: 'total_post', length: 255, default: '0' })
    totalPost: number;

    constructor(partial: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }
}
