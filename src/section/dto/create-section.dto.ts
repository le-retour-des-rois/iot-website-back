import { IsNotEmpty } from 'class-validator';

export class CreateSectionDto {

    @IsNotEmpty({message: 'Please enter a right name'})
    name: string;
}
