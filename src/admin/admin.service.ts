import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Door } from 'src/door/entities/door.entity';
import { Repository } from 'typeorm';
import { IntegrateUserDTO } from './dto/user-centric.dto';
import { Auth, AuthTmp } from './entities/auth.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,

    @InjectRepository(Door)
    private doorRepository: Repository<Door>
  ) {}


  async integrateUser(integrateUserDTO: IntegrateUserDTO) {
    const user_id = integrateUserDTO.user_id;


    // --- Take Sections into Account --- //
    for (let i = 0; i < integrateUserDTO.section_ids.length; i++) {
      const section_id = integrateUserDTO.section_ids[i];

      // --- Get All Doors In Sect --- //
      const doors = await this.doorRepository.find({section_id: section_id});

      for (let j = 0; j < doors.length; j++) {
        const door_id = doors[j].id;
        
        // Auth doesn't exist yet
        if (! await this.authRepository.findOne({user_id: user_id, door_id})) {
          const authTmp: AuthTmp = {
            user_id: user_id,
            door_id: door_id
          }
          
          
          const auth = await this.authRepository.save(authTmp);
          if (!auth) {
            throw new HttpException('Failed to create the door', HttpStatus.BAD_REQUEST);
          }
        }
      }
    }
    // --- Take Specific Doors into Account --- //
    for (let i = 0; i < integrateUserDTO.door_ids.length; i++) {
      const door_id = integrateUserDTO.door_ids[i];

      // Auth doesn't exist yet
      if (! await this.authRepository.findOne({user_id: user_id, door_id})) {
        const authTmp: AuthTmp = {
          user_id: user_id,
          door_id: door_id
        }
          
          
        const auth = await this.authRepository.save(authTmp);
        if (!auth) {
          throw new HttpException('Failed to create the door', HttpStatus.BAD_REQUEST);
        }
      }
    }

    return 'User integrated';
  }
}
