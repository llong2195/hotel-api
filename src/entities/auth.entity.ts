import { DateAudit } from '@base/date.audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth')
export class Auth extends DateAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, name: 'code', length: 12 })
    code: string;

    @Column({ type: 'varchar', unique: true, name: 'phone_number', length: 50 })
    phoneNumber: string;

    @Column({ type: 'varchar', name: 'password', nullable: false, length: 100 })
    password: string | null;

    @Column({
        type: 'varchar',
        name: 'language',
        length: 12,
        default: 'vi',
        comment: 'vi: Vietnamese | en: English | ...',
    })
    language: string;

    constructor(partial: Partial<Auth>) {
        super();
        Object.assign(this, partial);
    }
}
