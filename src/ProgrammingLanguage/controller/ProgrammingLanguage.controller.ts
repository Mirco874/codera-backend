import { 
  Controller, 
  Get, 
  NotFoundException, 
  Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProgrammingLanguageService } from '../service/ProgrammingLanguage.service';
import { ProgrammingLanguageVO } from '../vo/ProgrammingLanguage.vo';

@Controller('api/v1/programming-languages/')
@UseGuards(JwtAuthGuard)
export class ProgrammingLanguageController {
  constructor(private programmingLanguageService: ProgrammingLanguageService) {}

  @Get(':id')
  async findById(@Param('id') id: number): Promise<ProgrammingLanguageVO> {
    const findEntity = await this.programmingLanguageService.findById(id);
    if (!findEntity) {
      throw new NotFoundException(`There is not a language with the id: ${id}`);
    }
    const vo = new ProgrammingLanguageVO();
    vo.id = findEntity.id;
    vo.name = findEntity.name;
    vo.logo = findEntity.logo;
    return vo;
  }

  @Get()
  async findAll(): Promise<ProgrammingLanguageVO[]> {
    const entityList = await this.programmingLanguageService.findAll();

    let voList: ProgrammingLanguageVO[] = [];
    entityList.map((entity) => {
      const vo = new ProgrammingLanguageVO();
      vo.id = entity.id;
      vo.name = entity.name;
      vo.logo = entity.logo;
      voList.push(vo);
    });
    return voList;
  }
}
