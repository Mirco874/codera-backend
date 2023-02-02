import {
  Column, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn
} from 'typeorm';
import { TaskDelivery } from 'src/TaskDelivery/entities/TaskDelivery.entity';
import { TaskLanguage } from 'src/TaskLanguage/entities/TaskLanguage.entity';

@Entity({ name: 'programming_language' })
export class ProgrammingLanguage {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  logo: string;

  @OneToMany(
    () => TaskLanguage,
    (taskLanguage) => taskLanguage.programmingLanguage,
  )
  taskLanguage!: TaskLanguage[];

  @OneToMany(
    () => TaskDelivery,
    (taskDelivery) => taskDelivery.programmingLanguage,
  )
  taskDeliveries: TaskDelivery[];
}
