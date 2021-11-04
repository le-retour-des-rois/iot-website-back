import { IsNotEmpty } from 'class-validator';

export class CreateDoorDto {

    @IsNotEmpty({message: 'Please enter a right name'})
    name: string;

    @IsNotEmpty({message: 'Please enter a right hash'})
    hash: string;
}