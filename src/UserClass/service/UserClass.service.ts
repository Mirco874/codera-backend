import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserClass } from '../entities/UserClass.entity';
import { ClassGroup } from 'src/ClassGroup/entities/ClassGroup.entity';

import { SubscribeUserDTO } from '../dto/SubscribeUser.dto';

@Injectable()
export class UserClassService {
  constructor(
    @InjectRepository(UserClass)
    private userClassRepository: Repository<UserClass>,
  ) {}

  async findSubscriptionsByUserId(id: number): Promise<void> {
    await this.userClassRepository
      .createQueryBuilder('UserClass')
      .select('ClassGroup.id')
      .innerJoin(ClassGroup, 'ClassGroup', 'UserClass.classId=ClassGroup.id')
      .where('UserClass.userId=:userId', { userId: id })
      .getMany();
  }

  persist(suscribeUserDTO: SubscribeUserDTO): Promise<UserClass> {
    const entity = new UserClass();
    entity.userId = suscribeUserDTO.userId;
    entity.classId = suscribeUserDTO.classId;
    return this.userClassRepository.save(entity);
  }

  remove(suscribeUserDTO: SubscribeUserDTO): void {
    this.userClassRepository
      .createQueryBuilder('UserClass')
      .delete()
      .from(UserClass)
      .andWhere('userId=:userId', { userId: suscribeUserDTO.userId })
      .andWhere('classId=:classId', { classId: suscribeUserDTO.classId })
      .execute();
  }
}
