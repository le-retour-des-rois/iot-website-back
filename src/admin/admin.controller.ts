import { Controller, Post, Body, Delete, Get, Param } from '@nestjs/common';
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

  @Get('auth')
  AuthorizeUser(@Body() authorizeUserDTO: AuthorizeUserDTO) {
    return this.adminService.authorizeUser(authorizeUserDTO);
  }

  @Get('auth/:hash')
  GetAuthorizedUsers(@Param('hash') hash: string) {
    return this.adminService.getAuthorizedUsers(hash);
  }

  // TODO DELETE USER ACCESS TO DOORS AND SECTIONS
}
