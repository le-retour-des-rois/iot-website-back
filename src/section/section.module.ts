import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Organization])],
  controllers: [SectionController],
  providers: [SectionService]
})
export class SectionModule {}
