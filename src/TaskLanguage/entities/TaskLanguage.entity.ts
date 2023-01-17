
import { ProgrammingLanguage } from "src/ProgrammingLanguage/entities/ProgrammingLanguage.entity";
import { Task } from "src/Task/entities/Task.entity";
import {Entity,JoinColumn,ManyToOne,PrimaryColumn} from "typeorm"

@Entity({name:"task_language"})
export class TaskLanguage{
    @PrimaryColumn({name:"task_id"})
    taskId:number;

    @PrimaryColumn({name:"language_id"})
    languageId:number;

    @ManyToOne(() => Task, (task) => task.taskLanguage)
    @JoinColumn({name:"task_id"})
    task!:Task;
   
    @ManyToOne(() => ProgrammingLanguage, (programmingLanguage) => programmingLanguage.taskLanguage)
    @JoinColumn({name:"language_id"})
    programmingLanguage!:ProgrammingLanguage

}