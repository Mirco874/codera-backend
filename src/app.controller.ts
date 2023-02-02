import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';

import { User } from './User/entities/User.entity';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserService } from './User/service/User.service';

import { LoginUserDTO } from './auth/dto/loginUser.dto';
import { CreateUserDTO } from './User/dto/CreateUser.dto';

@Controller('/api/v1/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/login')
  async login( @Body() loginUserDTO: LoginUserDTO ) {
    return this.authService.login(loginUserDTO);
  }

  @Post('auth/register')
  async register(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<User> {
    const findUser = await this.userService.findByEmail(createUserDTO.email);

    if (findUser) {
      throw new BadRequestException(
        `There is a user with the email: ${createUserDTO.email} registered.`,
      );
    }

    if (createUserDTO.password.length < 8) {
      throw new BadRequestException(
        `The password must be at least 8 characters`,
      );
    }

    return this.authService.registerUser(createUserDTO);
  }
}
