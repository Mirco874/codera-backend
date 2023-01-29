import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ClassGroupService } from 'src/ClassGroup/service/ClassGroup.service';
import { ProgrammingLanguageVO } from 'src/ProgrammingLanguage/vo/ProgrammingLanguage.vo';
import { User } from 'src/User/entities/User.entity';
import { GetUser } from 'src/User/service/GetUser';
import { CreateTaskDTO } from '../dto/CreateTask.dto';
import { EditTaskDTO } from '../dto/EditTask.dto';
import { TaskService } from '../service/Task.service';
import { TaskBasicInformationVO } from '../vo/taskBasicInformation.vo';
import { TaskDetailInformationVO } from '../vo/taskDetailInformation.vo';


@Controller('api/v1/tasks/')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private taskService: TaskService,
    private classGroupService: ClassGroupService
  ) {}

  @Get('/todo')
  async findTaskPendingTasks(
    @Query('classId') classId: string,
    @GetUser() user:User
  ): Promise<TaskBasicInformationVO[]> {
    const findClassGroup = await this.classGroupService.findById(classId);

    if (!findClassGroup) {
      throw new NotFoundException(
        `There is not a class with the id: ${classId}`,
      );
    }

    const entityList = await this.taskService.findToDoTask(user.id, classId);
    const voList: TaskBasicInformationVO[] = [];


    entityList.map((entity) => {
      const vo = new TaskBasicInformationVO();
      let languagesVOList: ProgrammingLanguageVO[] = [];

      entity.taskLanguage.map((languageEntity) => {
        const languageVO = new ProgrammingLanguageVO();
        languageVO.id = languageEntity.programmingLanguage.id;
        languageVO.name = languageEntity.programmingLanguage.name;
        languageVO.logo = languageEntity.programmingLanguage.logo;
        languagesVOList.push(languageVO);
      })

      vo.id = entity.id;
      vo.classId = entity.classId;
      vo.taskTitle = entity.taskTitle;
      vo.taskDescription = entity.taskDescription;
      vo.maxScore = entity.maxScore;
      vo.limitDate = entity.limitDate;
      vo.allowedLanguages=languagesVOList;
      voList.push(vo);
    });

    return voList;
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<TaskDetailInformationVO> {
    const findEntity = await this.taskService.findById(id);
    if (!findEntity) {
      throw new NotFoundException(`There is not a task with id: ${id}`);
    }

    const taskVO = new TaskDetailInformationVO();

    let languagesVOList: ProgrammingLanguageVO[] = [];

    findEntity.taskLanguage.map((languageEntity) => {
      const languageVO = new ProgrammingLanguageVO();
      languageVO.id = languageEntity.programmingLanguage.id;
      languageVO.name = languageEntity.programmingLanguage.name;
      languageVO.logo = languageEntity.programmingLanguage.logo;
      languagesVOList.push(languageVO);
    })

    taskVO.id = findEntity.id;
    taskVO.classId = findEntity.classId;
    taskVO.taskTitle = findEntity.taskTitle;
    taskVO.taskDescription = findEntity.taskDescription;
    taskVO.maxScore = findEntity.maxScore;
    taskVO.templateCode = findEntity.templateCode;
    taskVO.limitDate = findEntity.limitDate;
    taskVO.allowedLanguages=languagesVOList;
    return taskVO;
  }

  @Get()
  async findByClassGroupId(
    @Query('classGroupId') classGroupId: string,
  ): Promise<TaskBasicInformationVO[]> {
    const findClassGroup = await this.classGroupService.findById(classGroupId);

    if (!findClassGroup) {
      throw new NotFoundException(
        `There is not a class with the id: ${classGroupId}`,
      );
    }

    const voList: TaskBasicInformationVO[] = [];
    const entityList = await this.taskService.findAllByClassId(classGroupId);

    entityList.map((entity) => {
      const vo = new TaskBasicInformationVO();

      let languagesVOList: ProgrammingLanguageVO[] = [];
      entity.taskLanguage.map((languageEntity) => {
        const languageVO = new ProgrammingLanguageVO();
        languageVO.id = languageEntity.programmingLanguage.id;
        languageVO.name = languageEntity.programmingLanguage.name;
        languageVO.logo = languageEntity.programmingLanguage.logo;

        languagesVOList.push(languageVO);
      });

      vo.id = entity.id;
      vo.classId = entity.classId;
      vo.taskTitle = entity.taskTitle;
      vo.taskDescription = entity.taskDescription;
      vo.maxScore = entity.maxScore;
      vo.limitDate = entity.limitDate;
      vo.allowedLanguages = languagesVOList;

      voList.push(vo);
    });

    return voList;
  }

  @Post()
  async persist(
    @Body(ValidationPipe) createTaskDTO: CreateTaskDTO,
  ): Promise<TaskDetailInformationVO> {
    createTaskDTO.limitDate= new Date(createTaskDTO.limitDate);
    
    const findClass = await this.classGroupService.findById(
      createTaskDTO.classId,
    );

    if (!findClass) {
      throw new NotFoundException(
        `There is not found the class with id: ${createTaskDTO.classId}`,
      );
    }
    const savedEntity = await this.taskService.persist(createTaskDTO);
    const taskVO = new TaskDetailInformationVO();
    taskVO.id = savedEntity.id;
    taskVO.classId = savedEntity.classId;
    taskVO.taskTitle = savedEntity.taskTitle;
    taskVO.taskDescription = savedEntity.taskDescription;
    taskVO.maxScore = savedEntity.maxScore;
    taskVO.templateCode = savedEntity.templateCode;
    taskVO.limitDate = savedEntity.limitDate;
    return taskVO;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) editTaskDTO: EditTaskDTO,
  ): Promise<void> {
    const findEntity = await this.taskService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(`There is not a task with id: ${id}`);
    }

    await this.taskService.update( id, editTaskDTO );

  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const findEntity = await this.taskService.findById(id);
    if (!findEntity) {
      throw new NotFoundException(`There is not a task with id: ${id}`);
    }

    this.taskService.remove(findEntity);
  }
}
