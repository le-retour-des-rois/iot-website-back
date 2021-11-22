import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';

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

    const check_section = await this.sectionRepository.find({name: createSectionDto.name});

    /*// Verify if a section with the same name exists
    if (check_section != []) {
      const check_org_section = await this.orgSectionRepository.findOne({section_id: check_section.id});
      const check_org = await this.organizationRepository.findOne({id: check_org_section.org_id});
      console.log("check_org.name" + check_org.name)
      console.log("createSectionDto.organization_name" + createSectionDto.organization_name)
      // Verify if the associated organization is the same as the one in the createSectionDto Object
      if (check_org.name == createSectionDto.organization_name) {
        throw new HttpException('This section already exists', HttpStatus.BAD_REQUEST);
      }
    }*/

    const section = await this.sectionRepository.save(createSectionDto);
    if (!section) {
      throw new HttpException('Failed to create the section', HttpStatus.BAD_REQUEST);
    }

    /*const orgSection: OrgSectionTmp = {
      org_id: org.id,
      section_id: section.id
    }

    const res = await this.orgSectionRepository.save(orgSection);
    if (!res) {
      throw new HttpException('Failed to create the org_section', HttpStatus.BAD_REQUEST);
    }*/

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
