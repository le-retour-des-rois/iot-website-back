import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from 'src/section/entities/section.entity';
import { TransactionsClass } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,

    private readonly transactionsService: TransactionsService
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const check_org = await this.organizationRepository.findOne({name: createOrganizationDto.name});
    if (check_org) {
      throw new HttpException('Organization already exists', HttpStatus.BAD_REQUEST);
    }

    const org = await this.organizationRepository.save(createOrganizationDto);
    if (!org) {
      throw new HttpException('Organization creation failed', HttpStatus.BAD_REQUEST);
    }

    // --- Fill the transaction table --- //
    const trans: TransactionsClass = {
      method: 'createOrg',
      org_id: org.id,
      section_id: null,
      user_id: null,
      door_id: null
    }

    await this.transactionsService.create(trans);

    // --- Return the function --- //
    return 'Organization ' + createOrganizationDto.name + ' created !';
  }

  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.find();
  }

  async findOne(id: number): Promise<Organization> {
    const door = await this.organizationRepository.findOne(id);
    if (door) {
      return door;
    }
    throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
  }

  async findByName(name: string): Promise<Organization> {
    const org = await this.organizationRepository.findOne({name: name});
    if (org) {
      return org;
    }
    throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const org = await this.findOne(id);
    if (org) {
      // --- Fill the transaction table --- //
      const trans: TransactionsClass = {
        method: 'updateOrg',
        org_id: org.id,
        section_id: null,
        user_id: null,
        door_id: null
      }
      await this.transactionsService.create(trans);

      return this.organizationRepository.update(org, updateOrganizationDto);
    }
  }

  async remove(id: number) {
    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne(id);
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Verify if a section exists in this organization --- //
    const section = await this.sectionRepository.findOne({ org_id: org.id });
    if (section)
      throw new HttpException('Organization not empty', HttpStatus.BAD_REQUEST);

    // --- Fill the transaction table --- //
    const trans: TransactionsClass = {
      method: 'deleteOrg',
      org_id: org.id,
      section_id: null,
      user_id: null,
      door_id: null
    }
    await this.transactionsService.create(trans);

    return await this.organizationRepository.remove(org);
  }
}
