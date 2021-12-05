import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {nullable: false})
    username: string;

    @Column("varchar", {nullable: false})
    password: string;

    @Column("varchar", {nullable: false})
    type: string;

    @Column("integer", {nullable: false})
    org_id: number;
}

export class UserTmp {
    username: string;
    password: string;
    type: string;
    org_id: number;
}