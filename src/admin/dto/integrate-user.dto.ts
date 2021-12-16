import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class IntegrateUserDTO {

    @IsNumber()
    @IsNotEmpty({message: 'Please enter a right username'})
    user_id: number;

    @IsArray()
    @ValidateNested({ each: true })
    section_ids: [number];

    @IsArray()
    @ValidateNested({ each: true })
    door_names: [string];
}