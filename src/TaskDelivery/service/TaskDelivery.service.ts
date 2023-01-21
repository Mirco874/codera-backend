import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTaskDeliveryDTO } from '../dto/createTaskDelivery.dto';
import { TaskDelivery } from '../entities/TaskDelivery.entity';

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

    console.log(entityList);
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
    const currentDate = new Date();
    const currentDay = `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth() + 1}-${currentDate.getUTCDate()}`;

    const currentTime = currentDate.toISOString().substring(11, 19);

    entity.deliveryDate = currentDay;
    entity.deliveryTime = currentTime;

    this.taskDeliveryRepository.save(entity);
  }

  update(taskDelivery: TaskDelivery): Promise<TaskDelivery> {
    return this.taskDeliveryRepository.save(taskDelivery);
  }

  remove(taskDelivery: TaskDelivery): void {
    this.taskDeliveryRepository.remove(taskDelivery);
  }
}
