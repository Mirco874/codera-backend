import { IsEmail, IsString } from "class-validator";

export class CreateUserDTO{
    @IsString()
    fullName:string;
    @IsEmail()
    email:string;
    @IsString()
    password:string;
}