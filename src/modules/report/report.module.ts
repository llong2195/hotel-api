import { MessageComponent } from 'src/components/message.component';
import { Report } from '@src/entities/report.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Report])],
    providers: [MessageComponent, ReportService],
    exports: [TypeOrmModule],
    controllers: [ReportController],
})
export class ReportModule {}
