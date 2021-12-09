import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Section } from 'src/section/entities/section.entity';
import { TransactionsClass } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Repository } from 'typeorm';
import { CreateDoorDto } from './dto/create-door.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { Door, DoorTmp } from './entities/door.entity';

@Injectable()
export class DoorService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(Door)
    private doorRepository: Repository<Door>,

    private transactionsService: TransactionsService
  ) {}

  // ----------------------- //
  // ----- CREATE DOOR ----- //
  // ----------------------- //
  async create(createDoorDto: CreateDoorDto) {
    // --- Verify if org exists --- //
    console.log(createDoorDto.organization_name)
    const org = await this.organizationRepository.findOne({name: createDoorDto.organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Verify if section exists --- //
    const section = await this.sectionRepository.findOne({name: createDoorDto.section_name});
    if (!section) {
      throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Verify if door already exists inside the same section --- //
    const check_door = await this.doorRepository.findOne({
      name: createDoorDto.name,
      org_id: org.id,
      section_id: section.id
    });

    if (check_door) {
      throw new HttpException(createDoorDto.name + ' already exists in ' + org.name + '\'s ' + section.name, HttpStatus.BAD_REQUEST);
    }

    // --- Add door --- //
    const doorTmp: DoorTmp = {
      name: createDoorDto.name,
      hash: createDoorDto.hash,
      org_id: org.id,
      section_id: section.id
    }

    const door = await this.doorRepository.save(doorTmp);
    if (!door) {
      throw new HttpException('Failed to create the door', HttpStatus.BAD_REQUEST);
    }

    // --- Fill the transaction table --- //
    const trans: TransactionsClass = {
      method: 'createDoor',
      org_id: org.id,
      section_id: section.id,
      user_id: null,
      door_id: door.id
    }

    await this.transactionsService.create(trans);

    return createDoorDto.name + ' added in ' + createDoorDto.organization_name + '\'s ' + createDoorDto.section_name;
  }

  // -------------------------- //
  // ----- FIND ALL DOORS ----- //
  // -------------------------- //
  async findAll() {
    return await this.doorRepository.find();
  }

  // ------------------------------------ //
  // ----- FIND ALL DOORS IN AN ORG ----- //
  // ------------------------------------ //
  async findAllInOrg(organization_name: string): Promise<Door[]> {

    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
    
    return await this.doorRepository.find({org_id: org.id});
  }

  // --------------------------------------- //
  // ----- FIND ALL DOORS IN A SECTION ----- //
  // --------------------------------------- //
  async findAllInSect(organization_name: string, section_name: string): Promise<Door[]> {

    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Verify if section exists --- //
    const section = await this.sectionRepository.findOne({name: section_name});
    if (!section) {
      throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND);
    }
    
    return await this.doorRepository.find(
      {
        org_id: org.id,
        section_id: section.id,
      });
  }

  async findOne(organization_name: string, section_name: string, door_name: string): Promise<Section> {
    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Verify if section exists --- //
    const section = await this.sectionRepository.findOne({name: section_name});
    if (!section) {
      throw new HttpException('Section does not exist', HttpStatus.NOT_FOUND);
    }

    const door = await this.doorRepository.findOne({name: door_name});
    if (door) {
      return door;
    }
    throw new HttpException('Door does not exist', HttpStatus.NOT_FOUND);
  }

  async update(org_name: string, section_name: string, door_name: string, updateDoorDto :UpdateDoorDto) {

    // --- Verify if the user is trying to move the door to another organization --- //
    if (updateDoorDto.organization_name != org_name) {
      throw new HttpException('Forbidden !! You\'re not allowed to change the organization', HttpStatus.BAD_REQUEST);
    }

    // --- Verify if the user is trying to move the door to another section --- //
    if (updateDoorDto.section_name != section_name) {
      throw new HttpException('Forbidden !! You\'re not allowed to change the section', HttpStatus.BAD_REQUEST);
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

    // --- Verify if door exists --- //
    const door = await this.doorRepository.findOne({name: door_name});
    if (!door) {
      throw new HttpException('Door does not exist', HttpStatus.NOT_FOUND);
    }

    // --- Try to update --- //
    const doorTmp: DoorTmp = {
      name: updateDoorDto.name,
      hash: updateDoorDto.hash,
      org_id: org.id,
      section_id: section.id
    }

    const answer = await this.sectionRepository.update(door, doorTmp);
    if (!answer) {
      throw new HttpException('Failed to update the door', HttpStatus.BAD_REQUEST);
    }
  
    // --- Fill the transaction table --- //
    const trans: TransactionsClass = {
      method: 'updateDoor',
      org_id: org.id,
      section_id: section.id,
      user_id: null,
      door_id: door.id
    }

    await this.transactionsService.create(trans);

    return updateDoorDto.name + ' updated in ' + updateDoorDto.organization_name + '\'s ' + updateDoorDto.section_name;
  }

  async remove(org_name: string, section_name: string, door_name: string) {
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

    const door = await this.doorRepository.findOne(
      {
        name: door_name,
        org_id: org.id,
        section_id: section.id
      });
    if (door) {
      // --- Fill the transaction table --- //
      const trans: TransactionsClass = {
        method: 'createSection',
        org_id: org.id,
        section_id: section.id,
        user_id: null,
        door_id: door.id
      }

      await this.transactionsService.create(trans);
      return this.doorRepository.remove(door)
    }
    throw new HttpException('Door does not exist', HttpStatus.NOT_FOUND);
  }
}
