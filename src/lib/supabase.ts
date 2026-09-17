import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SubjectExam, ExamStatus, Department, ClassLevel } from '../types';

// Read Supabase environment variables configured in Netlify or .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid credentials are provided
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref')
  );
};

// Initialize Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database row representation in Supabase
export interface ExamDbRow {
  id: string;
  title: string;
  code: string;
  department: string;
  class_level: string;
  paper?: string | null;
  status: string;
  google_form_url: string;
  exam_date: string;
  time_slot: string;
  duration: string;
  total_marks: number;
  question_type: string;
  instructions?: string | null;
  room_or_section?: string | null;
  updated_at?: string;
}

// Map Database Row to React SubjectExam model
export const mapDbRowToSubjectExam = (row: ExamDbRow): SubjectExam => {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    department: (row.department as Department) || 'Compulsory',
    classLevel: (row.class_level as ClassLevel) || 'Class 12',
    paper: row.paper || undefined,
    status: (row.status as ExamStatus) || 'Upcoming',
    googleFormUrl: row.google_form_url,
    examDate: row.exam_date,
    timeSlot: row.time_slot,
    duration: row.duration,
    totalMarks: Number(row.total_marks) || 50,
    questionType: row.question_type,
    instructions: row.instructions || undefined,
    roomOrSection: row.room_or_section || undefined,
  };
};

// Map React SubjectExam model to Database Row
export const mapSubjectExamToDbRow = (exam: SubjectExam): ExamDbRow => {
  return {
    id: exam.id,
    title: exam.title,
    code: exam.code,
    department: exam.department,
    class_level: exam.classLevel,
    paper: exam.paper || null,
    status: exam.status,
    google_form_url: exam.googleFormUrl,
    exam_date: exam.examDate,
    time_slot: exam.timeSlot,
    duration: exam.duration,
    total_marks: exam.totalMarks,
    question_type: exam.questionType,
    instructions: exam.instructions || null,
    room_or_section: exam.roomOrSection || null,
    updated_at: new Date().toISOString(),
  };
};

/**
 * Fetch all exam records from Supabase
 */
export async function fetchExamsFromSupabase(): Promise<SubjectExam[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('[Supabase] Error fetching exams:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as ExamDbRow[]).map(mapDbRowToSubjectExam);
  } catch (err) {
    console.error('[Supabase] Exception fetching exams:', err);
    return null;
  }
}

/**
 * Update a single exam link and attributes in Supabase
 */
export async function updateExamInSupabase(exam: SubjectExam): Promise<boolean> {
  if (!supabase) return false;

  try {
    const row = mapSubjectExamToDbRow(exam);
    const { error } = await supabase
      .from('exams')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error updating exam:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Supabase] Exception updating exam:', err);
    return false;
  }
}

/**
 * Batch seed all default exams to Supabase
 */
export async function seedExamsToSupabase(exams: SubjectExam[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const rows = exams.map(mapSubjectExamToDbRow);
    const { error } = await supabase
      .from('exams')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error seeding exams:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Supabase] Exception seeding exams:', err);
    return false;
  }
}

/**
 * Setup Realtime Subscription to listen for instant link and status updates
 */
export function subscribeToExamChanges(
  onExamUpdated: (updatedExam: SubjectExam) => void,
  onExamInserted?: (newExam: SubjectExam) => void,
  onExamDeleted?: (deletedExamId: string) => void
): (() => void) | null {
  if (!supabase) return null;

  try {
    const channel = supabase
      .channel('public:exams:realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exams',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = mapDbRowToSubjectExam(payload.new as ExamDbRow);
            onExamUpdated(updated);
          } else if (payload.eventType === 'INSERT' && payload.new) {
            const inserted = mapDbRowToSubjectExam(payload.new as ExamDbRow);
            if (onExamInserted) onExamInserted(inserted);
            else onExamUpdated(inserted);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            if (onExamDeleted && payload.old.id) {
              onExamDeleted(payload.old.id);
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Connected to Supabase real-time
        }
      });

    // Cleanup unsubscriber function
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.error('[Supabase Realtime] Subscription error:', err);
    return null;
  }
}
