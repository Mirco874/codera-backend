import { IsNumber, IsString } from "class-validator";
export class SubscribeUserDTO {
  @IsNumber()
  userId: number;
  @IsString()
  classId: string;
}
