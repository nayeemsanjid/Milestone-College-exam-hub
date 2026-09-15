import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileCheck2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { COLLEGE_INFO } from '../config/examData';

interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamInstructionsModal: React.FC<ExamInstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Milestone College Examination Guidelines
              </h2>
              <p className="text-xs text-slate-400">
                Official rules for online term & assessment tests
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
            <div className="p-1 bg-blue-600 text-white rounded-full mt-0.5 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">1. Google Account & Verification</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ensure you are logged into your browser with your designated Google ID or official institutional email before opening any exam link. Each Google Form permits strictly one submission per student.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <div className="p-1 bg-emerald-600 text-white rounded-full mt-0.5 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">2. Mandatory Student Credentials</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                In Section 1 of the Google Form, accurately fill out your <strong>College Roll Number</strong>, <strong>Student ID</strong>, <strong>Shift (Morning/Day)</strong>, and <strong>Section</strong>. Incomplete or faulty credentials may result in unrecorded results.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl">
            <div className="p-1 bg-amber-600 text-white rounded-full mt-0.5 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">3. Punctuality & Submission Deadlines</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Forms automatically stop accepting responses at the expiration of the allotted time. Submit your response <strong>at least 2 minutes prior to the closing bell</strong> to accommodate network latency.
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-3 p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl">
            <div className="p-1 bg-rose-600 text-white rounded-full mt-0.5 flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">4. Submission Confirmation</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                After clicking the final "Submit" button on Google Forms, verify that the confirmation screen stating <em>"Your response has been recorded"</em> is displayed. Take a screenshot for your personal records.
              </p>
            </div>
          </div>

          {/* Technical Helpline */}
          <div className="p-4 bg-slate-900 text-white rounded-xl">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Exam Emergency Helpdesk</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block">IT Cell Helpline:</span>
                <span className="font-semibold text-white">{COLLEGE_INFO.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Exam Inquiries:</span>
                <span className="font-semibold text-white">{COLLEGE_INFO.examEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
          >
            I Understand the Rules
          </button>
        </div>
      </div>
    </div>
  );
};
