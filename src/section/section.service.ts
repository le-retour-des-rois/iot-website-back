import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { OrgSection, OrgSectionTmp } from './entities/orgsection.entity';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(OrgSection)
    private orgSectionRepository: Repository<OrgSection>
  ) {}

  
  async create(createSectionDto: CreateSectionDto) {
    const org = await this.organizationRepository.findOne({name: createSectionDto.organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    const check_section = await this.sectionRepository.findOne({name: createSectionDto.name});
    if (check_section) {
      throw new HttpException('This section already exists', HttpStatus.BAD_REQUEST);
    }

    const section = await this.sectionRepository.save(createSectionDto);
    if (!section) {
      throw new HttpException('Failed to create the section', HttpStatus.BAD_REQUEST);
    }

    const orgSection: OrgSectionTmp = {
      org_id: org.id,
      section_id: section.id
    }

    const res = await this.orgSectionRepository.save(orgSection);
    if (!res) {
      throw new HttpException('Failed to create the org_section', HttpStatus.BAD_REQUEST);
    }

    return createSectionDto.name + ' added in organization ' + createSectionDto.organization_name;
  }

  async findAll(): Promise<Section[]> {
    return await this.sectionRepository.find();
  }

  async findOne(id: number): Promise<Section> {
    const door = await this.sectionRepository.findOne(id);
    if (door) {
      return door;
    }
    throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND);
  }

  async update(id: number, updateSectionDto: UpdateSectionDto) {
    const projet = await this.findOne(id);
    if (projet)
      return this.sectionRepository.update(projet, updateSectionDto);
  }

  async remove(id: number) {
    const projet = await this.findOne(id);
    if (projet)
      return this.sectionRepository.remove(projet)
    throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND); 
  }
}
