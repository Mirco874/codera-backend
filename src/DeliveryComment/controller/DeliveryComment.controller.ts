import {
  Controller,
  BadRequestException,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';

import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { TaskDeliveryService } from 'src/TaskDelivery/service/TaskDelivery.service';
import { DeliveryCommentService } from '../service/DeliveryComment.service';

import { CreateCommentDTO } from '../dto/CreateComment.dto';
import { EditCommentDTO } from '../dto/EditComment.dto';

import { UserVO } from 'src/User/vo/User.vo';
import { DeliveryCommentVO } from '../vo/DeliveryComment.vo';

@Controller('api/v1/comments')
@UseGuards(JwtAuthGuard)
export class DeliveryCommentController {
  constructor(
    private deliveryCommentService: DeliveryCommentService,
    private taskDeliveryService: TaskDeliveryService,
  ) {}

  @Get()
  async findAllByDeliveryId( @Query('deliveryId') deliveryId: number ): Promise<DeliveryCommentVO[]> {

    if (typeof deliveryId === 'undefined') {
      throw new BadRequestException(
        `you must provide the query parameter : 'deliveryId' `,
      );
    }
    const findTaskDelivery = await this.taskDeliveryService.findById(
      deliveryId,
    );

    if (!findTaskDelivery) {
      throw new NotFoundException(
        `There is not a task delivery with the id: ${deliveryId}`,
      );
    }

    const entityList = await this.deliveryCommentService.findAllByTaskDeliveryId(deliveryId);
    let voList: DeliveryCommentVO[] = [];

    entityList.map((entity) => {
      const deliveryCommentVO = new DeliveryCommentVO();

      const userVO = new UserVO();
      userVO.id = entity.user.id;
      userVO.fullName = entity.user.fullName;
      userVO.email = entity.user.email;
      userVO.photo = entity.user.photo;

      deliveryCommentVO.id = entity.id;
      deliveryCommentVO.user = userVO;
      deliveryCommentVO.content = entity.content;
      deliveryCommentVO.commentDate = entity.commentDate;

      voList.push(deliveryCommentVO);
    });

    return voList;
  }

  @Post()
  pesist(@Body(ValidationPipe) createCommentDTO: CreateCommentDTO): void {
    this.deliveryCommentService.persist(createCommentDTO);
  }

  @Put(':id')
  async update( @Param('id') id: number, @Body(ValidationPipe) editCommentDTO: EditCommentDTO ): Promise<void> {
    const findEntity = await this.deliveryCommentService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(`There is not a comment with the id: ${id}`);
    }

    findEntity.content = editCommentDTO.content;
    this.deliveryCommentService.update(findEntity);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const findEntity = await this.deliveryCommentService.findById(id);

    if (!findEntity) {
      throw new NotFoundException(`There is not a comment with the id: ${id}`);
    }

    this.deliveryCommentService.remove(findEntity);
  }
}
