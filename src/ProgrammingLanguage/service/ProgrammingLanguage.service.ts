import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgrammingLanguage } from '../entities/ProgrammingLanguage.entity';
import { ProgrammingLanguageVO } from '../vo/ProgrammingLanguage.vo';

@Injectable()
export class ProgrammingLanguageService {
  constructor(
    @InjectRepository(ProgrammingLanguage)
    private programmingLanguageRepository: Repository<ProgrammingLanguage>,
  ) {}

    findById(id:number):Promise<ProgrammingLanguage>{
      return this.programmingLanguageRepository.findOneBy({id});
    }

     findAll():Promise<ProgrammingLanguage[]>{
      return this.programmingLanguageRepository.find();    
    }


}
