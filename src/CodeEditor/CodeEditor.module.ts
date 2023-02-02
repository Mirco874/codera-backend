import { Module } from '@nestjs/common';

import { CodeEditorController } from './controller/CodeEditor.controller';

import { FileService } from './service/Files.service';
import { ShellService } from './service/Shell.service';
import { CodeEditorService } from './service/CodeEditor.service';
import { DTOValidatorService } from './service/DTOValidatorService.service';

@Module({
  imports: [],
  providers: [
    CodeEditorService,
    FileService,
    ShellService,
    DTOValidatorService,
  ],
  controllers: [CodeEditorController],
  exports: [],
})
export class CodeEditorModule {}
