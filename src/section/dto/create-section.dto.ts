import { IsNotEmpty } from 'class-validator';

export class CreateSectionDto {

    @IsNotEmpty({message: 'Please enter a right section name'})
    name: string;

    @IsNotEmpty({message: 'Please enter a right organization name'})
    organization_name: string;
}
