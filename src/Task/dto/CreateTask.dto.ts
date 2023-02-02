import { IsISO8601, 
         IsNumber, 
         IsString 
} from "class-validator";

export class CreateTaskDTO {
  @IsString()
  classId: string;

  @IsString()
  taskTitle: string;

  @IsString()
  taskDescription: string;

  @IsNumber()
  maxScore: number;

  @IsString()
  templateCode: string;

  @IsISO8601()
  limitDate: Date;
}
