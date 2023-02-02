import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgrammingLanguageController } from './controller/ProgrammingLanguage.controller';
import { ProgrammingLanguage } from './entities/ProgrammingLanguage.entity';
import { ProgrammingLanguageService } from './service/ProgrammingLanguage.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProgrammingLanguage])],
  providers: [ProgrammingLanguageService],
  controllers: [ProgrammingLanguageController],
  exports: [ProgrammingLanguageService],
})
export class ProgramminLanguageModule {}
