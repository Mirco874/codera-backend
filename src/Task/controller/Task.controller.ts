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
import { UserService } from 'src/User/service/User.service';
import { CreateTaskDTO } from '../dto/CreateTask.dto';
import { EditClassDTO } from '../dto/EditTask.dto';
import { TaskService } from '../service/Task.service';
import { TaskBasicInformationVO } from '../vo/taskBasicInformation.vo';
import { TaskDetailInformationVO } from '../vo/taskDetailInformation.vo';

@Controller('api/v1/tasks/')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private taskService: TaskService,
    private classGroupService: ClassGroupService,
    private userService: UserService,
  ) {}

  @Get('/todo')
  async findToDo(
    @Query('userId') userId: number,
    @Query('classId') classId: string,
  ): Promise<TaskBasicInformationVO[]> {
    const findUser = await this.userService.findById(userId);
    const findClassGroup = await this.classGroupService.findById(classId);

    if (!findUser) {
      throw new NotFoundException(`There is not a user with the id: ${userId}`);
    }

    if (!findClassGroup) {
      throw new NotFoundException(
        `There is not a class with the id: ${classId}`,
      );
    }

    const entityList = await this.taskService.findToDoTask(userId, classId);
    const voList: TaskBasicInformationVO[] = [];

    entityList.map((entity) => {
      const vo = new TaskBasicInformationVO();
      vo.id = entity.id;
      vo.classId = entity.classId;
      vo.taskTitle = entity.taskTitle;
      vo.taskDescription = entity.taskDescription;
      vo.maxScore = entity.maxScore;
      vo.limitDate = entity.limitDate;
      vo.limitTime = entity.limitTime;
      voList.push(vo);
    });

    return voList;
  }

  // class/123-456-789/tasks
  @Get(':id')
  async findById(@Param('id') id: number): Promise<TaskDetailInformationVO> {
    const findEntity = await this.taskService.findById(id);
    if (!findEntity) {
      throw new NotFoundException(`There is not a task with id: ${id}`);
    }

    const taskVO = new TaskDetailInformationVO();

    let languagesVOList: ProgrammingLanguageVO[] = [];

    console.log(findEntity.taskLanguage);

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
    taskVO.limitTime = findEntity.limitTime;
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
      vo.limitTime = entity.limitTime;
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
    taskVO.limitTime = savedEntity.limitTime;
    taskVO.limitDate = savedEntity.limitDate;
    return taskVO;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) ediClassDTO: EditClassDTO,
  ): Promise<TaskDetailInformationVO> {
    const findEntity = await this.taskService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(`There is not a task with id: ${id}`);
    }

    ediClassDTO.limitDate= new Date(ediClassDTO.limitDate);

    findEntity.taskTitle = ediClassDTO.taskTitle;
    findEntity.taskDescription = ediClassDTO.taskDescription;
    findEntity.maxScore = ediClassDTO.maxScore;
    findEntity.templateCode = ediClassDTO.templateCode;
    findEntity.limitTime = ediClassDTO.limitTime;
    findEntity.limitDate = ediClassDTO.limitDate;

    const updatedEntity = await this.taskService.update(findEntity);

    const taskDetailInformationVO = new TaskDetailInformationVO();
    taskDetailInformationVO.id = updatedEntity.id;
    taskDetailInformationVO.classId = updatedEntity.classId;
    taskDetailInformationVO.taskTitle = updatedEntity.taskTitle;
    taskDetailInformationVO.taskDescription = updatedEntity.taskDescription;
    taskDetailInformationVO.maxScore = updatedEntity.maxScore;
    taskDetailInformationVO.templateCode = updatedEntity.templateCode;
    taskDetailInformationVO.limitTime = updatedEntity.limitTime;
    taskDetailInformationVO.limitDate = updatedEntity.limitDate;

    return taskDetailInformationVO;
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