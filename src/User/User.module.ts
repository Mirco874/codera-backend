import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { UserService } from './service/User.service';
import { userController } from 'src/User/controller/User.controller';
import { UserFormValidatorService } from './service/UserFormValidator.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService,UserFormValidatorService],
  controllers: [userController],
  exports:[UserService]
})


export class UserModule {}