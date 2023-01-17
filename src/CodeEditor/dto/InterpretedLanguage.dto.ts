import { IsString } from "class-validator";

export class InterpretedLanguageDTO{
    @IsString()
    code:string;
}