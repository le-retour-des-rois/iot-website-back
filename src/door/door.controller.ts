import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoorService } from './door.service';
import { CreateDoorDto } from './dto/create-door.dto';
import { UpdateDoorDto } from './dto/update-door.dto';

@Controller('door')
export class DoorController {
  constructor(private readonly doorService: DoorService) {}

  @Post()
  create(@Body() createDoorDto: CreateDoorDto) {
    return this.doorService.create(createDoorDto);
  }

  @Get()
  findAll() {
    return this.doorService.findAll();
  }

  @Get(':org_name')
  findAllInOrg(@Param('org_name') org_name: string) {
    return this.doorService.findAllInOrg(org_name);
  }

  @Get(':org_name/:section_name')
  findAllInSect(@Param('org_name') org_name: string, @Param('section_name') section_name: string) {
    return this.doorService.findAllInSect(org_name, section_name);
  }

  @Get(':org_name/:section_name/:door_name')
  findOne(@Param('org_name') org_name: string, @Param('section_name') section_name: string, @Param('door_name') door_name: string) {
    return this.doorService.findOne(org_name, section_name, door_name);
  }

  @Patch(':org_name/:section_name/:door_name')
  update(@Param('org_name') org_name: string, @Param('section_name') section_name: string, @Param('door_name') door_name: string, @Body() updateDoorDto: UpdateDoorDto) {
    return this.doorService.update(org_name, section_name, door_name, updateDoorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doorService.remove(+id);
  }
}
