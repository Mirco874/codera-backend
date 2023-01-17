import { IsString } from "class-validator";
export class EditClassDTO{
    @IsString()
    className:string;
    @IsString()
    classDescription:string;
}