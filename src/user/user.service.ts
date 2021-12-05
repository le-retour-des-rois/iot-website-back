import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
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
    private organizationRepository: Repository<Organization>
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

    if (check_user) {
      throw new HttpException(createUserDto.username + ' already exists in ' + org.name, HttpStatus.BAD_REQUEST);
    }

    // --- Add User --- //
    const userTmp: UserTmp = {
      username: createUserDto.username,
      password: createUserDto.password,
      type: createUserDto.type,
      org_id: org.id
    }

    const user = this.userRepository.create(userTmp);
    if (!user) {
      throw new HttpException('Failed to create the user', HttpStatus.BAD_REQUEST);
    }

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
      type: updateUserDto.type,
      org_id: org.id
    }

    const answer = await this.userRepository.update(user, userTmp);
    if (!answer) {
      throw new HttpException('Failed to create the user', HttpStatus.BAD_REQUEST);
    }

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
    return deleteResponse;
  }
}
