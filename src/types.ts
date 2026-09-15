export type ExamStatus = 'Live Now' | 'Upcoming' | 'Completed';

export type Department = 'Science' | 'Commerce' | 'Arts' | 'Compulsory';

export type ClassLevel = 'Class 11' | 'Class 12' | 'All Classes';

export interface SubjectExam {
  id: string;
  title: string;
  code: string;
  department: Department;
  classLevel: ClassLevel;
  paper?: string;
  status: ExamStatus;
  googleFormUrl: string;
  examDate: string;
  timeSlot: string;
  duration: string;
  totalMarks: number;
  questionType: string;
  instructions?: string;
  roomOrSection?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'Urgent' | 'Schedule' | 'Instruction';
  summary: string;
  details?: string;
  isNew?: boolean;
}
