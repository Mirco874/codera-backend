import { IsString } from "class-validator";

export class CompiledLanguageDTO{
    @IsString()
    className:string;
    @IsString()
    code:string;
}