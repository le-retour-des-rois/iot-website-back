import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Section } from 'src/section/entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Section])],
  controllers: [OrganizationController],
  providers: [OrganizationService]
})
export class OrganizationModule {}
