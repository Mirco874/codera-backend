import { IsString } from "class-validator";

export class changePhotoDTO{
    @IsString()
    photo:string;
}