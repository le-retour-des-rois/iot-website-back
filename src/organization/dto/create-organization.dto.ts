import { IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {

    @IsNotEmpty({message: 'Please enter a right name'})
    name: string;
}