import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { changePhotoDTO } from '../dto/ChangePhoto.dto';
import { ChangeUserInformationDTO } from '../dto/ChangeUserInformation.dto';
import { CreateUserDTO } from '../dto/CreateUser.dto';
import { User } from '../entities/User.entity';
import { GetUser } from '../service/GetUser';
import { UserService } from '../service/User.service';
import { UserFormValidatorService } from '../service/UserFormValidator.service';
import { UserVO } from '../vo/User.vo';

@Controller('api/v1/users/')
@UseGuards(JwtAuthGuard)
export class userController {
  constructor(
    private userService: UserService,
    private formValidatorService: UserFormValidatorService,
  ) {}

  @Get("me")
  @UseInterceptors(ClassSerializerInterceptor)
  async findUser(@GetUser() user: User): Promise<User> {
    const { id } = user;
    const findUser = await this.userService.findById(id);
    if (!findUser) {
      throw new NotFoundException(
        `the user with id: ${id} was not register in the database `,
      );
    } else {
return findUser
    }
  }

  @Post()
  async persist(@Body() createUserDTO: CreateUserDTO): Promise<UserVO> {
    if (!this.formValidatorService.correctCreateUserDTO(createUserDTO)) {
      throw new BadRequestException(`you must fill in all the required fields`);
    }
    const userVO = new UserVO();
    const savedEntity = await this.userService.persist(createUserDTO);
    userVO.id = savedEntity.id;
    userVO.fullName = savedEntity.fullName;
    userVO.email = savedEntity.email;
    return userVO;
  }

  @Patch(':id')
  async ChangePhoto(
    @Param('id') id: number,
    @Body() changePhotoDTO: changePhotoDTO,
  ): Promise<UserVO> {
    const findEntity = await this.userService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(
        `the user with id: ${id} was not register in the database `,
      );
    }

    if (!this.formValidatorService.correctChangePhotoDTO(changePhotoDTO)) {
      throw new BadRequestException(`you must send a photo in blob format`);
    }

    findEntity.photo = changePhotoDTO.photo;

    const updatedEntity = await this.userService.update(findEntity);
    const vo = new UserVO();

    vo.id = updatedEntity.id;
    vo.fullName = updatedEntity.fullName;
    vo.email = updatedEntity.email;
    vo.photo = updatedEntity.photo;
    return vo;
  }

  @Put(':id')
  async ChangeInformation(
    @Param('id') id: number,
    @Body() changeInformationDTO: ChangeUserInformationDTO,
  ): Promise<UserVO> {
    const findEntity = await this.userService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(
        `the user with id: ${id} was not register in the database `,
      );
    }

    if (
      !this.formValidatorService.correctChangeInformationDTO(
        changeInformationDTO,
      )
    ) {
      throw new BadRequestException(`bad email or username`);
    }

    findEntity.email = changeInformationDTO.email;
    findEntity.fullName = changeInformationDTO.fullName;

    const updatedEntity = await this.userService.update(findEntity);
    const vo = new UserVO();

    vo.id = updatedEntity.id;
    vo.fullName = updatedEntity.fullName;
    vo.email = updatedEntity.email;
    vo.photo = updatedEntity.photo;
    return vo;
  }
}
