import { Report } from '@src/entities/report.entity';
import { EntityRepository, Repository } from 'typeorm';

EntityRepository(Report);
export default class ReportRepository extends Repository<Report> {}
