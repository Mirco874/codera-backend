export class TeacherVO{
    id:number;
    fullName:string;

    getId():number{
        return this.id;
    }

    getFullName():string{
        return this.fullName;
    }

    setId(id):void{
        this.id=id;
    }

    setFullName(fullName):void{
        this.fullName=fullName;
    }

}