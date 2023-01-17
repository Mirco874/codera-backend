import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClassController } from './controller/UserClass.controller';
import { UserClass } from './entities/UserClass.entity';
import { UserClassService } from './service/UserClass.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserClass])],
  providers: [UserClassService],
  controllers: [UserClassController],
  exports: [UserClassService],
})
export class UserClassModule {}
