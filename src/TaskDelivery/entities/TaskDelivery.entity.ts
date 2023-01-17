import { DeliveryComment } from "src/DeliveryComment/entities/DeliveryComment.entity";
import { ProgrammingLanguage } from "src/ProgrammingLanguage/entities/ProgrammingLanguage.entity";
import { Task } from "src/Task/entities/Task.entity";
import { User } from "src/User/entities/User.entity";
import {Entity,PrimaryGeneratedColumn ,Column, ManyToOne, JoinColumn, OneToMany} from "typeorm"

@Entity({name:"task_delivery"})
export class TaskDelivery{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"user_id"})
    userId:number;

    @Column({name:"task_id"})
    taskId:number;
 
    @Column({name:"language_id"})
    languageId:number;

    @Column()
    code:string;

    @Column()
    score:number;

    @Column({name:"delivery_date"})
    deliveryDate:string;

    @Column({name:"delivery_time"})
    deliveryTime:string;

    @ManyToOne(()=>User,(user)=>user.taskDeliveries)
    @JoinColumn({name:"user_id"})
    user:User;

    @ManyToOne(()=>Task,(task)=>task.taskDeliveries)
    @JoinColumn({name:"task_id"})
    task:Task;

    @ManyToOne(()=>ProgrammingLanguage,(programmingLanguage)=>programmingLanguage.taskDeliveries)
    @JoinColumn({name:"language_id"})
    programmingLanguage:ProgrammingLanguage;

    @OneToMany(()=>DeliveryComment,(deliveryComment)=>deliveryComment.taskDelivery)
    comments!:DeliveryComment[];
}

