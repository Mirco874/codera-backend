import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskModule } from 'src/Task/Task.module';
import { ProgramminLanguageModule } from 'src/ProgrammingLanguage/ProgrammingLanguage.module';

import { TaskLanguageController } from './controller/TaskLanguage.controller';

import { TaskLanguage } from './entities/TaskLanguage.entity';

import { TaskLanguageService } from './service/TaskLanguage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskLanguage]),
    forwardRef(() => TaskModule),
    ProgramminLanguageModule,
  ],
  providers: [TaskLanguageService],
  controllers: [TaskLanguageController],
  exports: [TaskLanguageService],
})
export class TaskLanguageModule {}
