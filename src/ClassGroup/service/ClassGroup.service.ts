import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassGroup } from '../entities/ClassGroup.entity';
import { CreateClassDTO } from '../dto/CreateClass.dto';
import { v4 } from 'uuid';
import { UserService } from 'src/User/service/User.service';

@Injectable()
export class ClassGroupService {
  constructor(
    @InjectRepository(ClassGroup)
    private classGroupRepository: Repository<ClassGroup>,
    private userService: UserService,
  ) {}

  findById(id: string): Promise<ClassGroup> {
    return this.classGroupRepository
    .createQueryBuilder('ClassGroup')
    .innerJoinAndSelect('ClassGroup.teacher', 'user')
    .where('ClassGroup.id=:id', { id })
    .getOne();
  }

  async findByUserId(id: number): Promise<ClassGroup[]> {
    return this.classGroupRepository
      .createQueryBuilder('ClassGroup')
      .innerJoinAndSelect('ClassGroup.userClass', 'UserClass')
      .innerJoinAndSelect('ClassGroup.teacher', 'User')
      .where('UserClass.userId=:id', { id })
      .orderBy('ClassGroup.creationDate', 'DESC')
      .getMany();
  }

  persist(createClassDTO: CreateClassDTO): Promise<ClassGroup> {
    const entity = new ClassGroup();

    entity.id = v4();
    entity.teacherId = createClassDTO.teacherId;
    entity.className = createClassDTO.className;
    entity.classDescription = createClassDTO.classDescription;
    entity.creationDate =new Date();

    return this.classGroupRepository.save(entity);
  }

  update(entity: ClassGroup): Promise<ClassGroup> {
    return this.classGroupRepository.save(entity);
  }
}
