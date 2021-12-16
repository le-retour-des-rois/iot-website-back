import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Door } from 'src/door/entities/door.entity';
import { TransactionsClass } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthorizeUserDTO } from './dto/authorize-user.dto';
import { IntegrateUserDTO } from './dto/integrate-user.dto';
import { Auth, AuthTmp } from './entities/auth.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,

    @InjectRepository(Door)
    private doorRepository: Repository<Door>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private transactionsService: TransactionsService
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
            throw new HttpException('Failed to create the authentication', HttpStatus.BAD_REQUEST);
          }
        }
      }

      // --- Fill the transaction table --- //
      const trans: TransactionsClass = {
        method: 'assignToSection',
        org_id: null,
        section_id: section_id,
        user_id: user_id,
        door_id: null
      }

      await this.transactionsService.create(trans);
    }
    // --- Take Specific Doors into Account --- //
    for (let i = 0; i < integrateUserDTO.door_names.length; i++) {
      const door_name = integrateUserDTO.door_names[i];
      const door = await this.doorRepository.findOne({name: door_name})



      // Auth doesn't exist yet
      if (! await this.authRepository.findOne({user_id: user_id, door_id: door.id})) {
        const authTmp: AuthTmp = {
          user_id: user_id,
          door_id: door.id
        }
          
          
        const auth = await this.authRepository.save(authTmp);
        if (!auth) {
          throw new HttpException('Failed to create the door', HttpStatus.BAD_REQUEST);
        }
      }

      // --- Fill the transaction table --- //
      const trans: TransactionsClass = {
        method: 'assignToSpecificDoor',
        org_id: null,
        section_id: null,
        user_id: user_id,
        door_id: door.id
      }

      await this.transactionsService.create(trans);
    }

    return 'User integrated';
  }

  async authorizeUser(authorizeUserDTO: AuthorizeUserDTO) {

    
    // Verify user's mac addr
    const user = await this.userRepository.findOne({ mac_addr: authorizeUserDTO.mac_addr })
    if (! user) {
      throw new HttpException('User not found - Wrong Mac Address', HttpStatus.NOT_FOUND);
    }

    // Verfy door's hash
    const door = await this.doorRepository.findOne({ hash: authorizeUserDTO.hash })
    if (!door) {
      throw new HttpException('Door not found - Wrong Hash', HttpStatus.NOT_FOUND);
    }

    const auth = await this.authRepository.findOne(
      {
        user_id: user.id,
        door_id: door.id
      }
    )

    if (!auth) {
      throw new HttpException('You don\'t have permission to open this dor', HttpStatus.FORBIDDEN);
    }

    return { "authorized" : true }
  }

  async getAuthorizedUsers(hash: string) {
    // Verfy door's hash
    const door = await this.doorRepository.findOne({ hash: hash })
    if (!door) {
      throw new HttpException('Door not found - Wrong Hash', HttpStatus.NOT_FOUND);
    }

    return await this.authRepository.find({door_id: door.id});
  }

  async getAuthorizedDoors(id: number) {
    // Verfy door's hash
    const user = await this.userRepository.findOne({ id })
    if (!user) {
      throw new HttpException('User not found - Wrong ID', HttpStatus.NOT_FOUND);
    }

    const auths = await this.authRepository.find({user_id: id});
    let res = [];

    for (let i = 0; i < auths.length; i++) {
      const door = await this.doorRepository.findOne({id: auths[i].door_id})
      res = res.concat(door.name);
    }

    return res;
  }
}