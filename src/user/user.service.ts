import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { TransactionsClass } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserTmp } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    private transactionsService: TransactionsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: createUserDto.organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }

    if (createUserDto.type != "regular" && createUserDto.type != "admin") {
      throw new HttpException('User type must be "regular or admin"', HttpStatus.BAD_REQUEST);
    }

    // --- Verify if user already exists inside the same organization --- //
    const check_user = await this.userRepository.findOne({
      username: createUserDto.username,
      org_id: org.id
    });

    // --- Verify if mac addr already exists inside the same organization --- //
    const check_mac = await this.userRepository.findOne({
      mac_addr: createUserDto.mac_addr,
      org_id: org.id
    });

    if (check_user || check_mac) {
      throw new HttpException(createUserDto.username + ' already exists in ' + org.name, HttpStatus.BAD_REQUEST);
    }

    // --- Add User --- //
    const userTmp: UserTmp = {
      username: createUserDto.username,
      password: createUserDto.password,
      mac_addr: createUserDto.mac_addr,
      type: createUserDto.type,
      org_id: org.id
    }

    const answer = await this.userRepository.save(userTmp);
    if (!answer) {
      throw new HttpException('Failed to create the user', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({
      mac_addr: createUserDto.mac_addr,
      org_id: org.id
    });

    // --- Fill the transaction table --- //
    const trans: TransactionsClass = {
      method: 'createUser',
      org_id: org.id,
      section_id: null,
      user_id: user.id,
      door_id: null
    }

    await this.transactionsService.create(trans);

    return createUserDto.username + ' added in organization ' + createUserDto.organization_name;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findAllInOrg(organization_name: string): Promise<User[]> {

    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
    
    return await this.userRepository.find({org_id: org.id});
  }

  async getIdWithName(organization_name: string, username: string) {
    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: organization_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
    // --- Verify if user exists --- //
    const user = await this.userRepository.findOne({
      username: username,
      org_id: org.id
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return { id: user.id }
  } 

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // --- Verify if user exists --- //
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const org = await this.organizationRepository.findOne(user.org_id);

    const userTmp: UserTmp = {
      username: updateUserDto.username,
      password: updateUserDto.password,
      mac_addr: updateUserDto.mac_addr,
      type: updateUserDto.type,
      org_id: org.id
    }

    const answer = await this.userRepository.update(user, userTmp);
    if (!answer) {
      throw new HttpException('Failed to update the user', HttpStatus.BAD_REQUEST);
    }

    // --- Fill the transaction table --- //
    const trans: TransactionsClass = {
      method: 'updateUser',
      org_id: org.id,
      section_id: null,
      user_id: user.id,
      door_id: null
    }

    await this.transactionsService.create(trans);

    return updateUserDto.username + ' updated in organization ' + org.name;
  }

  async remove(org_name: string, username: string): Promise<DeleteResult>{
    // --- Verify if org exists --- //
    const org = await this.organizationRepository.findOne({name: org_name});
    if (!org) {
      throw new HttpException('Organization does not exist', HttpStatus.NOT_FOUND);
    }
    
    const deleteResponse = await this.userRepository.delete({ username : username });
    if (!deleteResponse.affected) {
      throw new HttpException("User not found. Can't be deleted", HttpStatus.NOT_FOUND);
    }


    // --- Fill the transaction table --- //
    const user = await this.userRepository.findOne({ username : username });

    const trans: TransactionsClass = {
      method: 'createUser',
      org_id: org.id,
      section_id: null,
      user_id: user.id,
      door_id: null
    }

    await this.transactionsService.create(trans);

    return deleteResponse;
  }
}
