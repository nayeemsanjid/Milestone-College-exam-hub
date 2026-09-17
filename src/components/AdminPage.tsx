import React, { useState } from 'react';
import { 
  SubjectExam, 
  ExamStatus, 
  Department, 
  ClassLevel 
} from '../types';
import { 
  ArrowLeft, 
  Save, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Database, 
  Sparkles, 
  RefreshCw, 
  Search, 
  Filter, 
  Lock, 
  LogOut,
  Radio,
  Clock,
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  updateExamInSupabase, 
  seedExamsToSupabase 
} from '../lib/supabase';
import { INITIAL_EXAMS_CONFIG } from '../config/examData';

interface AdminPageProps {
  exams: SubjectExam[];
  onUpdateExam: (updated: SubjectExam) => void;
  onUpdateAllExams: (all: SubjectExam[]) => void;
  onBackToPortal: () => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
  isRealtimeConnected: boolean;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  exams,
  onUpdateExam,
  onUpdateAllExams,
  onBackToPortal,
  onLogout,
  showToast,
  isRealtimeConnected,
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ExamStatus | 'All'>('All');
  const [classFilter, setClassFilter] = useState<ClassLevel | 'All'>('All');
  
  // Local state for edits in progress
  const [editedExams, setEditedExams] = useState<{ [id: string]: SubjectExam }>(
    () => exams.reduce((acc, exam) => ({ ...acc, [exam.id]: { ...exam } }), {})
  );
  
  const [savingId, setSavingId] = useState<string | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync edits if external exams change (e.g. from realtime update)
  React.useEffect(() => {
    setEditedExams((prev) => {
      const next = { ...prev };
      exams.forEach((e) => {
        // Only update if not actively being edited by the user
        if (!next[e.id]) {
          next[e.id] = { ...e };
        }
      });
      return next;
    });
  }, [exams]);

