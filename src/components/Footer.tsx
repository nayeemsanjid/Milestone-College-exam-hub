import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Heart,
  Clock
} from 'lucide-react';
import { COLLEGE_INFO } from '../config/examData';

interface FooterProps {
  onOpenGuidelines: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuidelines, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      {/* Upper Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: College Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  Milestone College
                </h3>
                <p className="text-xs text-emerald-400 font-semibold">
                  Exam & Assessment Portal
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Established with the vision of offering benchmark secondary and higher secondary education in Bangladesh. This portal coordinates term examinations and virtual academic evaluations.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 font-medium">
              <span className="text-emerald-400">● </span> System Status: All exam services online
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Quick Portals & Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenGuidelines}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Student Exam Code of Conduct</span>
                </button>
              </li>
              <li>
                <a
                  href="#notice-board-section"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Term Routine & Notices
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Faculty / Admin Link Hub
                </button>
              </li>
              <li>
                <a
                  href="https://www.google.com/forms/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Google Forms Engine</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Back to Top ↑
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Milestone College Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{COLLEGE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{COLLEGE_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{COLLEGE_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{COLLEGE_INFO.hours}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Exam Cell Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Academic Security Notice
            </h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Authentic Submission</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Exam Google Forms are secured by Milestone College academic moderators. Unofficial reproduction of question sets without permission is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-slate-950 py-4 px-4 sm:px-6 border-t border-slate-800/60 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} {COLLEGE_INFO.name}. All Rights Reserved. Exam Hub {COLLEGE_INFO.portalVersion}.
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Quality • Discipline • Excellence</span>
            <span>•</span>
            <span>HSC Assessment Cell</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
