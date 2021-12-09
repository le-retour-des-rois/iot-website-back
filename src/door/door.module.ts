import { Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { DoorController } from './door.controller';
import { Door } from './entities/door.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Section } from 'src/section/entities/section.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Door, Organization, Section]),
    TransactionsModule
  ],
  controllers: [DoorController],
  providers: [DoorService]
})
export class DoorModule {}
