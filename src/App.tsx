import React, { useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_EXAMS_CONFIG, 
  INITIAL_NOTICES, 
  COLLEGE_INFO 
} from './config/examData';
import { SubjectExam, Department, ClassLevel, ExamStatus } from './types';
import { Header } from './components/Header';
import { NoticeBoard } from './components/NoticeBoard';
import { FilterBar } from './components/FilterBar';
import { SubjectCard } from './components/SubjectCard';
import { AdminConfigModal } from './components/AdminConfigModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ExamInstructionsModal } from './components/ExamInstructionsModal';
import { Footer } from './components/Footer';
import { AdminPage } from './components/AdminPage';
import { 
  isSupabaseConfigured,
  fetchExamsFromSupabase,
  updateExamInSupabase,
  seedExamsToSupabase,
  subscribeToExamChanges
} from './lib/supabase';
import { 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert,
  Lock,
  Unlock,
  LogOut,
  Radio,
  Database
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'mc_exam_hub_config_v1';
const ADMIN_SESSION_KEY = 'mc_exam_hub_admin';

export default function App() {
  // Navigation view mode ('portal' = student portal, 'admin' = admin link management console)
  const [viewMode, setViewMode] = useState<'portal' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'portal';
  });

  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);

  // Load exams from localStorage or default configuration
  const [exams, setExams] = useState<SubjectExam[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved exams config from localStorage', e);
    }
    return INITIAL_EXAMS_CONFIG;
  });

  // Admin Mode state (hidden by default for students)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [notices] = useState(INITIAL_NOTICES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'All'>('All');

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);
  const [targetExamIdForEdit, setTargetExamIdForEdit] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time synchronization with Supabase
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    let isMounted = true;

    // 1. Initial Fetch from Supabase Table
    fetchExamsFromSupabase().then((cloudExams) => {
      if (!isMounted) return;
      if (cloudExams && cloudExams.length > 0) {
        setExams(cloudExams);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudExams));
        } catch (e) {
          console.warn(e);
        }
      } else if (cloudExams && cloudExams.length === 0) {
        // First run with clean Supabase table: seed initial Milestone College data
        seedExamsToSupabase(INITIAL_EXAMS_CONFIG).then((success) => {
          if (success) {
            console.log('[Supabase] Automatically seeded default exams to table');
          }
        });
      }
    });

    // 2. Real-Time Postgres Change Listener
    const unsubscribe = subscribeToExamChanges(
      (updatedExam) => {
        setExams((prev) => {
          const next = prev.map((e) => (e.id === updatedExam.id ? updatedExam : e));
          if (!prev.some((e) => e.id === updatedExam.id)) {
            next.push(updatedExam);
          }
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          } catch (e) {
            console.warn(e);
          }
          return next;
        });
        showToast(`⚡ Real-time: ${updatedExam.title} updated to "${updatedExam.status}"`);
      },
      (newExam) => {
        setExams((prev) => {
          if (prev.some((e) => e.id === newExam.id)) return prev;
          const next = [...prev, newExam];
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          } catch (e) {
            console.warn(e);
          }
          return next;
        });
        showToast(`⚡ Real-time: Added new exam "${newExam.title}"`);
      }
    );

    if (unsubscribe) {
      setIsRealtimeConnected(true);
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        if (isAdmin) {
          setViewMode('admin');
        } else {
          setIsAdminLoginOpen(true);
        }
      } else {
        setViewMode('portal');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdmin]);

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setIsAdminLoginOpen(false);
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch (e) {
      console.warn(e);
    }
    setViewMode('admin');
    window.location.hash = 'admin';
    showToast('Admin Mode unlocked! You can now edit Google Form links live.');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setIsAdminOpen(false);
    setViewMode('portal');
    window.location.hash = '';
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.warn(e);
    }
    showToast('Exited Admin Mode. Regular student view active.');
  };

  const handleOpenAdminPage = () => {
    if (isAdmin) {
      setViewMode('admin');
      window.location.hash = 'admin';
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleBackToPortal = () => {
    setViewMode('portal');
    window.location.hash = '';
  };

  // Save to localStorage and Supabase whenever exams state changes
  const handleSaveExams = async (updated: SubjectExam[]) => {
    setExams(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      showToast('Config updated! Google Form links and statuses saved.');
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }

    if (isSupabaseConfigured()) {
      await seedExamsToSupabase(updated);
    }
  };

  const handleUpdateSingleExam = async (updated: SubjectExam) => {
    setExams((prev) => {
      const next = prev.map((e) => (e.id === updated.id ? updated : e));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });

    if (isSupabaseConfigured()) {
      await updateExamInSupabase(updated);
    }
  };

  const handleResetExams = () => {
    if (confirm('Reset all exam links and statuses to original Milestone College defaults?')) {
      setExams(INITIAL_EXAMS_CONFIG);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      if (isSupabaseConfigured()) {
        seedExamsToSupabase(INITIAL_EXAMS_CONFIG);
      }
      showToast('Reset to default Milestone College configuration.');
    }
  };

  const handleEditSingleExam = (exam: SubjectExam) => {
    setTargetExamIdForEdit(exam.id);
    setIsAdminOpen(true);
  };

  // Counts
  const liveExamsCount = useMemo(() => {
    return exams.filter((e) => e.status === 'Live Now').length;
  }, [exams]);

  // Filtered list
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchDept = selectedDept === 'All' || exam.department === selectedDept;
      const matchClass = selectedClass === 'All' || exam.classLevel === selectedClass || exam.classLevel === 'All Classes';
      const matchStatus = selectedStatus === 'All' || exam.status === selectedStatus;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        exam.title.toLowerCase().includes(q) ||
        exam.code.toLowerCase().includes(q) ||
        exam.department.toLowerCase().includes(q) ||
        (exam.paper && exam.paper.toLowerCase().includes(q)) ||
        exam.questionType.toLowerCase().includes(q);

      return matchDept && matchClass && matchStatus && matchSearch;
    });
  }, [exams, selectedDept, selectedClass, selectedStatus, searchQuery]);

  const handleResetFilters = () => {
    setSelectedDept('All');
    setSelectedClass('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  // If admin console mode is selected
  if (viewMode === 'admin' && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AdminPage
          exams={exams}
          onUpdateExam={handleUpdateSingleExam}
          onUpdateAllExams={handleSaveExams}
          onBackToPortal={handleBackToPortal}
          onLogout={handleAdminLogout}
          showToast={showToast}
          isRealtimeConnected={isRealtimeConnected}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header / Navbar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        liveExamsCount={liveExamsCount}
        onOpenAdmin={() => {
          setTargetExamIdForEdit(null);
          setIsAdminOpen(true);
        }}
        onOpenAdminPage={handleOpenAdminPage}
        onOpenInstructions={() => setIsGuidelinesOpen(true)}
        isAdmin={isAdmin}
        onAdminLogoutClick={handleAdminLogout}
      />

      {/* Admin Mode Floating Indicator Banner */}
      {isAdmin && (
        <div className="bg-slate-900 border-b border-blue-900 text-white px-4 py-2 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-400">Admin Mode Active:</span>
              <span className="text-slate-300">
                Logged in as Exam Administrator. You can edit links inline or open the Admin Console.
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleOpenAdminPage}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-emerald-200" />
                <span>Admin Console</span>
              </button>
              <button
                onClick={() => {
                  setTargetExamIdForEdit(null);
                  setIsAdminOpen(true);
                }}
                className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Quick Modal
              </button>
              <button
                onClick={handleAdminLogout}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Board Section */}
      <NoticeBoard
        notices={notices}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
      />

      {/* Quick Department / Portal Intro Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Academic Hub:</span>
            <span>HSC Term Examinations & Virtual Assessments</span>
          </div>

          <div className="flex items-center gap-3">
            {isRealtimeConnected && (
              <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Supabase Sync</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {liveExamsCount} Active Form{liveExamsCount !== 1 ? 's' : ''}
            </span>
            <span className="text-slate-300">|</span>
            <span>{exams.length} Total Subjects</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalCount={exams.length}
        filteredCount={filteredExams.length}
        onResetFilters={handleResetFilters}
      />

      {/* Subject Grid / Exam Hub Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1 w-full">
        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => (
              <SubjectCard
                key={exam.id}
                exam={exam}
                onEditExam={handleEditSingleExam}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs my-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching subjects found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find any exams matching your search "{searchQuery}" with the current filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Search & Filters</span>
            </button>
          </div>
        )}

        {/* Quick Helper Banner for Teachers / Admins - Only shown when Admin is logged in */}
        {isAdmin && (
          <div className="mt-10 p-5 bg-gradient-to-r from-blue-50 via-slate-50 to-emerald-50 rounded-2xl border border-blue-200/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider">
                  Teacher & Admin Tools
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  Need to link your Google Form or change exam timings?
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Easily update Google Form URLs and subject status using the live config manager or open the full Admin Console.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleOpenAdminPage}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Open Admin Console</span>
              </button>
              <button
                onClick={() => {
                  setTargetExamIdForEdit(null);
                  setIsAdminOpen(true);
                }}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                Quick Modal
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        onOpenAdmin={() => {
          setTargetExamIdForEdit(null);
          setIsAdminOpen(true);
        }}
        onOpenAdminPage={handleOpenAdminPage}
        isAdmin={isAdmin}
        onAdminLoginClick={() => setIsAdminLoginOpen(true)}
        onAdminLogoutClick={handleAdminLogout}
      />

      {/* Admin Login Password Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Admin / Link Config Modal */}
      <AdminConfigModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        exams={exams}
        onSaveExams={handleSaveExams}
        onResetExams={handleResetExams}
        targetExamId={targetExamIdForEdit}
      />

      {/* Exam Instructions / Guidelines Modal */}
      <ExamInstructionsModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />
    </div>
  );
}
