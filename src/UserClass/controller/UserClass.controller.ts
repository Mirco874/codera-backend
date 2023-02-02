import {
  Controller,
  Post,
  Body,
  Delete,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { forwardRef } from '@nestjs/common/utils';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { UserClassService } from '../service/UserClass.service';
import { UserService } from 'src/User/service/User.service';
import { ClassGroupService } from 'src/ClassGroup/service/ClassGroup.service';

import { SubscribeUserDTO } from '../dto/SubscribeUser.dto';

@Controller('api/v1/inscriptions/')
@UseGuards(JwtAuthGuard)
export class UserClassController {
  constructor(
    private userClassService: UserClassService,
    private userService: UserService,
    @Inject(forwardRef(() => ClassGroupService))
    private classGroupService: ClassGroupService,
  ) {}

  @Post()
  async subsribe( @Body(ValidationPipe) subscribeUserDTO: SubscribeUserDTO ): Promise<void> {
    const { userId, classId } = subscribeUserDTO;
    const findUser = await this.userService.findById(userId);
    const findClass = await this.classGroupService.findById(classId);

    if (!findUser) {
      throw new NotFoundException(
        `There is not register a user with id: ${userId}`,
      );
    }

    if (!findClass) {
      throw new NotFoundException(
        `There is not a created class with id: ${classId}`,
      );
    }

    this.userClassService.persist(subscribeUserDTO);
  }

  @Delete()
  removeSubscription( @Body(ValidationPipe) subscribeUserDTO: SubscribeUserDTO ): void {
    this.userClassService.remove(subscribeUserDTO);
  }
}