import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskLanguage } from '../entities/TaskLanguage.entity';

@Injectable()
export class TaskLanguageService {
  constructor(
    @InjectRepository(TaskLanguage)
    private taskLanguageRepository: Repository<TaskLanguage>) {}

  find(taskId: number, languageId: number): Promise<TaskLanguage> {
    return this.taskLanguageRepository.findOneBy({ taskId, languageId });
  }

  findAllByTaskId(taskId: number): Promise<TaskLanguage[]> {
    return this.taskLanguageRepository.findBy({ taskId });
  }

  persist(taskId: number, languageId: number): void {
    const entity = new TaskLanguage();
    entity.taskId = taskId;
    entity.languageId = languageId;

    this.taskLanguageRepository.save(entity);
  }

  removeByTaskId(taskId: number) :void {
    this.taskLanguageRepository.createQueryBuilder('TaskLanguage')
    .delete()
    .from('TaskLanguage')
    .where("taskId=:taskId", {taskId})
    .execute();
  }

  removeMany(taskLanguage: TaskLanguage[] ): void {
    this.taskLanguageRepository.remove(taskLanguage);
  }

  removeOne(taskLanguage: TaskLanguage ): void {
    this.taskLanguageRepository.remove(taskLanguage);
  }
}
