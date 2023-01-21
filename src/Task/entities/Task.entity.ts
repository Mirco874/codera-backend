import { ClassGroup } from 'src/ClassGroup/entities/ClassGroup.entity';
import { TaskDelivery } from 'src/TaskDelivery/entities/TaskDelivery.entity';
import { TaskLanguage } from 'src/TaskLanguage/entities/TaskLanguage.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity({name:"task"})
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_id' })
  classId: string;

  @Column({ name: 'task_title' })
  taskTitle: string;

  @Column({ name: 'task_description' })
  taskDescription: string;

  @Column({ name: 'max_score' })
  maxScore: number;

  @Column({ name: 'template_code' })
  templateCode: string;
 

  @Column({ name: 'limit_date' })
  limitDate: Date;

  @ManyToOne(()=>ClassGroup,(classGroup)=>classGroup.tasks)
  @JoinColumn({ name: 'class_id' })
  classGroup:ClassGroup;

  @OneToMany(()=>TaskDelivery,(taskDelivery)=>taskDelivery.task)
  taskDeliveries:TaskDelivery[];

  @OneToMany(() => TaskLanguage, taskLanguage => taskLanguage.task)
  taskLanguage!: TaskLanguage[];

}
