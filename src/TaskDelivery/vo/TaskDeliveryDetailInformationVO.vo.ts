import { ProgrammingLanguageVO } from "src/ProgrammingLanguage/vo/ProgrammingLanguage.vo";
import { TaskDetailInformationVO } from "src/Task/vo/taskDetailInformation.vo";
import { UserVO } from "src/User/vo/User.vo";

export class TaskDeliveryDetailInformationVO{
    id:number;
    user:UserVO;
    task:TaskDetailInformationVO;
    language:ProgrammingLanguageVO;
    code:string;
    score:number;
    deliveryDate:Date;
}