import { Injectable } from '@nestjs/common';
import { CreateDoorDto } from './dto/create-door.dto';
import { UpdateDoorDto } from './dto/update-door.dto';

@Injectable()
export class DoorService {
  create(createDoorDto: CreateDoorDto) {
    return 'This action adds a new door';
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
