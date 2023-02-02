import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskDelivery } from '../entities/TaskDelivery.entity';
import { createTaskDeliveryDTO } from '../dto/createTaskDelivery.dto';

@Injectable()
export class TaskDeliveryService {
  constructor(
    @InjectRepository(TaskDelivery)
    private taskDeliveryRepository: Repository<TaskDelivery>,
  ) {}

  findAllByTaskId(taskId: number): Promise<TaskDelivery[]> {
    const entityList = this.taskDeliveryRepository
      .createQueryBuilder('TaskDelivery')
      .innerJoinAndSelect('TaskDelivery.task', 'Task')
      .innerJoinAndSelect('TaskDelivery.user', 'User')
      .innerJoinAndSelect(
        'TaskDelivery.programmingLanguage',
        'ProgrammingLanguage',
      )
      .where('TaskDelivery.taskId=:taskId', { taskId })
      .getMany();

    return entityList;
  }

  findAllByUserIdAndClassId(
    userId: number,
    classId: string,
  ): Promise<TaskDelivery[]> {
    const entityList = this.taskDeliveryRepository
      .createQueryBuilder('TaskDelivery')
      .innerJoinAndSelect('TaskDelivery.task', 'Task')
      .innerJoinAndSelect('TaskDelivery.user', 'User')
      .innerJoinAndSelect(
        'TaskDelivery.programmingLanguage',
        'ProgrammingLanguage',
      )
      .where('TaskDelivery.userId=:userId', { userId })
      .andWhere('Task.classId=:classId', { classId })
      .getMany();
    return entityList;
  }

  findById(id: number): Promise<TaskDelivery> {
    return this.taskDeliveryRepository
      .createQueryBuilder('TaskDelivery')
      .innerJoinAndSelect('TaskDelivery.task', 'Task')
      .innerJoinAndSelect('TaskDelivery.user', 'User')
      .innerJoinAndSelect(
        'TaskDelivery.programmingLanguage',
        'ProgrammingLanguage',
      )
      .where('TaskDelivery.id=:id', { id })
      .getOne();
  }

  persist( userId: number, createTaskDeliveryDTO: createTaskDeliveryDTO ): void {
    const entity = new TaskDelivery();
    entity.userId = userId;
    entity.taskId = createTaskDeliveryDTO.taskId;
    entity.languageId = createTaskDeliveryDTO.languageId;
    entity.code = createTaskDeliveryDTO.code;

    entity.score = null;
    entity.deliveryDate = new Date();

    this.taskDeliveryRepository.save(entity);
  }

  update(taskDelivery: TaskDelivery): Promise<TaskDelivery> {
    return this.taskDeliveryRepository.save(taskDelivery);
  }

  removeOne(taskDelivery: TaskDelivery): void {
    this.taskDeliveryRepository.remove(taskDelivery);
  }
  removeMany(taskDelivery: TaskDelivery[]): void {
    this.taskDeliveryRepository.remove(taskDelivery);
  }

}
