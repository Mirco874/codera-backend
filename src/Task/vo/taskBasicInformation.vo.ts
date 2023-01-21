import { ProgrammingLanguageVO } from "src/ProgrammingLanguage/vo/ProgrammingLanguage.vo";

export class TaskBasicInformationVO {
  id: number;
  classId: string;
  taskTitle: string;
  taskDescription: string;
  maxScore: number;
  allowedLanguages:ProgrammingLanguageVO[];
  limitDate: Date;
}
