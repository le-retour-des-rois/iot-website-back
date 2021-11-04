import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({message: 'Please enter a right username'})
    username: string;

    @IsNotEmpty({message: 'Please enter a right password'})
    password: string;

    @IsNotEmpty({message: 'Please enter a type, possible types are regular or admin'})
    type: string;
}
