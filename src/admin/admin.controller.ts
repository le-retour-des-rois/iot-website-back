import { Controller, Post, Body, Delete, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthorizeUserDTO } from './dto/authorize-user.dto';
import { IntegrateUserDTO } from './dto/integrate-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('assign')
  integrateUser(@Body() integrateUserDTO: IntegrateUserDTO) {
    return this.adminService.integrateUser(integrateUserDTO);
  }

  // TODO Verify if a user is allowed to
  @Get('auth')
  AuthorizeUser(@Body() authorizeUserDTO: AuthorizeUserDTO) {
    return this.adminService.authorizeUser(authorizeUserDTO);
  }


  // TODO DELETE USER ACCESS TO DOORS AND SECTIONS
}