  const handleFieldChange = (id: string, field: keyof SubjectExam, value: any) => {
    setEditedExams((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveRow = async (id: string) => {
    const examToSave = editedExams[id];
    if (!examToSave) return;

    setSavingId(id);

    try {
      if (isSupabaseConfigured()) {
        const success = await updateExamInSupabase(examToSave);
        if (success) {
          onUpdateExam(examToSave);
          setJustSavedId(id);
          setTimeout(() => setJustSavedId(null), 2500);
          showToast(`Saved ${examToSave.title} to Supabase! Live site updated instantly.`);
        } else {
          // Fallback to local
          onUpdateExam(examToSave);
          showToast(`Saved locally (Supabase write failed).`);
        }
      } else {
        onUpdateExam(examToSave);
        setJustSavedId(id);
        setTimeout(() => setJustSavedId(null), 2500);
        showToast(`Saved ${examToSave.title} locally. (Set Supabase env vars in Netlify for global sync)`);
      }
    } catch (e) {
      console.error(e);
      showToast('Error saving changes');
    } finally {
      setSavingId(null);
    }
  };

  const handleSeedDefaultsToSupabase = async () => {
    if (!isSupabaseConfigured()) {
      showToast('Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Netlify environment.');
      setShowSqlGuide(true);
      return;
    }

    if (!confirm('Seed all Milestone College default subjects and schedules to your Supabase table?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const ok = await seedExamsToSupabase(INITIAL_EXAMS_CONFIG);
      if (ok) {
        onUpdateAllExams(INITIAL_EXAMS_CONFIG);
        showToast('Successfully seeded all subjects to Supabase database!');
      } else {
        showToast('Could not seed table. Make sure the table "exams" exists with public access policy.');
        setShowSqlGuide(true);
      }
    } catch (e) {
      console.error(e);
      showToast('Error seeding Supabase');
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    const matchesDept = deptFilter === 'All' || exam.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || exam.status === statusFilter;
    const matchesClass = classFilter === 'All' || exam.classLevel === classFilter;
    const matchesSearch = !search || 
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.code.toLowerCase().includes(search.toLowerCase()) ||
      (exam.paper && exam.paper.toLowerCase().includes(search.toLowerCase()));

    return matchesDept && matchesStatus && matchesClass && matchesSearch;
  });

  const sqlCode = `-- 1. Create the 'exams' table in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  department TEXT NOT NULL,
  class_level TEXT NOT NULL,
  paper TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  google_form_url TEXT NOT NULL,
  exam_date TEXT,
  time_slot TEXT,
  duration TEXT,
  total_marks INTEGER DEFAULT 50,
  question_type TEXT,
  instructions TEXT,
  room_or_section TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Realtime updates for live instant sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.exams;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read access (students can view without login)
CREATE POLICY "Allow public read" ON public.exams
  FOR SELECT USING (true);

-- 5. Allow updates via anon key from this admin console
CREATE POLICY "Allow anon update" ON public.exams
  FOR UPDATE USING (true);

-- 6. Allow inserts via anon key
CREATE POLICY "Allow anon insert" ON public.exams
  FOR INSERT WITH CHECK (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
    showToast('SQL script copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between font-sans">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Return to Student Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-blue-600/30 text-blue-400">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <h1 className="text-base font-bold text-white tracking-tight">
                  Milestone College <span className="text-emerald-400">Admin Console</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Update Google Form links & exam statuses dynamically without redeploying code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Connection Status Badge */}
            {isSupabaseConfigured() ? (
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                title={isRealtimeConnected ? "Connected to Supabase Realtime" : "Connected to Supabase"}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Supabase Live Sync</span>
              </div>
            ) : (
              <button
                onClick={() => setShowSqlGuide(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                title="Click to view setup guide"
              >
                <Database className="w-3 h-3 text-amber-400" />
                <span>Offline Mode (Connect Supabase)</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        
        {/* Supabase Setup Banner / Accordion Guide */}
        <div className="mb-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div 
            onClick={() => setShowSqlGuide(!showSqlGuide)}
            className="p-4 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Supabase Dynamic Sync Setup for Netlify</span>
                  {isSupabaseConfigured() ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      Configured
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40">
                      Action Required
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-300">
                  {isSupabaseConfigured() 
                    ? 'Connected. Any changes you save here broadcast instantly to all students without reloading.'
                    : 'Click to view the SQL table script and Netlify environment variables.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSqlGuide(!showSqlGuide);
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white flex items-center gap-1"
              >
                <span>{showSqlGuide ? 'Hide Guide' : 'View SQL & Guide'}</span>
                {showSqlGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showSqlGuide && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold inline-flex items-center justify-center mb-1.5 text-[11px]">1</span>
                  <h4 className="font-bold text-slate-900 mb-1">Create Supabase Table</h4>
                  <p className="text-slate-500 text-[11px]">
                    Go to <a href="https://database.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Supabase.com</a>, open your project's <strong>SQL Editor</strong>, and run the script below.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold inline-flex items-center justify-center mb-1.5 text-[11px]">2</span>
                  <h4 className="font-bold text-slate-900 mb-1">Set Netlify Env Vars</h4>
                  <p className="text-slate-500 text-[11px]">
                    In Netlify, navigate to <strong>Site configuration &gt; Environment variables</strong> and add:
                    <br />
                    <code className="bg-slate-100 text-blue-700 font-mono px-1 rounded">VITE_SUPABASE_URL</code>
                    <br />
                    <code className="bg-slate-100 text-blue-700 font-mono px-1 rounded">VITE_SUPABASE_ANON_KEY</code>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold inline-flex items-center justify-center mb-1.5 text-[11px]">3</span>
                  <h4 className="font-bold text-slate-900 mb-1">Seed Initial Data</h4>
                  <p className="text-slate-500 text-[11px]">
                    Click the <strong>"Seed All Subjects"</strong> button below to automatically populate all Milestone College subjects and schedules into Supabase.
                  </p>
                </div>
              </div>

              {/* SQL Snippet box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 text-xs">Run this SQL in Supabase SQL Editor:</span>
                  <button
                    onClick={copySqlToClipboard}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
                  {sqlCode}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Tip: Once configured, all student devices will reflect Google Form link updates in real-time without refreshing!
                </div>
                <button
                  onClick={handleSeedDefaultsToSupabase}
                  disabled={isSeeding}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSeeding ? 'Seeding...' : 'Seed All Subjects to Supabase'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs mb-6 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Manage Subject Google Form Links ({filteredExams.length} of {exams.length})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Seed Button */}
              {isSupabaseConfigured() && (
                <button
                  onClick={handleSeedDefaultsToSupabase}
                  disabled={isSeeding}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                  title="Initialize or overwrite Supabase table with all default subjects"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>Sync Defaults to Supabase</span>
                </button>
              )}

              <button
                onClick={onBackToPortal}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                View Live Student Site
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject or code..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Departments</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
              <option value="Compulsory">Compulsory</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Classes</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="Live Now">🟢 Live Now</option>
              <option value="Upcoming">🟡 Upcoming</option>
              <option value="Completed">⚪ Completed</option>
            </select>
          </div>
        </div>

        {/* Exam Link Rows / Editor List */}
        <div className="space-y-4">
          {filteredExams.map((exam) => {
            const currentEdit = editedExams[exam.id] || exam;
            const isSavingThis = savingId === exam.id;
            const wasJustSaved = justSavedId === exam.id;
            const hasUnsavedChanges = 
              currentEdit.googleFormUrl !== exam.googleFormUrl ||
              currentEdit.status !== exam.status ||
              currentEdit.title !== exam.title;

            return (
              <div
                key={exam.id}
                id={`admin-card-${exam.id}`}
                className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                  currentEdit.status === 'Live Now'
                    ? 'border-emerald-300 ring-1 ring-emerald-400/20'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Accent Top Strip */}
                <div
                  className={`h-1 w-full ${
                    currentEdit.status === 'Live Now'
                      ? 'bg-emerald-500'
                      : currentEdit.status === 'Upcoming'
                      ? 'bg-amber-400'
                      : 'bg-slate-300'
                  }`}
                />

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Subject Info */}
                    <div className="space-y-1.5 min-w-[240px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {exam.department}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {exam.classLevel}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Code: <strong>{exam.code}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={currentEdit.title}
                          onChange={(e) => handleFieldChange(exam.id, 'title', e.target.value)}
                          className="font-bold text-slate-900 text-base bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-600 rounded px-1 -ml-1 border border-transparent hover:border-slate-200"
                        />
                        {exam.paper && (
                          <span className="text-xs font-medium text-slate-500">
                            ({exam.paper})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{exam.examDate}</span>
                        <span>•</span>
                        <span>{exam.timeSlot}</span>
                        <span>•</span>
                        <span>{exam.totalMarks} Marks</span>
                      </div>
                    </div>

                    {/* Status Toggle Radio/Buttons */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Exam Status
                      </label>
                      <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleFieldChange(exam.id, 'status', 'Live Now')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                            currentEdit.status === 'Live Now'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${currentEdit.status === 'Live Now' ? 'bg-white animate-pulse' : 'bg-emerald-500'}`}></span>
                          <span>Live Now</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFieldChange(exam.id, 'status', 'Upcoming')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            currentEdit.status === 'Upcoming'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          Upcoming
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFieldChange(exam.id, 'status', 'Completed')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            currentEdit.status === 'Completed'
                              ? 'bg-slate-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Completed
                        </button>
                      </div>
                    </div>

                    {/* Google Form URL Input & Action Buttons */}
                    <div className="flex-1 max-w-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Google Form URL
                        </label>
                        <a
                          href={currentEdit.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                        >
                          <span>Test Form Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          required
                          value={currentEdit.googleFormUrl}
                          onChange={(e) => handleFieldChange(exam.id, 'googleFormUrl', e.target.value)}
                          placeholder="https://docs.google.com/forms/d/e/.../viewform"
                          className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                        />

                        {/* Save Button */}
                        <button
                          type="button"
                          onClick={() => handleSaveRow(exam.id)}
                          disabled={isSavingThis}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs flex-shrink-0 ${
                            wasJustSaved
                              ? 'bg-emerald-600 text-white'
                              : hasUnsavedChanges
                              ? 'bg-blue-700 hover:bg-blue-800 text-white ring-2 ring-blue-400/40'
                              : 'bg-slate-800 hover:bg-slate-900 text-white'
                          }`}
                        >
                          {wasJustSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Saved!</span>
                            </>
                          ) : isSavingThis ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>{hasUnsavedChanges ? 'Save Link' : 'Saved'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {filteredExams.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium text-sm">No subjects match the selected filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setDeptFilter('All');
                  setClassFilter('All');
                  setStatusFilter('All');
                }}
                className="mt-3 px-4 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-4 text-center border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Milestone College Examination Cell • Administrative Console
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="text-slate-300 hover:text-white underline font-medium"
            >
              Go to Student Portal
            </button>
            <span>•</span>
            <button
              onClick={onLogout}
              className="text-rose-400 hover:text-rose-300 underline font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
