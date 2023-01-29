import { TeacherVO } from 'src/User/vo/Teacher.vo';

export class ClassGroupVO {
  id: string;
  className: string;
  classDescription: string;
  instructor: TeacherVO;
  creationDate: Date;
}
