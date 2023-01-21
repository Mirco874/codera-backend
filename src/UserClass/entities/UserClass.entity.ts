import { ClassGroup } from "src/ClassGroup/entities/ClassGroup.entity";
import { User } from "src/User/entities/User.entity";
import {Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({name:"user_class"})
export class UserClass{

    @PrimaryColumn({type:"int",name:"user_id"})
    userId:number;
    
    @PrimaryColumn({type:"varchar" ,name:"class_id"})
    classId:string;

    @ManyToOne(() => User, (user) => user.userClass)
    @JoinColumn({name:"user_id"})
    user!: User
                                                            /////get()?///
    @ManyToOne(() => ClassGroup, (classGroup) => classGroup.userClass)
    @JoinColumn({name:"class_id"})
    classGroup!: ClassGroup
}