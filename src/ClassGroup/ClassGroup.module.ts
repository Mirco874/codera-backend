import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "src/User/User.module";
import { ClassGroupController } from "./controller/ClassGroup.controller";
import { ClassGroup } from "./entities/ClassGroup.entity";
import { ClassGroupService } from "./service/ClassGroup.service";
import { ClassFormValidatorService } from "./service/ClassFormValidator.service";
import { UserClassModule } from "src/UserClass/UserClass.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports:[TypeOrmModule.forFeature([ClassGroup]),UserModule,UserClassModule,AuthModule ],
    providers:[ClassGroupService,ClassFormValidatorService],
    controllers:[ClassGroupController],
    exports:[ClassGroupService]
})


export class ClassGroupModule{}
