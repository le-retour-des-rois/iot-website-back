import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Door {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {nullable: false})
    name: string;

    @Column("varchar", {nullable: false})
    hash: string;

    @Column("integer", {nullable: false})
    org_id: number;

    @Column("integer", {nullable: false})
    section_id: number;
}

export class DoorTmp {
    name: string;
    hash: string;
    org_id: number;
    section_id: number;
}