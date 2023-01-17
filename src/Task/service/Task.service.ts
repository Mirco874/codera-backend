import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from '../dto/CreateTask.dto';
import { Task } from '../entities/Task.entity';
import { TaskBasicInformationVO } from '../vo/taskBasicInformation.vo';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  findById(id: number): Promise<Task> {
    const entity= this.taskRepository.createQueryBuilder('Task')
    .innerJoinAndSelect('Task.taskLanguage','TaskLanguage')
    .innerJoinAndSelect('TaskLanguage.programmingLanguage','ProgrammingLanguage')
    .where('Task.id=:id', { id })
    .getOne();
    return entity;
  }

  findAllByClassId(id: string): Promise<Task[]> {

    const entityList= this.taskRepository.createQueryBuilder('Task')
    .innerJoinAndSelect('Task.taskLanguage','TaskLanguage')
    .innerJoinAndSelect('TaskLanguage.programmingLanguage','ProgrammingLanguage')
    .where('Task.classId=:id', { id })
    .getMany();
    return entityList;

  }



  async findToDoTask(userId: number, classId: string): Promise<Task[]> {
    const qb = await this.taskRepository
      .createQueryBuilder('Task')
      .leftJoin('Task.classGroup', 'ClassGroup')
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

    entity.classId = createTaskDTO.classId;
    entity.taskTitle = createTaskDTO.taskTitle;
    entity.taskDescription = createTaskDTO.taskDescription;
    entity.maxScore = createTaskDTO.maxScore;
    entity.templateCode = createTaskDTO.templateCode;
    entity.limitTime = createTaskDTO.limitTime;
    entity.limitDate = createTaskDTO.limitDate;
    console.log(entity);
    return this.taskRepository.save(entity);
  }

  update(entity: Task): Promise<Task> {
    return this.taskRepository.save(entity);
  }

  remove(entity: Task): void {
    this.taskRepository.remove(entity);
  }
}
