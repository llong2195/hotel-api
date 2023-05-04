import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DateAudit extends BaseEntity {
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}
