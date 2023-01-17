export class ChangeUserInformationDTO{
    
    fullName:string;
    email:string;

    getFullName():string{
        return this.fullName;
    }

    getEmail():string{
        return this.email;
    }

    setFullName(fullName):void{
        this.fullName=fullName;
    }

    setEmail(email):void{
        this.email=email;
    }


}