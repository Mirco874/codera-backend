import { Controller, Post, Body, Delete, Get, Param, ValidationPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SubscribeUserDTO } from '../dto/SubscribeUser.dto';
import { UserClassService } from '../service/UserClass.service';

@Controller('api/v1/inscriptions/')
@UseGuards(JwtAuthGuard)
export class UserClassController {
  constructor(private userClassService: UserClassService) {}

  @Post()
  subsribe(@Body(ValidationPipe) subscribeUserDTO: SubscribeUserDTO): void {
    //todo no debe poder volver a inscribirse en la misma clase
    this.userClassService.persist(subscribeUserDTO);
  }
 
  @Delete()
  removeSubscription(@Body(ValidationPipe) subscribeUserDTO: SubscribeUserDTO): void {
    //todo no debe poder eliminar algo que no existe
    this.userClassService.remove(subscribeUserDTO);
  }
}
