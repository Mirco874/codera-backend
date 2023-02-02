import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/User/User.module';
import { TaskDeliveryModule } from 'src/TaskDelivery/TaskDelivery.module';
import { DeliveryComment } from './entities/DeliveryComment.entity';
import { DeliveryCommentController } from './controller/DeliveryComment.controller';
import { DeliveryCommentService } from './service/DeliveryComment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryComment]),
    UserModule,
    TaskDeliveryModule,
  ],
  providers: [DeliveryCommentService],
  controllers: [DeliveryCommentController],
  exports: [DeliveryCommentService],
})
export class DeliveryCommentModule {}
