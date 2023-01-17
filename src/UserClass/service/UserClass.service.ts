import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassGroup } from 'src/ClassGroup/entities/ClassGroup.entity';
import { Repository } from 'typeorm';
import { SubscribeUserDTO } from '../dto/SubscribeUser.dto';
import { UserClass } from '../entities/UserClass.entity';

@Injectable()
export class UserClassService {
  constructor(
    @InjectRepository(UserClass)
    private userClassRepository: Repository<UserClass>,
  ) {}

  async findSubscriptionsByUserId(id:number):Promise<void>{
    const userClasses=await this.userClassRepository.createQueryBuilder('UserClass')
    .select('ClassGroup.id')
    .innerJoin(ClassGroup,'ClassGroup','UserClass.classId=ClassGroup.id')
    .where('UserClass.userId=:userId',{userId:id})
    .getMany();
    console.log(userClasses);
  }

  persist(suscribeUserDTO: SubscribeUserDTO): Promise<UserClass> {
    const entity = new UserClass();
    entity.userId=(suscribeUserDTO.userId);
    entity.classId=(suscribeUserDTO.classId);
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
