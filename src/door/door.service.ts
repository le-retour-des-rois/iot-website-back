import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { threadId } from 'worker_threads';
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
    return await this.doorRepository.save(createDoorDto);
  }

  async findAll() {
    return await this.doorRepository.find();
  }

  async findOne(id: number) {
    const door = await this.doorRepository.findOne(id);
    if (door) {
      return door;
    }
    throw new HttpException('Door not found', HttpStatus.NOT_FOUND);
  }

  async update(id: number, updateDoorDto: UpdateDoorDto) {
    const projet = await this.findOne(id);
    if (projet)
      return this.doorRepository.update(projet, updateDoorDto);
  }

  async remove(id: number) {
    const projet = await this.findOne(id);
    if (projet)
      return this.doorRepository.remove(projet)
    throw new HttpException('Door does not exist', HttpStatus.NOT_FOUND); 
  }
}
