import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoorDto } from './dto/create-door.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { Door } from './entities/door.entity';

@Injectable()
export class DoorService {
  constructor(
    @InjectRepository(Door)
    private doorRepository: Repository<Door>
  ) {}

  async create(createDoorDto: CreateDoorDto) {
    return this.doorRepository.save(createDoorDto);
  }

  findAll() {
    return `This action returns all door`;
  }

  findOne(id: number) {
    return `This action returns a #${id} door`;
  }

  update(id: number, updateDoorDto: UpdateDoorDto) {
    return `This action updates a #${id} door`;
  }

  remove(id: number) {
    return `This action removes a #${id} door`;
  }
}
