import { DateAudit } from '@base/date.audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('report')
export class Report extends DateAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'user_report', comment: 'User report' })
    userReport: number;

    @Column({ type: 'int', name: 'reported_user', comment: 'Reported user', default: 0 })
    reportedUser: number;

    @Column({ type: 'int', name: 'reported_post', comment: 'Reported post', default: 0 })
    reportedPost: number;

    @Column({ type: 'text', name: 'note', comment: 'Note' })
    note: string;

    constructor(partial: Partial<Report>) {
        super();
        Object.assign(this, partial);
    }
}
