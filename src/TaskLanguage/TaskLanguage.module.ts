import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramminLanguageModule } from 'src/ProgrammingLanguage/ProgrammingLanguage.module';
import { TaskModule } from 'src/Task/Task.module';
import { TaskLanguageController } from './controller/TaskLanguage.controller';
import { TaskLanguage } from './entities/TaskLanguage.entity';
import { TaskLanguageService } from './service/TaskLanguage.service';

@Module({
    imports:[TypeOrmModule.forFeature([TaskLanguage]),TaskModule,ProgramminLanguageModule],
    providers:[TaskLanguageService],
    controllers:[TaskLanguageController],
    exports:[TaskLanguageService]
})

export class TaskLanguageModule{}