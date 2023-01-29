import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  NotFoundException,
  BadRequestException,
  ValidationPipe,
  Inject
} from '@nestjs/common';
import { CreateClassDTO } from '../dto/CreateClass.dto';
import { ClassGroupService } from '../service/ClassGroup.service';
import { ClassGroupVO } from '../vo/ClassGroup.vo';
import { EditClassDTO } from '../dto/EditClass.dto';
import { TeacherVO } from 'src/User/vo/Teacher.vo';
import { ClassFormValidatorService } from '../service/ClassFormValidator.service';
import { UserService } from 'src/User/service/User.service';
import { UserClassService } from 'src/UserClass/service/UserClass.service';
import { SubscribeUserDTO } from 'src/UserClass/dto/SubscribeUser.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/User/service/GetUser';
import { User } from 'src/User/entities/User.entity';
import { forwardRef } from '@nestjs/common/utils';

@Controller('api/v1/classes/')
@UseGuards(JwtAuthGuard)
export class ClassGroupController {
  constructor(
    private classGroupService: ClassGroupService,
    private userService: UserService,
    @Inject(forwardRef(() => UserClassService))
    private userClassService: UserClassService,
    private formValidatorService: ClassFormValidatorService
  ) {}

  @Get()
  async findAll(@GetUser() user:User): Promise<ClassGroupVO[]> {
  const findEntity = await this.userService.findById(user.id);

  if (!findEntity) {
    throw new NotFoundException(
      `there is not exist a user with the id: ${user.id} `,
    );
  }

  const entityList = await this.classGroupService.findByUserId(user.id);

  let voList: ClassGroupVO[] = [];

  entityList.map((entity) => {
    const classGroupVO = new ClassGroupVO();
    
    classGroupVO.id= entity.id;
    classGroupVO.className= entity.className;
    classGroupVO.classDescription= entity.classDescription;
    classGroupVO.creationDate= entity.creationDate;

    const teacherVO = new TeacherVO();
    teacherVO.id= entity.teacher.id;
    teacherVO.fullName= entity.teacher.fullName;

    classGroupVO.instructor=(teacherVO);

    voList.push(classGroupVO);
  });

  return voList;

  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ClassGroupVO> {
    const findEntity = await this.classGroupService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(`there is not a class with the id: ${id}`);
    }

    const teacherVO = new TeacherVO();
    teacherVO.id= findEntity.teacher.id;
    teacherVO.fullName= findEntity.teacher.fullName;

    const classGroupVO = new ClassGroupVO();

    classGroupVO.id= findEntity.id;
    classGroupVO.className= findEntity.className;
    classGroupVO.classDescription= findEntity.classDescription;
    classGroupVO.creationDate= findEntity.creationDate;
    classGroupVO.instructor= teacherVO;
    
    return classGroupVO;
  }

  @Post()
  async persist(
    @Body(ValidationPipe) createClassDTO: CreateClassDTO,
  ): Promise<ClassGroupVO> {
    if (!this.formValidatorService.correctCreateClassGroupDTO(createClassDTO)) {
      throw new BadRequestException(
        'you must provide a className, classDescription and a teacher id',
      );
    }

    const validTeacher = await this.userService.findById(
      createClassDTO.teacherId,
    );

    if (!validTeacher) {
      throw new BadRequestException(
        `there is not exist a theacher with id: ${createClassDTO.teacherId}`,
      );
    }

    const savedEntity = await this.classGroupService.persist(createClassDTO);

    const suscribeUserDTO = new SubscribeUserDTO();
    suscribeUserDTO.classId = savedEntity.id;
    suscribeUserDTO.userId = createClassDTO.teacherId;
    this.userClassService.persist(suscribeUserDTO);

    const classGroupVO = new ClassGroupVO();

    classGroupVO.id= savedEntity.id;
    classGroupVO.className= savedEntity.className;
    classGroupVO.classDescription= savedEntity.classDescription;
    classGroupVO.creationDate= savedEntity.creationDate;

    return classGroupVO;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) editClassDTO: EditClassDTO,
  ): Promise<ClassGroupVO> {
    const findEntity = await this.classGroupService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(`there is not a class with id: ${id}`);
    }

    findEntity.className = editClassDTO.className;
    findEntity.classDescription = editClassDTO.classDescription;
    findEntity.creationDate =new Date();

    const updatedEntity = await this.classGroupService.update(findEntity);
    const classGroupVO = new ClassGroupVO();

    classGroupVO.id= updatedEntity.id;
    classGroupVO.className= updatedEntity.className;
    classGroupVO.classDescription= updatedEntity.classDescription;
    classGroupVO.creationDate= updatedEntity.creationDate;

    return classGroupVO;
  }
}
