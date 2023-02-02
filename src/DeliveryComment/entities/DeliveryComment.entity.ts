import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/User/entities/User.entity';
import { TaskDelivery } from 'src/TaskDelivery/entities/TaskDelivery.entity';

@Entity({ name: 'delivery_comment' })
export class DeliveryComment {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'delivery_id' })
  deliveryId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  content: string;

  @Column({ name: 'comment_date' })
  commentDate: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TaskDelivery, (taskDelivery) => taskDelivery.comments)
  @JoinColumn({ name: 'delivery_id' })
  taskDelivery: TaskDelivery;
}