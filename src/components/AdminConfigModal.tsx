import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Trash2, 
  SlidersHorizontal,
  Code,
  AlertCircle
} from 'lucide-react';
import { SubjectExam, ExamStatus, Department, ClassLevel } from '../types';

interface AdminConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  exams: SubjectExam[];
  onSaveExams: (updated: SubjectExam[]) => void;
  onResetExams: () => void;
  targetExamId?: string | null;
}

export const AdminConfigModal: React.FC<AdminConfigModalProps> = ({
  isOpen,
  onClose,
  exams,
  onSaveExams,
  onResetExams,
  targetExamId,
}) => {
  const [localExams, setLocalExams] = useState<SubjectExam[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'codeView'>('editor');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLocalExams(JSON.parse(JSON.stringify(exams)));
      setSaveSuccess(false);
    }
  }, [isOpen, exams]);

  if (!isOpen) return null;

  const handleFieldChange = (id: string, field: keyof SubjectExam, value: any) => {
    setLocalExams((prev) =>
      prev.map((exam) => (exam.id === id ? { ...exam, [field]: value } : exam))
    );
  };

  const handleSave = () => {
    onSaveExams(localExams);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddNewSubject = () => {
    const newId = `custom-${Date.now()}`;
    const newSubject: SubjectExam = {
      id: newId,
      title: 'New Subject Title',
      paper: '1st Paper',
      code: '100',
      department: 'Science',
      classLevel: 'Class 12',
      status: 'Live Now',
      googleFormUrl: 'https://docs.google.com/forms/d/e/.../viewform',
      examDate: 'Today, Oct 15',
      timeSlot: '10:00 AM - 11:30 AM',
      duration: '90 Mins',
      totalMarks: 50,
      questionType: '25 MCQ + Creative',
      instructions: 'Ensure proper registration details are entered.'
    };
    setLocalExams((prev) => [newSubject, ...prev]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this subject from the portal?')) {
      setLocalExams((prev) => prev.filter((exam) => exam.id !== id));
    }
  };

  const generateJsCode = () => {
    return `// =========================================================================
// MILESTONE COLLEGE EXAM PORTAL CONFIGURATION
// Copy & paste this array directly into your code or standalone HTML file
// =========================================================================
const EXAM_CONFIG = ${JSON.stringify(localExams, null, 2)};`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateJsCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredList = localExams.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Exam Hub Link & Config Manager
              </h2>
              <p className="text-xs text-slate-400">
                Update Google Form links, toggle 'Live Now' status, or copy JavaScript config
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Interactive Editor
            </button>
            <button
              onClick={() => setActiveTab('codeView')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'codeView'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Export JS Array</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNewSubject}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>

            <button
              onClick={onResetExams}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium flex items-center gap-1 transition-colors"
              title="Reset to default initial subjects"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>All changes have been applied to the portal and saved to your browser!</span>
            </div>
          )}

          {activeTab === 'editor' ? (
            <div>
              {/* Quick Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Filter subjects to edit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-3">
                {filteredList.map((exam) => (
                  <div
                    key={exam.id}
                    className={`p-4 rounded-xl border transition-all ${
                      exam.id === targetExamId
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {exam.title}
                        </span>
                        {exam.paper && (
                          <span className="text-xs text-slate-500">
                            ({exam.paper})
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
                          Code: {exam.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Switcher */}
                        <label className="text-xs font-semibold text-slate-500">Status:</label>
                        <select
                          value={exam.status}
                          onChange={(e) =>
                            handleFieldChange(exam.id, 'status', e.target.value as ExamStatus)
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            exam.status === 'Live Now'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : exam.status === 'Upcoming'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="Live Now">Live Now</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Completed">Completed</option>
                        </select>

                        {/* Delete Subject */}
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Form Link Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-700">
                          Google Form URL:
                        </label>
                        <a
                          href={exam.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Test Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <input
                        type="url"
                        value={exam.googleFormUrl}
                        onChange={(e) =>
                          handleFieldChange(exam.id, 'googleFormUrl', e.target.value)
                        }
                        placeholder="https://docs.google.com/forms/d/e/.../viewform"
                        className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                      />
                    </div>

                    {/* Quick Metadata Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Department:</span>
                        <select
                          value={exam.department}
                          onChange={(e) =>
                            handleFieldChange(exam.id, 'department', e.target.value as Department)
                          }
                          className="w-full py-1 px-2 border rounded bg-white text-slate-700 text-xs"
                        >
                          <option value="Science">Science</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Arts">Humanities / Arts</option>
                          <option value="Compulsory">Compulsory</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Class:</span>
                        <select
                          value={exam.classLevel}
                          onChange={(e) =>
                            handleFieldChange(exam.id, 'classLevel', e.target.value as ClassLevel)
                          }
                          className="w-full py-1 px-2 border rounded bg-white text-slate-700 text-xs"
                        >
                          <option value="Class 11">Class 11</option>
                          <option value="Class 12">Class 12</option>
                          <option value="All Classes">All Classes</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Time Slot:</span>
                        <input
                          type="text"
                          value={exam.timeSlot}
                          onChange={(e) =>
                            handleFieldChange(exam.id, 'timeSlot', e.target.value)
                          }
                          className="w-full py-1 px-2 border rounded bg-white text-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">
                  This is the JavaScript array representing all current subjects, statuses, and form links.
                </p>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JS Array</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-[450px]">
                {generateJsCode()}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 hidden sm:block">
            {localExams.length} subject entries configured
          </p>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              id="btn-save-admin-config"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
