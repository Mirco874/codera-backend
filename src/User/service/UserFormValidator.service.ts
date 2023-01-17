import { Injectable } from '@nestjs/common';
import { changePhotoDTO } from '../dto/ChangePhoto.dto';
import { ChangeUserInformationDTO } from '../dto/ChangeUserInformation.dto';
import { CreateUserDTO } from '../dto/CreateUser.dto';
@Injectable()
export class UserFormValidatorService {
  constructor() {}

  correctCreateUserDTO(createUserDTO: CreateUserDTO): boolean {
    return (
      this.validString(createUserDTO.fullName) &&
      this.validString(createUserDTO.email) &&
      this.validString(createUserDTO.password)
    );
  }

  correctChangePhotoDTO(changePhotoDTO: changePhotoDTO): boolean {
    return this.validString(changePhotoDTO.photo);
  }

  correctChangeInformationDTO(changeInformationDTO: ChangeUserInformationDTO) {
    return (
      this.validString(changeInformationDTO.email) &&
      this.validString(changeInformationDTO.fullName)
    );
  }

  validString(word: string): boolean {
    return typeof word != 'undefined' && word !== null && word.length !== 0;
  }
}
