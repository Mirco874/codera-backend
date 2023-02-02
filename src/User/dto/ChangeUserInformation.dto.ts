import { IsString } from "class-validator";

export class ChangeUserInformationDTO{
    @IsString()
    fullName:string;

    @IsString()
    photo:string
}