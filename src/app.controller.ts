import { Controller, Get, Post,Body } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppService} from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginUserDTO } from './auth/dto/loginUser.dto';
import { CreateUserDTO } from './User/dto/CreateUser.dto';
import { User } from './User/entities/User.entity';

@Controller("/api/v1/")
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("auth/login")
  async login(@Body() loginUserDTO:LoginUserDTO){
    return this.authService.login(loginUserDTO)
  }

  @Post("auth/register")
  async register(@Body(ValidationPipe) createUserDTO:CreateUserDTO):Promise<User>{
    return this.authService.registerUser(createUserDTO);
  }

}
