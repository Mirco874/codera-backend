import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassGroup } from '../entities/ClassGroup.entity';
import { CreateClassDTO } from '../dto/CreateClass.dto';
import { v4 } from 'uuid';
import { UserService } from 'src/User/service/User.service';

@Injectable()
export class ClassGroupService {
  /////////////se pueden crear repositorios con un decorador?////////////
  constructor(
    @InjectRepository(ClassGroup)
    private classGroupRepository: Repository<ClassGroup>,
    private userService: UserService,
  ) {}

  findById(id: string): Promise<ClassGroup> {
    try {
      const classGroup = this.classGroupRepository
        .createQueryBuilder('ClassGroup')
        ///dejar la entidad tal como esta? o descartar algunos atributos a este nivel??////
        .innerJoinAndSelect('ClassGroup.teacher', 'user')
        .where('ClassGroup.id=:id', { id })
        .getOne();

      return classGroup;
    } catch (error) {
      console.log(error);
    }
  }
  //////////////////////////ENCONTRAR POR ID DE USUARIO
  //SOLAMENTE REGRESA LOS ATRIBUTOS DE LA ENTIDAD CLASSGROUP
  async findByUserId(id: number): Promise<ClassGroup[]> {
    return this.classGroupRepository
      .createQueryBuilder('ClassGroup')
      .innerJoinAndSelect('ClassGroup.userClass', 'UserClass')
      .innerJoinAndSelect('ClassGroup.teacher', 'User')
      .where('UserClass.userId=:id', { id })
      .getMany();
  }

  persist(createClassDTO: CreateClassDTO): Promise<ClassGroup> {
    const entity = new ClassGroup();

    entity.id = v4();
    entity.teacherId = createClassDTO.teacherId;
    entity.className = createClassDTO.className;
    entity.classDescription = createClassDTO.classDescription;

    return this.classGroupRepository.save(entity);
  }

  update(entity: ClassGroup): Promise<ClassGroup> {
    return this.classGroupRepository.save(entity);
  }
}
