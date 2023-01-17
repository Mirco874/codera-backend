import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassGroupModule } from "src/ClassGroup/ClassGroup.module";
import { TaskModule } from "src/Task/Task.module";
import { UserModule } from "src/User/User.module";
import { TaskDeliveryController } from "./controller/TaskDelivery.controller";
import { TaskDelivery } from "./entities/TaskDelivery.entity";
import { TaskDeliveryService } from "./service/TaskDelivery.service";

@Module(
    {
    imports:[TypeOrmModule.forFeature([TaskDelivery]),UserModule,TaskModule,ClassGroupModule],
    providers:[TaskDeliveryService],
    controllers:[TaskDeliveryController],
    exports:[TaskDeliveryService]
    }
)

export class TaskDeliveryModule{}