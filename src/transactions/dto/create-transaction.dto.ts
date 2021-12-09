import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
    @IsNotEmpty({message: 'Please enter a right name'})
    method: string;
    door_id: number;
    org_id: number;
    section_id: number;
    user_id: number;
}
