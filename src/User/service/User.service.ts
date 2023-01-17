import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JWTPayload } from 'src/auth/JWTPayload.model';
import { ClassGroup } from 'src/ClassGroup/entities/ClassGroup.entity';
import { ClassGroupVO } from 'src/ClassGroup/vo/ClassGroup.vo';
import { UserClass } from 'src/UserClass/entities/UserClass.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/CreateUser.dto';
import { User } from '../entities/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}


  validateJWTPayload(payload: JWTPayload): Promise<User> {
    const { id } = payload;
    return this.usersRepository.findOneBy({id});
  }

  async findById(id: number): Promise<User> {
    // .leftJoin("ClassGroup.teacher","ClassGroup")
    // .where("ClassGroup.teacherId=:id",{id:"3"})
    console.log('-----------------------------');
    const query = await this.usersRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.classes', 'ClassGroup')
      .where({ id })
      .getMany();
    console.log(query);
    console.log('-----------------------------');

    console.log('-----------------------------');
    const query2 = await this.usersRepository
      .createQueryBuilder('User')
      .where({ id })
      .getMany();
    console.log(query2);
    console.log('-----------------------------');
    // await getRepository(Foo).createQueryBuilder('foo')
    // .where({ id: 1})
    // .select(['foo.id', 'foo.createdAt', 'bar.id', 'bar.name'])
    // .leftJoin('foo.bars', 'bar')  // bar is the joined table
    // .getMany();

    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }
  //api/v1/:user_id/classes
  async findClassesByUserId(id:number):Promise<void>{
    const userClasses= await this.usersRepository.createQueryBuilder('User')
    .select(['User.id','User.fullName','User.email'])
    
    .innerJoinAndSelect(UserClass,'UserClass','UserClass.userId=User.id')
    .innerJoinAndSelect(ClassGroup,'ClassGroup','UserClass.classId=ClassGroup.id')
    .where({id}).getMany();
    console.log(userClasses);

  }


  persist(createUserDTO: CreateUserDTO): Promise<User> {
    const entity = new User();
    //////////////////////preguntar//////////////////////
    entity.fullName=(createUserDTO.fullName);
    entity.email=(createUserDTO.email);
    entity.password=(createUserDTO.password);

    return this.usersRepository.save(entity);
  }

  update(entity: User): Promise<User> {
    return this.usersRepository.save(entity);
  }

  remove(id: string): void {
    this.usersRepository.delete(id);
  }
}
