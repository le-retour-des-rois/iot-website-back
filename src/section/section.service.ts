import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Door } from 'src/door/entities/door.entity';
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

    @InjectRepository(Door)
    private doorRepository: Repository<Door>,
  ) {}

  // -------------------------- //
  // ----- CREATE SECTION ----- //
  // -------------------------- //
  async create(createSectionDto: CreateSectionDto) {

    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: createSectionDto.organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Verify if section already exists inside the same organization --- //
    const check_section = await this.sectionRepository.findOne({
      name: createSectionDto.name,
      org_id: org.id
    });

    if (check_section) {
      throw new HttpException(createSectionDto.name + ' already exists in ' + org.name, HttpStatus.BAD_REQUEST);
    }

    // --- Add section --- //
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
  async findAllInOrg(organization_name: string): Promise<Section[]> {

    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
    
    return await this.sectionRepository.find({org_id: org.id});
  }

  async findOne(organization_name: string, section_name: string): Promise<Section> {

    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    const section = await this.sectionRepository.findOne({name: section_name});
    if (section) {
      return section;
    }
    throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND);
  }

  async update(org_name: string, section_name: string, updateSectionDto: UpdateSectionDto) {

    // --- Verify if the user is trying to move the section to another organization --- //
    if (updateSectionDto.organization_name != org_name) {
      throw new HttpException('Forbidden !! You\'re not allowed to change the organization', HttpStatus.BAD_REQUEST);
    }

    // --- Case there isn't any update --- //
    if (updateSectionDto.name == section_name) {
      return "No update applied"
    }

    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: org_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
    
    // --- Verify if section exists --- //
    const section = await this.sectionRepository.findOne({name: section_name});
    if (!section) {
      throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Try to update --- //
    const sectionTmp: SectionTmp = {
      name: updateSectionDto.name,
      org_id: org.id
    }

    const answer = await this.sectionRepository.update(section, sectionTmp);
    if (!answer) {
      throw new HttpException('Failed to create the section', HttpStatus.BAD_REQUEST);
    }

    return updateSectionDto.name + ' updated in organization ' + updateSectionDto.organization_name;
  }

  async remove(org_name: string, section_name: string) {
    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: org_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
     
    // --- Verify if section exists --- //
    const section = await this.sectionRepository.findOne({name: section_name});
    if (!section) {
      throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Verify if a door exists in this section --- //
    const door = await this.doorRepository.findOne(
      {
        org_id: org.id,
        section_id: section.id
      });
    if (door)
      throw new HttpException('Section not empty', HttpStatus.BAD_REQUEST);

    return await this.sectionRepository.remove(section);
  }
}
