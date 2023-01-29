import {Get,Post,Delete,Controller,Body} from '@nestjs/common'
import { Inject, Param, Query, UseGuards } from '@nestjs/common/decorators';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';
import { forwardRef } from '@nestjs/common/utils';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProgrammingLanguageService } from 'src/ProgrammingLanguage/service/ProgrammingLanguage.service';
import { TaskService } from 'src/Task/service/Task.service';
import { TaskLanguageDTO } from "../dto/TaskLanguage.dto";
import { TaskLanguageService } from "../service/TaskLanguage.service";

@Controller("api/v1/language-asignation")
@UseGuards(JwtAuthGuard)
export class TaskLanguageController{
    constructor(private taskLanguageService:TaskLanguageService,
        @Inject(forwardRef(() => TaskService))
        private taskService: TaskService,
        private programmingLanguageService:ProgrammingLanguageService ){}

    @Post()
    async createRelation(@Body(ValidationPipe) taskLanguageDTO:TaskLanguageDTO):Promise <void>{
        const findTask=await this.taskService.findById(taskLanguageDTO.taskId);
        const findLanguage= await this.programmingLanguageService.findById(taskLanguageDTO.languageId);

        if(!findTask){
            throw new NotFoundException(`There is not a task with the id: ${taskLanguageDTO.taskId}`);
        }

        if(!findLanguage){
            throw new NotFoundException(`There is not a language with the id: ${taskLanguageDTO.languageId}`);
        }

        this.taskLanguageService.persist(taskLanguageDTO.taskId,taskLanguageDTO.languageId);
    }

    @Delete()
    async removeRelation(@Body(ValidationPipe) taskLanguageDTO:TaskLanguageDTO): Promise<void>{
        const findEntity=await this.taskLanguageService.find(
            taskLanguageDTO.taskId,
            taskLanguageDTO.languageId);

        if(!findEntity){
            throw new NotFoundException(`There is not a asignation that involves a task id: ${taskLanguageDTO.taskId} and language id: ${taskLanguageDTO.languageId} `)
        }
        this.taskLanguageService.removeOne(findEntity);
        
    }

    @Delete("task/:taskId")
    async removeAllByTaskId( @Param("taskId") taskId: number): Promise<void>{
        const findTask =this.taskService.findById(taskId);

        if(!findTask){
            throw new BadRequestException(`There is not a task with id: ${taskId}`);
        }
        
        this.taskLanguageService.removeByTaskId(taskId);

    }




}