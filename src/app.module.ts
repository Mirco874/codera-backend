import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './User/User.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './Task/Task.module';
import { UserClassModule } from './UserClass/UserClass.module';
import { ClassGroupModule } from './ClassGroup/ClassGroup.module';
import { CodeEditorModule } from './CodeEditor/CodeEditor.module';
import { TaskLanguageModule } from './TaskLanguage/TaskLanguage.module';
import { TaskDeliveryModule } from './TaskDelivery/TaskDelivery.module';
import { DeliveryCommentModule } from './DeliveryComment/DeliveryComment.module';
import { ProgramminLanguageModule } from './ProgrammingLanguage/ProgrammingLanguage.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'classroom',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    UserModule,
    ClassGroupModule,
    UserClassModule,
    TaskModule,
    ProgramminLanguageModule,
    TaskLanguageModule,
    TaskDeliveryModule,
    DeliveryCommentModule,
    CodeEditorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
