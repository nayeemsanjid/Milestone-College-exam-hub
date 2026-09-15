import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  ExternalLink, 
  Check, 
  Copy, 
  Calendar, 
  Award, 
  HelpCircle,
  FlaskConical,
  Briefcase,
  Palette,
  BookOpen,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { SubjectExam } from '../types';

interface SubjectCardProps {
  exam: SubjectExam;
  onEditExam: (exam: SubjectExam) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ exam, onEditExam }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(exam.googleFormUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLive = exam.status === 'Live Now';
  const isUpcoming = exam.status === 'Upcoming';
  const isCompleted = exam.status === 'Completed';

  // Department Accent Styling
  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'Science':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          accent: 'border-t-blue-600',
          icon: <FlaskConical className="w-3 h-3 text-blue-600" />
        };
      case 'Commerce':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          accent: 'border-t-emerald-600',
          icon: <Briefcase className="w-3 h-3 text-emerald-600" />
        };
      case 'Arts':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          accent: 'border-t-purple-600',
          icon: <Palette className="w-3 h-3 text-purple-600" />
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          accent: 'border-t-slate-600',
          icon: <BookOpen className="w-3 h-3 text-slate-600" />
        };
    }
  };

  const deptStyle = getDeptBadge(exam.department);

  return (
    <div 
      id={`subject-card-${exam.id}`}
      className={`relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md ${
        isLive 
          ? 'border-emerald-300 ring-2 ring-emerald-500/15' 
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top Border Accent Line */}
      <div className={`h-1.5 w-full ${
        isLive ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
        exam.department === 'Science' ? 'bg-blue-600' :
        exam.department === 'Commerce' ? 'bg-emerald-600' :
        exam.department === 'Arts' ? 'bg-purple-600' : 'bg-slate-700'
      }`} />

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Department, Class & Code Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${deptStyle.bg}`}>
                {deptStyle.icon}
                <span>{exam.department}</span>
              </span>

              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                {exam.classLevel}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200" title="Subject Code">
                Code: {exam.code}
              </span>

              {/* Quick Edit Icon for Teachers/Admins */}
              <button
                onClick={() => onEditExam(exam)}
                className="p-1 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors opacity-70 group-hover:opacity-100"
                title="Edit Google Form Link or Details"
                aria-label={`Edit ${exam.title} exam details`}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subject Title & Paper */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-800 transition-colors">
              {exam.title}
            </h3>
            {exam.paper && (
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {exam.paper}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            {isLive && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Now (Open for Submission)</span>
              </div>
            )}

            {isUpcoming && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Upcoming Exam</span>
              </div>
            )}

            {isCompleted && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
                <Check className="w-3.5 h-3.5 text-slate-500" />
                <span>Exam Closed</span>
              </div>
            )}
          </div>

          {/* Exam Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="truncate">{exam.examDate}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="truncate">{exam.timeSlot}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{exam.duration}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <Award className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{exam.totalMarks} Marks</span>
            </div>
          </div>

          {/* Question Format */}
          <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Format:</span>
            <span className="truncate text-slate-600">{exam.questionType}</span>
          </div>

          {/* Instructions Snippet if present */}
          {exam.instructions && (
            <p className="text-[11px] text-slate-400 italic line-clamp-1 mb-2">
              Note: {exam.instructions}
            </p>
          )}
        </div>

        {/* Action Button: Start Exam (Opens Google Form) */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-2">
            {/* Primary Action Button */}
            {isLive ? (
              <a
                id={`btn-start-exam-${exam.id}`}
                href={exam.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all group/btn"
              >
                <span>Start Exam</span>
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            ) : isUpcoming ? (
              <a
                id={`btn-preview-exam-${exam.id}`}
                href={exam.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-amber-500/90 hover:bg-amber-600 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
                title="Google Form will accept responses at scheduled time"
              >
                <span>Preview Form</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <a
                id={`btn-closed-exam-${exam.id}`}
                href={exam.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Form Closed</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            )}

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center transition-all ${
                copied 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
              title="Copy Google Form URL to Clipboard"
              aria-label="Copy Google Form URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Google Forms
            </span>
            <span>Opens in new tab ↗</span>
          </div>
        </div>
      </div>
    </div>
  );
};
