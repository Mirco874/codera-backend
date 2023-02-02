import {
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post,
  Put, 
  Query
} from '@nestjs/common';

import {
  BadRequestException,
  NotFoundException
} from '@nestjs/common/exceptions';

import { 
  Inject, 
  UseGuards 
} from '@nestjs/common/decorators';

import { forwardRef } from '@nestjs/common/utils';
import { ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/User/service/GetUser';

import { User } from 'src/User/entities/User.entity';
import { TaskDelivery } from '../entities/TaskDelivery.entity';

import { UserService } from 'src/User/service/User.service';
import { TaskService } from 'src/Task/service/Task.service';
import { TaskDeliveryService } from '../service/TaskDelivery.service';
import { ClassGroupService } from 'src/ClassGroup/service/ClassGroup.service';

import { createTaskDeliveryDTO } from '../dto/createTaskDelivery.dto';
import { UpdateScoreDTO } from '../dto/UpdateScore.dto';
import { UpdateTaskDeliveryDTO } from '../dto/UpdateTaskDelivery.dto';

import { UserVO } from 'src/User/vo/User.vo';
import { ProgrammingLanguageVO } from 'src/ProgrammingLanguage/vo/ProgrammingLanguage.vo';
import { TaskBasicInformationVO } from 'src/Task/vo/taskBasicInformation.vo';
import { TaskDetailInformationVO } from 'src/Task/vo/taskDetailInformation.vo';
import { TaskDeliveryBasicInformationVO } from '../vo/TaskDeliveryBasicInformation.vo';
import { TaskDeliveryDetailInformationVO } from '../vo/TaskDeliveryDetailInformationVO.vo';

@Controller('api/v1/task-deliveries')
@UseGuards(JwtAuthGuard)
export class TaskDeliveryController {
  constructor(
    private taskDeliveryService: TaskDeliveryService,
    private userService: UserService,
    @Inject(forwardRef(() => TaskService))
    private taskService: TaskService,
    private classGroupService: ClassGroupService,
  ) {}

  @Get()
  async findAll(
    @GetUser() user: User,
    @Query('taskId') taskId: number,
    @Query('classId') classId: string,
  ): Promise<TaskDeliveryBasicInformationVO[]> {

    let taskDeliveriesVO: TaskDeliveryBasicInformationVO[] = [];
    let entityList: TaskDelivery[] = [];

    if (typeof taskId !== 'undefined') {
      const findTask = await this.taskService.findById(taskId);
      if (!findTask) {
        throw new NotFoundException(
          `There is not a task with the id: ${taskId}`,
        );
      }
      entityList = await this.taskDeliveryService.findAllByTaskId(taskId);
    } else {
      if (typeof classId !== 'undefined') {
        const findClass = await this.classGroupService.findById(classId);

        if (!findClass) {
          throw new NotFoundException(
            `There is not a class with the id: ${classId}`,
          );
        }
        entityList = await this.taskDeliveryService.findAllByUserIdAndClassId( user.id, classId );
      }
    }

    entityList.map((entity) => {
      const taskDeliveryVO = new TaskDeliveryBasicInformationVO();
      taskDeliveryVO.id = entity.id;

      const userVO = new UserVO();
      userVO.id = entity.user.id;
      userVO.fullName = entity.user.fullName;
      userVO.email = entity.user.email;
      userVO.photo = entity.user.photo;

      const taskVO = new TaskBasicInformationVO();
      taskVO.id = entity.task.id;
      taskVO.classId = entity.task.classId;
      taskVO.taskTitle = entity.task.taskTitle;
      taskVO.taskDescription = entity.task.taskDescription;
      taskVO.maxScore = entity.task.maxScore;
      taskVO.limitDate = entity.task.limitDate;

      taskDeliveryVO.user = userVO;
      taskDeliveryVO.task = taskVO;
      taskDeliveryVO.score = entity.score;
      taskDeliveryVO.deliveryDate = entity.deliveryDate;


      taskDeliveriesVO.push(taskDeliveryVO);
    });
    return taskDeliveriesVO;
  }

  @Get(':id')
  async findById( @Param('id') id: number ): Promise<TaskDeliveryDetailInformationVO> {
    const findEntity = await this.taskDeliveryService.findById(id);
    if (!findEntity) {
      throw new NotFoundException(
        `There is not a task delivery with id: ${id}`,
      );
    }

    const taskDeliveryVO = new TaskDeliveryDetailInformationVO();

    const userVO = new UserVO();
    userVO.id = findEntity.user.id;
    userVO.fullName = findEntity.user.fullName;
    userVO.email = findEntity.user.email;
    userVO.photo = findEntity.user.photo;

    const languageVO = new ProgrammingLanguageVO();
    languageVO.id = findEntity.programmingLanguage.id;
    languageVO.name = findEntity.programmingLanguage.name;
    languageVO.logo = findEntity.programmingLanguage.logo;

    const taskVO = new TaskDetailInformationVO();
    taskVO.id = findEntity.task.id;
    taskVO.classId = findEntity.task.classId;
    taskVO.taskTitle = findEntity.task.taskTitle;
    taskVO.taskDescription = findEntity.task.taskDescription;
    taskVO.templateCode = findEntity.task.templateCode;
    taskVO.maxScore = findEntity.task.maxScore;
    taskVO.limitDate = findEntity.task.limitDate;

    taskDeliveryVO.id = findEntity.id;
    taskDeliveryVO.user = userVO;
    taskDeliveryVO.task = taskVO;
    taskDeliveryVO.language = languageVO;
    taskDeliveryVO.code = findEntity.code;
    taskDeliveryVO.score = findEntity.score;
    taskDeliveryVO.deliveryDate = findEntity.deliveryDate;

    return taskDeliveryVO;
  }

  @Post()
  persist(@Body(ValidationPipe) createTaskDeliveryDTO: createTaskDeliveryDTO, @GetUser() user:User ): void {
    this.taskDeliveryService.persist( user.id, createTaskDeliveryDTO );
  }

  @Put(':id')
  async update( @Param('id') id: number, @Body() updateTaskDeliveryDTO: UpdateTaskDeliveryDTO ): Promise<TaskDeliveryDetailInformationVO> {
    const findEntity = await this.taskDeliveryService.findById(id);
    findEntity.languageId = updateTaskDeliveryDTO.languageId;
    findEntity.code = updateTaskDeliveryDTO.code;
    findEntity.deliveryDate = updateTaskDeliveryDTO.deliveryDate;

    const updatedEntity = await this.taskDeliveryService.update(findEntity);

    const taskDeliveryVO = new TaskDeliveryDetailInformationVO();

    const userVO = new UserVO();
    userVO.id = updatedEntity.user.id;
    userVO.fullName = updatedEntity.user.fullName;
    userVO.email = updatedEntity.user.email;
    userVO.photo = updatedEntity.user.photo;

    const languageVO = new ProgrammingLanguageVO();
    languageVO.id = updatedEntity.programmingLanguage.id;
    languageVO.name = updatedEntity.programmingLanguage.name;
    languageVO.logo = updatedEntity.programmingLanguage.logo;

    const taskVO = new TaskDetailInformationVO();
    taskVO.id = updatedEntity.task.id;
    taskVO.classId = updatedEntity.task.classId;
    taskVO.taskTitle = updatedEntity.task.taskTitle;
    taskVO.taskDescription = updatedEntity.task.taskDescription;
    taskVO.templateCode = updatedEntity.task.templateCode;
    taskVO.maxScore = updatedEntity.task.maxScore;
    taskVO.limitDate = updatedEntity.task.limitDate;

    taskDeliveryVO.id = updatedEntity.id;
    taskDeliveryVO.user = userVO;
    taskDeliveryVO.task = taskVO;
    taskDeliveryVO.language = languageVO;
    taskDeliveryVO.code = updatedEntity.code;
    taskDeliveryVO.score = updatedEntity.score;
    taskDeliveryVO.deliveryDate = updatedEntity.deliveryDate;

    return taskDeliveryVO;
  }

  @Patch(':id/update-score')
  async updateScore( @Param('id') id: number, @Body(ValidationPipe) updateScoreDTO: UpdateScoreDTO ) {
    const findEntity = await this.taskDeliveryService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(
        `There is not a task delivery with id: ${id}`,
      );
    }

    if (
      updateScoreDTO.score > findEntity.task.maxScore ||
      updateScoreDTO.score < 0
    ) {
      throw new BadRequestException(
        `The new score can not be greater than the max score: ${findEntity.task.maxScore} or less than 0`,
      );
    }

    findEntity.score = updateScoreDTO.score;
    const updatedEntity = await this.taskDeliveryService.update(findEntity);

    const taskDeliveryVO = new TaskDeliveryDetailInformationVO();

    const userVO = new UserVO();
    userVO.id = updatedEntity.user.id;
    userVO.fullName = updatedEntity.user.fullName;
    userVO.email = updatedEntity.user.email;
    userVO.photo = updatedEntity.user.photo;

    const languageVO = new ProgrammingLanguageVO();
    languageVO.id = updatedEntity.programmingLanguage.id;
    languageVO.name = updatedEntity.programmingLanguage.name;
    languageVO.logo = updatedEntity.programmingLanguage.logo;

    const taskVO = new TaskDetailInformationVO();
    taskVO.id = updatedEntity.task.id;
    taskVO.classId = updatedEntity.task.classId;
    taskVO.taskTitle = updatedEntity.task.taskTitle;
    taskVO.taskDescription = updatedEntity.task.taskDescription;
    taskVO.templateCode = updatedEntity.task.templateCode;
    taskVO.maxScore = updatedEntity.task.maxScore;
    taskVO.limitDate = updatedEntity.task.limitDate;

    taskDeliveryVO.id = updatedEntity.id;
    taskDeliveryVO.user = userVO;
    taskDeliveryVO.task = taskVO;
    taskDeliveryVO.language = languageVO;
    taskDeliveryVO.score = updatedEntity.score;
    taskDeliveryVO.deliveryDate = updatedEntity.deliveryDate;

    return taskDeliveryVO;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const findEntity = await this.taskDeliveryService.findById(id);
    this.taskDeliveryService.removeOne(findEntity);
  }
}
