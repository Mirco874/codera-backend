import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../entities/Task.entity';

import { TaskDeliveryService } from 'src/TaskDelivery/service/TaskDelivery.service';
import { TaskLanguageService } from 'src/TaskLanguage/service/TaskLanguage.service';

import { CreateTaskDTO } from '../dto/CreateTask.dto';
import { EditTaskDTO } from '../dto/EditTask.dto';


@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @Inject(forwardRef(() => TaskLanguageService))
    private taskLanguageService: TaskLanguageService,
    @Inject(forwardRef(() => TaskDeliveryService))
    private taskDeliveryService: TaskDeliveryService,
  ) {}

  findById(id: number): Promise<Task> {
    const entity= this.taskRepository.createQueryBuilder('Task')
    .leftJoinAndSelect('Task.taskLanguage','TaskLanguage')
    .leftJoinAndSelect('TaskLanguage.programmingLanguage','ProgrammingLanguage')
    .where('Task.id=:id', { id })
    .getOne();
    return entity;
  }

  findAllByClassId(id: string): Promise<Task[]> {

    const entityList= this.taskRepository.createQueryBuilder('Task')
    .innerJoinAndSelect('Task.taskLanguage','TaskLanguage')
    .innerJoinAndSelect('TaskLanguage.programmingLanguage','ProgrammingLanguage')
    .where('Task.classId=:id', { id })
    .orderBy('Task.limitDate', 'ASC')
    .getMany();
    return entityList;

  }

  async findToDoTask(userId: number, classId: string): Promise<Task[]> {
    const qb = await this.taskRepository
      .createQueryBuilder('Task')
      .leftJoinAndSelect('Task.taskLanguage','TaskLanguage')
      .leftJoinAndSelect('TaskLanguage.programmingLanguage','ProgrammingLanguage')
      .leftJoin('Task.classGroup', 'ClassGroup')
      .orderBy('Task.limitDate', 'ASC')
      .andWhere('Task.classId=:classId', { classId });

    const qb2 = this.taskRepository
      .createQueryBuilder('Task')
      .leftJoin('Task.classGroup', 'ClassGroup')
      .leftJoin('Task.taskDeliveries', 'TaskDeliveries')
      .andWhere('TaskDeliveries.userId=:userId', { userId })
      .andWhere('Task.classId=:classId', { classId })
      .select('task.id');

    const subQuery = qb2.getQuery();

    qb.andWhere(`task.id NOT IN (${subQuery})`, { userId });

    return qb.getMany();
  }

  persist(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const entity = new Task();

    createTaskDTO.limitDate= new Date(createTaskDTO.limitDate);

    entity.classId = createTaskDTO.classId;
    entity.taskTitle = createTaskDTO.taskTitle;
    entity.taskDescription = createTaskDTO.taskDescription;
    entity.maxScore = createTaskDTO.maxScore;
    entity.templateCode = createTaskDTO.templateCode;
    entity.limitDate = createTaskDTO.limitDate;

    return this.taskRepository.save(entity);
  }

  update( id, editTaskDTO: EditTaskDTO ): void {

    editTaskDTO.limitDate= new Date( editTaskDTO.limitDate );

    this.taskRepository.createQueryBuilder('Task')
    .update('Task')
    .set({
          taskTitle: editTaskDTO.taskTitle,
          taskDescription: editTaskDTO.taskDescription, 
          maxScore: editTaskDTO.maxScore,
          templateCode: editTaskDTO.templateCode,
          limitDate: editTaskDTO.limitDate
        })
    .where("Task.id = :id", { id })
    .execute()

  }

  async remove(entity: Task): Promise<void> {
    const taskLanguageList =await this.taskLanguageService.findAllByTaskId(entity.id);
    const taskDeliveryList =await this.taskDeliveryService.findAllByTaskId(entity.id);
    this.taskLanguageService.removeMany(taskLanguageList);
    this.taskDeliveryService.removeMany(taskDeliveryList);
    this.taskRepository.remove(entity);
  }
}
