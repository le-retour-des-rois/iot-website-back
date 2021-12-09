import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { IntegrateUserDTO } from './dto/user-centric.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth')
  integrateUser(@Body() integrateUserDTO: IntegrateUserDTO) {
    return this.adminService.integrateUser(integrateUserDTO);
  }

  // TODO DELETE USER ACCESS TO DOORS AND SECTIONS
}
