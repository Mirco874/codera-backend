import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JWTPayload } from 'src/auth/JWTPayload.model';

import { User } from '../entities/User.entity';
import { ClassGroup } from 'src/ClassGroup/entities/ClassGroup.entity';
import { UserClass } from 'src/UserClass/entities/UserClass.entity';

import { CreateUserDTO } from '../dto/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  validateJWTPayload(payload: JWTPayload): Promise<User> {
    const { id } = payload;
    return this.usersRepository.findOneBy({ id });
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findClassesByUserId(id: number): Promise<void> {
    const userClasses = await this.usersRepository
      .createQueryBuilder('User')
      .select(['User.id', 'User.fullName', 'User.email'])

      .innerJoinAndSelect(UserClass, 'UserClass', 'UserClass.userId=User.id')
      .innerJoinAndSelect(
        ClassGroup,
        'ClassGroup',
        'UserClass.classId=ClassGroup.id',
      )
      .where({ id })
      .getMany();
  }

  persist(createUserDTO: CreateUserDTO): Promise<User> {
    const entity = new User();

    entity.fullName = createUserDTO.fullName;
    entity.email = createUserDTO.email;
    entity.password = createUserDTO.password;
    return this.usersRepository.save(entity);
  }

  update(entity: User): Promise<User> {
    return this.usersRepository.save(entity);
  }

  remove(id: string): void {
    this.usersRepository.delete(id);
  }
}
