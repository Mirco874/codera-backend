import { IsNumber, IsString } from "class-validator";

export class CreateClassDTO{
    @IsNumber()
    teacherId:number;
    @IsString()
    className:string;
    @IsString()
    classDescription:string;
}

