import { IsNotEmpty } from 'class-validator';

export class CreateDoorDto {

    @IsNotEmpty({message: 'Please enter a right name'})
    name: string;

    @IsNotEmpty({message: 'Please enter a right hash'})
    hash: string;

    @IsNotEmpty({message: 'Please enter a right organization'})
    organization_name: string;

    @IsNotEmpty({message: 'Please enter a right section'})
    section_name: string;
}