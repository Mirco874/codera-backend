import { ProgrammingLanguageVO } from "src/ProgrammingLanguage/vo/ProgrammingLanguage.vo";

export class TaskDetailInformationVO {
  id: number;
  classId: string;
  taskTitle: string;
  taskDescription: string;
  maxScore: number;
  allowedLanguages:ProgrammingLanguageVO[];
  templateCode: string;
  limitDate: Date;
}
