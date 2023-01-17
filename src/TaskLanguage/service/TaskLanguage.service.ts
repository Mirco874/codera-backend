import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskLanguageDTO } from '../dto/TaskLanguage.dto';
import { TaskLanguage } from '../entities/TaskLanguage.entity';

@Injectable()
export class TaskLanguageService {
  constructor(
    @InjectRepository(TaskLanguage)
    private taskLanguageRepository: Repository<TaskLanguage>,
  ) {}
  //preguntar
  find(taskId: number, languageId: number): Promise<TaskLanguage> {
    return this.taskLanguageRepository.findOneBy({ taskId, languageId });
  }

  persist(taskId: number, languageId: number): void {
    const entity = new TaskLanguage();
    entity.taskId = taskId;
    entity.languageId = languageId;

    this.taskLanguageRepository.save(entity);
  }

  //no se puede editar
  //preguntar, no se puede por params
  remove(taskLanguage: TaskLanguage): void {
    this.taskLanguageRepository.remove(taskLanguage);
  }
}
