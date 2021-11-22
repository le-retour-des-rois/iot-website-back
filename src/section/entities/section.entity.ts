import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Section {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {nullable: false})
    name: string;

    @Column("integer", {nullable: false})
    org_id: number;
}

export class SectionTmp {
    name: string;
    org_id: number;
}