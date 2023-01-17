import { BadRequestException, Body, Controller, Post,UseGuards,ValidationPipe } from "@nestjs/common";
import { CompiledLanguageDTO } from "../dto/compiledLanguage.dto";
import { InterpretedLanguageDTO } from "../dto/InterpretedLanguage.dto";
import { CodeEditorService } from "../service/CodeEditor.service";
import { DTOValidatorService } from "../service/DTOValidatorService.service";
import { RunResultsVO } from "../vo/RunResults.vo";
import {JwtAuthGuard} from "../../auth/guard/jwt-auth.guard"

@Controller("api/v1/")
@UseGuards(JwtAuthGuard)  
export class CodeEditorController{
    constructor(private codeEditorService:CodeEditorService,
                private DTOValidatorService:DTOValidatorService){}
    
              
    @Post("run/java")
    async compileJavaCode(@Body(ValidationPipe) compiledLanguageDTO:CompiledLanguageDTO):Promise<RunResultsVO>{
       
        if(!this.DTOValidatorService.sameClassNameInCode(compiledLanguageDTO)){
            throw new BadRequestException("the className inside code must be the same in the 'className' field")
        }

        const vo= new RunResultsVO();
        vo.output=await this.codeEditorService.compileJava(compiledLanguageDTO);
        return vo;
    }

    @Post("run/javaScript")
    async interpretJavaScript(@Body(ValidationPipe) interpretedLanguageDTO:InterpretedLanguageDTO ):Promise<RunResultsVO>{
      const vo= new RunResultsVO();
      vo.output=await this.codeEditorService.InterpretJavaScript(interpretedLanguageDTO);
      return vo;
    }

    @Post("run/python")
    async interpretPython(@Body(ValidationPipe) interpretedLanguageDTO:InterpretedLanguageDTO):Promise<RunResultsVO>{
      const vo= new RunResultsVO();
      vo.output=await this.codeEditorService.InterpretPython(interpretedLanguageDTO);
      return vo;
    }

}