import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassGroupModule } from "src/ClassGroup/ClassGroup.module";
import { UserModule } from "src/User/User.module";
import { TaskController } from "./controller/Task.controller";
import { Task } from "./entities/Task.entity";
import { TaskService } from "./service/Task.service";

@Module({
    imports:[TypeOrmModule.forFeature([Task]),ClassGroupModule,UserModule],
    providers:[TaskService],
    controllers:[TaskController],
    exports:[TaskService]
})

export class TaskModule{}