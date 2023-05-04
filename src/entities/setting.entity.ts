import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DateAudit } from '@base/date.audit.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('setting')
export class Setting extends DateAudit {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    @ApiProperty()
    id: number;

    @Column('varchar', { name: 'name', length: 50 })
    @ApiProperty()
    name: string;

    @Column('text', { name: 'value' })
    @ApiProperty()
    value: string;

    @Column('varchar', { name: 'type', length: 10, default: () => "''" })
    @ApiProperty()
    type: string;

    constructor(partial: Partial<Setting>) {
        super();
        Object.assign(this, partial);
    }
}
