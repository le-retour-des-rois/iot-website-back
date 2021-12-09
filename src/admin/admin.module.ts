import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Door } from 'src/door/entities/door.entity';
import { User } from 'src/user/entities/user.entity';
import { Auth } from './entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Door, User, Auth])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
