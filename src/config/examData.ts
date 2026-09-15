import { SubjectExam, NoticeItem } from '../types';

/**
 * ============================================================================
 * 🎓 MILESTONE COLLEGE EXAM HUB - CONFIGURATION & GOOGLE FORM LINKS
 * ============================================================================
 * 
 * Teachers & Administrators:
 * You can easily update subject titles, exam status, and Google Form URLs here.
 * 
 * Status Options:
 * - 'Live Now'   : Activates the primary green 'Start Exam' button (opens Google Form)
 * - 'Upcoming'   : Shows upcoming notice with schedule and starts countdown
 * - 'Completed'  : Archives the exam once submission window has closed
 * ============================================================================
 */

export const INITIAL_EXAMS_CONFIG: SubjectExam[] = [
  // --------------------------------------------------------------------------
  // 🔬 SCIENCE DEPARTMENT
  // --------------------------------------------------------------------------
  {
    id: 'phy-1',
    title: 'Physics',
    paper: '1st Paper',
    code: '174',
    department: 'Science',
    classLevel: 'Class 12',
    status: 'Live Now',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScX_sample_physics1/viewform',
    examDate: 'Today, Oct 15',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: '25 MCQ + 2 Creative',
    instructions: 'Keep your Milestone College Student ID ready. Submit before the timer expires.'
  },
  {
    id: 'chem-1',
    title: 'Chemistry',
    paper: '1st Paper',
    code: '176',
    department: 'Science',
    classLevel: 'Class 12',
    status: 'Live Now',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScY_sample_chemistry1/viewform',
    examDate: 'Today, Oct 15',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: '25 MCQ + 2 Creative',
    instructions: 'Periodic table references allowed in standard format. Upload calculations if required.'
  },
  {
    id: 'math-1',
    title: 'Higher Mathematics',
    paper: '1st Paper',
    code: '265',
    department: 'Science',
    classLevel: 'Class 12',
    status: 'Upcoming',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScZ_sample_highermath/viewform',
    examDate: 'Tomorrow, Oct 16',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: '25 MCQ + 2 Creative',
    instructions: 'Scientific calculators allowed (FX-991EX or non-programmable).'
  },
  {
    id: 'bio-1',
    title: 'Biology',
    paper: '1st Paper (Botany)',
    code: '178',
    department: 'Science',
    classLevel: 'Class 11',
    status: 'Upcoming',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdA_sample_biology1/viewform',
    examDate: 'Oct 17, 2026',
    timeSlot: '11:00 AM - 12:30 PM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: '25 MCQ + 25 CQ',
    instructions: 'Clear anatomical diagrams to be uploaded as PDF if asked.'
  },
  {
    id: 'phy-2',
    title: 'Physics',
    paper: '2nd Paper',
    code: '175',
    department: 'Science',
    classLevel: 'Class 11',
    status: 'Upcoming',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdB_sample_physics2/viewform',
    examDate: 'Oct 18, 2026',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: '25 MCQ + 2 Creative',
    instructions: 'Thermodynamics & Optics problem sets.'
  },

  // --------------------------------------------------------------------------
  // 🌐 COMPULSORY SUBJECTS (ALL DEPARTMENTS)
  // --------------------------------------------------------------------------
  {
    id: 'ict-1',
    title: 'ICT (Information & Communication Tech)',
    paper: 'Compulsory Paper',
    code: '275',
    department: 'Compulsory',
    classLevel: 'All Classes',
    status: 'Live Now',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdC_sample_ict/viewform',
    examDate: 'Today, Oct 15',
    timeSlot: '10:00 AM - 11:15 AM',
    duration: '75 Mins',
    totalMarks: 50,
    questionType: '50 MCQ',
    instructions: 'All students must participate. Check your college network connection.'
  },
  {
    id: 'eng-1',
    title: 'English',
    paper: '1st Paper',
    code: '107',
    department: 'Compulsory',
    classLevel: 'Class 11',
    status: 'Upcoming',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdD_sample_english1/viewform',
    examDate: 'Tomorrow, Oct 16',
    timeSlot: '02:00 PM - 03:30 PM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'Reading & Grammar Comprehension',
    instructions: 'Ensure accurate spelling and grammar in text fields.'
  },
  {
    id: 'ban-1',
    title: 'Bangla',
    paper: '1st Paper',
    code: '101',
    department: 'Compulsory',
    classLevel: 'Class 12',
    status: 'Completed',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdE_sample_bangla1/viewform',
    examDate: 'Yesterday, Oct 14',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'MCQ & Creative Writing',
    instructions: 'Exam closed. Marks will be published on the Milestone student portal.'
  },
  {
    id: 'eng-2',
    title: 'English',
    paper: '2nd Paper',
    code: '108',
    department: 'Compulsory',
    classLevel: 'Class 12',
    status: 'Upcoming',
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdF_sample_english2/viewform',
    examDate: 'Oct 19, 2026',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'Formal Composition & Grammar',
    instructions: 'Composition to be written directly or uploaded.'
  },

  // --------------------------------------------------------------------------
  // 📊 COMMERCE / BUSINESS STUDIES DEPARTMENT
  // --------------------------------------------------------------------------
  {
    id: 'acc-1',
    title: 'Accounting',
    paper: '1st Paper',
    code: '253',
    department: 'Commerce',
    classLevel: 'Class 12',
    status: 'Live Now',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdG_sample_accounting1/viewform',
    examDate: 'Today, Oct 15',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'Financial Statement & Journal Ledger MCQ',
    instructions: 'Worksheet and ledger working calculations to be photographed if required.'
  },
  {
    id: 'bom-1',
    title: 'Business Organization & Management',
    paper: '1st Paper',
    code: '277',
    department: 'Commerce',
    classLevel: 'Class 11',
    status: 'Upcoming',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdH_sample_businessorg/viewform',
    examDate: 'Tomorrow, Oct 16',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'Case Studies & Objective Questions',
    instructions: 'Review Chapter 1 to 5 of the NCTB syllabus.'
  },
  {
    id: 'fin-1',
    title: 'Finance, Banking & Insurance',
    paper: '1st Paper',
    code: '292',
    department: 'Commerce',
    classLevel: 'Class 12',
    status: 'Upcoming',
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdI_sample_finance/viewform',
    examDate: 'Oct 18, 2026',
    timeSlot: '02:00 PM - 03:30 PM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'Time Value of Money & Financial Markets',
    instructions: 'Formula sheet is attached within the Google Form.'
  },

  // --------------------------------------------------------------------------
  // 🎨 ARTS / HUMANITIES DEPARTMENT
  // --------------------------------------------------------------------------
  {
    id: 'civ-1',
    title: 'Civics & Good Governance',
    paper: '1st Paper',
    code: '269',
    department: 'Arts',
    classLevel: 'Class 11',
    status: 'Live Now',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdJ_sample_civics/viewform',
    examDate: 'Today, Oct 15',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: '30 MCQ + 2 Conceptual Questions',
    instructions: 'Citizen rights & constitutional governance topics.'
  },
  {
    id: 'eco-1',
    title: 'Economics',
    paper: '1st Paper',
    code: '109',
    department: 'Arts',
    classLevel: 'Class 12',
    status: 'Upcoming',
    // 🔗 Paste your Google Form URL here:
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdK_sample_economics/viewform',
    examDate: 'Tomorrow, Oct 16',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'Microeconomics Elasticity & Market Curves',
    instructions: 'Graph analysis included in form items.'
  },
  {
    id: 'hist-1',
    title: 'Islamic History & Culture',
    paper: '1st Paper',
    code: '267',
    department: 'Arts',
    classLevel: 'Class 11',
    status: 'Upcoming',
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdL_sample_history/viewform',
    examDate: 'Oct 20, 2026',
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '90 Mins',
    totalMarks: 50,
    questionType: 'Historical Chronology & Critical Essay',
    instructions: 'Reference authentic historical timeline as instructed in class.'
  }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'not-1',
    title: 'HSC Term Examination 2026 Routine Published',
    date: 'Oct 14, 2026',
    category: 'Urgent',
    summary: 'The ongoing term examinations are active. Ensure your Google account is signed in with your official Milestone College email ID (@milestonecollege.edu.bd).',
    details: 'Exams strictly open at scheduled times. Any submissions made past the cutoff timestamp will be penalized. For technical issues, contact the IT Cell immediately.',
    isNew: true
  },
  {
    id: 'not-2',
    title: 'Crucial Google Form Submission Instructions',
    date: 'Oct 13, 2026',
    category: 'Instruction',
    summary: 'Every student must input their Roll Number, College ID, Section, and Shift correctly in Section 1 of each Google Form before attempting the questions.',
    details: 'Do not refresh your tab while filling out the Google Form. Make sure you see the "Your response has been recorded" confirmation page before closing.'
  },
  {
    id: 'not-3',
    title: 'Technical Support & Helpline Desk Available',
    date: 'Oct 12, 2026',
    category: 'Schedule',
    summary: 'Helpdesk lines are open from 9:30 AM to 4:00 PM on all exam days. WhatsApp Hotline: +880 1711-234567.',
    details: 'Teachers on invigilation duty are monitoring submissions live.'
  }
];

export const COLLEGE_INFO = {
  name: 'Milestone College',
  tagline: 'Committed to Quality Education',
  portalName: 'Milestone College Exam Hub',
  address: 'Sector 11 & 12, Uttara Model Town, Dhaka-1230, Bangladesh',
  phone: '+880 2-8957542 / +880 1711-000000',
  email: 'info@milestonecollege.edu.bd',
  examEmail: 'examcell@milestonecollege.edu.bd',
  hours: 'Sat - Thu: 8:00 AM - 5:00 PM',
  portalVersion: 'v2.4.0 (2026 Session)'
};
