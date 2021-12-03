import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Get(':org_name')
  findAllInOrg(@Param('org_name') organization_name: string) {
    return this.sectionService.findAllInOrg(organization_name);
  }

  @Get(':org_name/:section_name')
  findOne(@Param('org_name') organization_name: string, @Param('section_name') section_name: string) {
    return this.sectionService.findOne(organization_name, section_name);
  }

  @Patch(':org_name/:section_name')
  update(@Param('org_name') org_name: string, @Param('section_name') section_name: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.update(org_name, section_name, updateSectionDto);
  }

  @Delete(':org_name/:section_name')
  remove(@Param('org_name') org_name: string, @Param('section_name') section_name: string) {
    return this.sectionService.remove(org_name, section_name);
  }
}
