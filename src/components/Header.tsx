import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  GraduationCap, 
  SlidersHorizontal, 
  Download, 
  HelpCircle, 
  Radio, 
  X,
  ExternalLink
} from 'lucide-react';
import { COLLEGE_INFO } from '../config/examData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  liveExamsCount: number;
  onOpenAdmin: () => void;
  onOpenInstructions: () => void;
  onDownloadStandalone: () => void;
  isAdmin?: boolean;
  onAdminLogoutClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  liveExamsCount,
  onOpenAdmin,
  onOpenInstructions,
  onDownloadStandalone,
  isAdmin = false,
  onAdminLogoutClick,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with College Info & Live Clock */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">Official Exam Portal</span>
            <span className="text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">{COLLEGE_INFO.tagline}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-medium">{currentTime || '10:00:00 AM'}</span>
              <span className="text-slate-500 hidden md:inline">({currentDate})</span>
            </div>

            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-700">
              <span className="text-slate-400">Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & College Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* College Emblem / Logo Placeholder */}
              <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-0.5 shadow-md flex items-center justify-center text-white ring-2 ring-emerald-500/20">
                <div className="w-full h-full rounded-[10px] bg-slate-900/90 flex flex-col items-center justify-center p-1 border border-blue-400/30">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                  <span className="text-[8px] font-extrabold tracking-wider text-blue-200 uppercase mt-0.5">MC</span>
                </div>
                {/* Status Dot */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                    Milestone College <span className="text-blue-700">Exam Hub</span>
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  HSC & Term Examination Assessment Portal • Uttara, Dhaka
                </p>
              </div>
            </div>

            {/* Mobile Actions Shortcut */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onOpenInstructions}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                title="Exam Guidelines"
                aria-label="Exam Guidelines"
              >
                <HelpCircle className="w-5 h-5 text-blue-700" />
              </button>
              {isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-xs flex items-center gap-1"
                  title="Edit Links / Admin Config"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Config</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Desktop Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-80 lg:w-88">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="exam-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search subject, paper, code (e.g. Physics, 174)..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Live Status Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>{liveExamsCount} Live Now</span>
              </div>

              {/* Guidelines Button */}
              <button
                id="btn-guidelines"
                onClick={onOpenInstructions}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="View Rules & Instructions"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
                <span>Exam Rules</span>
              </button>

              {/* Admin Link Config Button - Only visible when Admin is logged in */}
              {isAdmin && (
                <button
                  id="btn-admin-config"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
                  title="Edit Google Form Links and Status"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Edit Links</span>
                </button>
              )}

              {/* Standalone HTML Download Button */}
              <button
                id="btn-download-standalone"
                onClick={onDownloadStandalone}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                title="Download complete standalone HTML file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Single HTML</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
