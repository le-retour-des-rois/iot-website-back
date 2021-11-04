import { Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { DoorController } from './door.controller';
import { Door } from './entities/door.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Door])],
  controllers: [DoorController],
  providers: [DoorService]
})
export class DoorModule {}
