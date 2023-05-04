import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('databaseHost'),
                port: configService.get<number>('databasePort'),
                username: configService.get<string>('databaseUsername'),
                password: configService.get<string>('databasePassword'),
                database: configService.get<string>('databaseName'),
                entities: [__dirname + '/../entities/*{.ts,.js}'],
                autoLoadEntities: true,
                logger: 'advanced-console',
                logging: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
