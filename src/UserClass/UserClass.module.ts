import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/User/User.module';
import { ClassGroupModule } from 'src/ClassGroup/ClassGroup.module';

import { UserClassController } from './controller/UserClass.controller';

import { UserClass } from './entities/UserClass.entity';

import { UserClassService } from './service/UserClass.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserClass]),
    UserModule,
    forwardRef(() => ClassGroupModule),
  ],
  providers: [UserClassService],
  controllers: [UserClassController],
  exports: [UserClassService],
})
export class UserClassModule {}
