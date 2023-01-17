import { TeacherVO } from "src/User/vo/Teacher.vo";

export class ClassGroupVO {
  id: string;
  className: string;
  classDescription: string;
  instructor:TeacherVO;

  setId(id): void {
    this.id = id;
  }

  setClassName(className): void {
    this.className = className;
  }

  setInstructor(instructor):void{
    this.instructor=instructor;
  }

  setClassDescription(classDescription): void {
    this.classDescription = classDescription;
  }

  getInstructor():TeacherVO{
    return this.instructor;
  }
}
