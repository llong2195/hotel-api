import { DateAudit } from '@base/date.audit.entity';
import { Column, Entity } from 'typeorm';

@Entity('token')
export class Token extends DateAudit {
    @Column('int', { primary: true, name: 'id' })
    userId: number;

    // @Property()
    // role: string;
    @Column('varchar', { name: 'code' })
    userCode: string;

    constructor(partial: Partial<Token>) {
        super();
        Object.assign(this, partial);
    }
}
