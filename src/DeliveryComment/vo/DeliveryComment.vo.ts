import { UserVO } from "src/User/vo/User.vo";

export class DeliveryCommentVO{
    id:number;
    user:UserVO;
    content:string;
    commentTime:string;
    commentDate:string
}