import { IsNumber } from "class-validator";

export class TaskLanguageDTO{
    @IsNumber()
    taskId:number;
    
    @IsNumber()
    languageId:number;
}