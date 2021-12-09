import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Section } from 'src/section/entities/section.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Door } from 'src/door/entities/door.entity';
import { Auth } from 'src/admin/entities/auth.entity';
import { Transactions } from 'src/transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PGHOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Section, Organization, Door, Transactions, Auth],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
