import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCommentDTO } from "../dto/CreateComment.dto";
import { DeliveryComment } from "../entities/DeliveryComment.entity";

@Injectable()
export class DeliveryCommentService{
    constructor(@InjectRepository(DeliveryComment) private deliveryCommentRepository: Repository<DeliveryComment>){}

    findById(id:number):Promise<DeliveryComment>{
        return this.deliveryCommentRepository.findOneBy({id})
    }

    findAllByTaskDeliveryId(deliveryId:number):Promise<DeliveryComment[]>{
        const entityList=this.deliveryCommentRepository.createQueryBuilder('DeliveryComment')
        .innerJoinAndSelect('DeliveryComment.user','User')
        .innerJoin('DeliveryComment.taskDelivery','TaskDelivery')
        .where('TaskDelivery.id=:deliveryId',{deliveryId})
        .getMany()
        return entityList;
    }

    persist(createCommentDTO:CreateCommentDTO):void{
        const entity=new DeliveryComment();
        entity.userId=createCommentDTO.userId;
        entity.deliveryId=createCommentDTO.deliveryId;
        entity.content=createCommentDTO.content;

        const currentDate = new Date();

        const currentDay = `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth() + 1}-${currentDate.getUTCDate()}`;
        const currentTime = currentDate.toISOString().substring(11, 19);
    
        entity.commentDate = currentDay;
        entity.commentTime = currentTime;

        this.deliveryCommentRepository.save(entity);
    }

    update(deliveryComment:DeliveryComment):void{
        this.deliveryCommentRepository.save(deliveryComment);
    }


    remove(deliveryComment:DeliveryComment):void{
        this.deliveryCommentRepository.remove(deliveryComment);
    }


}