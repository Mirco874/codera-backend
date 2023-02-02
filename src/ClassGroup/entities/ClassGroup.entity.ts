import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Task } from 'src/Task/entities/Task.entity';
import { User } from 'src/User/entities/User.entity';
import { UserClass } from 'src/UserClass/entities/UserClass.entity';

@Entity({ name: 'class_group' })
export class ClassGroup {
  
  @PrimaryColumn()
  id: string;

  @Column({ name: 'teacher_id' })
  teacherId: number;

  @Column({ name: 'class_name' })
  className: string;

  @Column({ name: 'class_description' })
  classDescription: string;

  @Column({ name: 'creation_date' })
  creationDate: Date;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Task, (task) => task.classGroup)
  tasks: Task[];

  @OneToMany(() => UserClass, (userClass) => userClass.classGroup)
  userClass!: UserClass[];
}
