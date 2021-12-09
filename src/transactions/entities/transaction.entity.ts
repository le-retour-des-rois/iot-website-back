import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transactions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("timestamp", {nullable: false})
    date: string;

    @Column("varchar", {nullable: false})
    method: string;

    @Column("integer", {nullable: true})
    door_id: number;

    @Column("integer", {nullable: true})
    org_id: number;

    @Column("integer", {nullable: true})
    section_id: number;

    @Column("integer", {nullable: true})
    user_id: number;
}

export class TransactionsClass {
    method: string;
    door_id: number;
    org_id: number;
    section_id: number;
    user_id: number;
}