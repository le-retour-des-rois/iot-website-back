import {IsNotEmpty, IsNumber } from 'class-validator';

export class AuthorizeUserDTO {

    @IsNumber()
    @IsNotEmpty({message: 'Please enter a right user mac address'})
    mac_addr: string;

    @IsNumber()
    @IsNotEmpty({message: 'Please enter a right door hash'})
    hash: string;
}