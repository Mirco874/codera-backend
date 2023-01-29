import { Exclude } from 'class-transformer';
import { ClassGroup } from 'src/ClassGroup/entities/ClassGroup.entity';
import { DeliveryComment } from 'src/DeliveryComment/entities/DeliveryComment.entity';
import { TaskDelivery } from 'src/TaskDelivery/entities/TaskDelivery.entity';
import { UserClass } from 'src/UserClass/entities/UserClass.entity';
import {Entity,PrimaryGeneratedColumn,Column, OneToMany, JoinColumn, Unique} from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"full_name"})
    fullName:string;

    @Column()
    email:string;

    @Column({name:"PASSWORD"})
    @Exclude()
    password:string;

    @Column()
    photo:string;
 
    @OneToMany((type) => ClassGroup, (classGroup) => classGroup.teacher)
    classes: ClassGroup[]
    
    @OneToMany(() => UserClass, (userClass) => userClass.user)
    userClass!: UserClass[];

    @OneToMany(()=>TaskDelivery,(taskDelivery)=>taskDelivery.user)
    taskDeliveries:TaskDelivery[];

    @OneToMany(()=>DeliveryComment,(deliveryComment)=>deliveryComment.user)
    comments!:DeliveryComment[];
}
