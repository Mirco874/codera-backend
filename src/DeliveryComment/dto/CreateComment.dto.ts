import { IsNumber, IsString } from "class-validator";

export class CreateCommentDTO{
    @IsNumber()
    deliveryId:number;
    @IsNumber()
    userId:number;
    @IsString()
    content:string;
}