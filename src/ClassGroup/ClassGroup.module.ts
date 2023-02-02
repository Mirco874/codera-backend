import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common/utils';

import { UserModule } from 'src/User/User.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserClassModule } from 'src/UserClass/UserClass.module';

import { ClassGroupController } from './controller/ClassGroup.controller';

import { ClassGroup } from './entities/ClassGroup.entity';

import { ClassGroupService } from './service/ClassGroup.service';
import { ClassFormValidatorService } from './service/ClassFormValidator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassGroup]),
    UserModule,
    forwardRef(() => UserClassModule),
    AuthModule,
  ],
  providers: [ClassGroupService, ClassFormValidatorService],
  controllers: [ClassGroupController],
  exports: [ClassGroupService],
})
export class ClassGroupModule {}
