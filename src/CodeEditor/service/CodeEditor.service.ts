import { Injectable } from '@nestjs/common';
import { FileService } from './Files.service';
import { ShellService } from './Shell.service';
import { v4 } from 'uuid';
import { CompiledLanguageDTO } from '../dto/compiledLanguage.dto';
import { InterpretedLanguageDTO } from '../dto/InterpretedLanguage.dto';

@Injectable()
export class CodeEditorService {
  constructor(
    private fileService: FileService,
    private shellService: ShellService
  ) {}

  async compileJava(compiledLanguageDTO:CompiledLanguageDTO): Promise<string> {
    const {className,code}=compiledLanguageDTO;
    const extention = 'java';
    const resultsFolder = `./compilerResults/java/${v4()}`;
    const javaFileDirectory = `${resultsFolder}/${className}.${extention}`;
    const command = `javac ${javaFileDirectory} && java -cp ${resultsFolder} ${className}`;

    await this.fileService.CreateFile(javaFileDirectory, code, resultsFolder)
    // this.fileService
    //   .CreateFile(javaFileDirectory, code, resultsFolder)
    //   .then((res) => {
    //     this.shellService.excecuteCommand(command).then((res)=>{
    //         result=res;
    //     });
    //   });
    return this.shellService.excecuteCommand(command);
  }

  async InterpretJavaScript(interpretedLanguageDTO:InterpretedLanguageDTO): Promise<string> {
    const {code}=interpretedLanguageDTO;
    const extention = 'js';
    const uuidCode=v4();
    const resultsFolder = `./compilerResults/javaScript/${uuidCode}`;
    const javaScriptFileDirectory = `${resultsFolder}/${uuidCode}.${extention}`;
    const command = `node ${javaScriptFileDirectory}`;

    await this.fileService.CreateFile(javaScriptFileDirectory, code, resultsFolder)
    return this.shellService.excecuteCommand(command);
  }

  async InterpretPython(interpretedLanguageDTO:InterpretedLanguageDTO): Promise<string> {
    const {code}=interpretedLanguageDTO;
    const extention = 'py';
    const uuidCode=v4();
    const resultsFolder = `./compilerResults/python/${uuidCode}`;
    const pythonFileDirectory = `${resultsFolder}/${uuidCode}.${extention}`;
    const command = `python ${pythonFileDirectory}`;

    await this.fileService.CreateFile(pythonFileDirectory, code, resultsFolder)
    return this.shellService.excecuteCommand(command);
  }
}
