import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("integer", {nullable: false})
    user_id: number;

    @Column("integer", {nullable: false})
    door_id: number;
}

export class AuthTmp {
    user_id: number;
    door_id: number;
}