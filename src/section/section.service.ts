import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section, SectionTmp } from './entities/section.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  // ------------------------- //
  // ----- CREATE SECTION----- //
  // ------------------------- //
  async create(createSectionDto: CreateSectionDto) {
    const org = await this.organizationRepository.findOne({name: createSectionDto.organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    const check_section = await this.sectionRepository.findOne({
      name: createSectionDto.name,
      org_id: org.id
    });

    if (check_section) {
      throw new HttpException(createSectionDto.name + ' already exists in ' + org.name, HttpStatus.BAD_REQUEST);
    }

    const sectionTmp: SectionTmp = {
      name: createSectionDto.name,
      org_id: org.id
    }

    const section = await this.sectionRepository.save(sectionTmp);
    if (!section) {
      throw new HttpException('Failed to create the section', HttpStatus.BAD_REQUEST);
    }

    return createSectionDto.name + ' added in organization ' + createSectionDto.organization_name;
  }

  // ----------------------------- //
  // ----- FIND ALL SECTIONS ----- //
  // ----------------------------- //
  async findAll(): Promise<Section[]> {
    return await this.sectionRepository.find();
  }

  // --------------------------------------- //
  // ----- FIND ALL SECTIONS IN AN ORG ----- //
  // --------------------------------------- //
  /*async findAllInOrg(organization_name: string): Promise<Section[]> {
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
    
    return await this.sectionRepository.find();
  }*/

  
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
