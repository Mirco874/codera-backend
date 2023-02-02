import { Injectable } from '@nestjs/common';
import { CreateClassDTO } from '../dto/CreateClass.dto';
import { EditClassDTO } from '../dto/EditClass.dto';

@Injectable()
export class ClassFormValidatorService {
  constructor() {}

  correctCreateClassGroupDTO(createClassDTO: CreateClassDTO): boolean {
    return (
      this.validNumber(createClassDTO.teacherId) &&
      this.validString(createClassDTO.className) &&
      this.validString(createClassDTO.classDescription)
    );
  }

  correctEditClassDTO(editClassDTO: EditClassDTO): boolean {
    return (
      this.validString(editClassDTO.className) &&
      this.validString(editClassDTO.classDescription)
    );
  }

  validNumber(number: number) {
    return number > 0;
  }

  validString(word: string): boolean {
    return typeof word != 'undefined' && word !== null && word.length !== 0;
  }
}
