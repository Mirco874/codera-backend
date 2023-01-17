import { TaskBasicInformationVO } from "src/Task/vo/taskBasicInformation.vo";
import { UserVO } from "src/User/vo/User.vo";

export class TaskDeliveryBasicInformationVO{
    id:number;
    user:UserVO;
    task:TaskBasicInformationVO;
    score:number;
    deliveryDate:string;
    deliveryTime:string;
}