import { Injectable } from '@nestjs/common';
import { CompiledLanguageDTO } from '../dto/compiledLanguage.dto';

@Injectable()
export class DTOValidatorService {
  constructor() {}

  sameClassNameInCode(compiledLanguageDTO: CompiledLanguageDTO): boolean {
    const { className, code } = compiledLanguageDTO;
    return code.indexOf(className) !== -1;
  }
}
