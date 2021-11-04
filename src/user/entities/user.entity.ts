import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {nullable: true})
    username: string;

    @Column("varchar", {nullable: true})
    password: string;

    @Column("varchar", {nullable: true})
    type: string;
}
