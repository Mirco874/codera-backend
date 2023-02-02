import { 
  IsNumber, 
  IsString 
} from "class-validator";

export class createTaskDeliveryDTO {
  @IsNumber()
  taskId: number;

  @IsNumber()
  languageId: number;
  
  @IsString()
  code: string;
}
