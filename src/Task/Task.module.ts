import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/User/User.module';
import { ClassGroupModule } from 'src/ClassGroup/ClassGroup.module';
import { TaskLanguageModule } from '../TaskLanguage/TaskLanguage.module';
import { TaskDeliveryModule } from 'src/TaskDelivery/TaskDelivery.module';

import { TaskController } from './controller/Task.controller';

import { Task } from './entities/Task.entity';

import { TaskService } from './service/Task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ClassGroupModule,
    UserModule,
    forwardRef(() => TaskLanguageModule),
    forwardRef(() => TaskDeliveryModule),
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}