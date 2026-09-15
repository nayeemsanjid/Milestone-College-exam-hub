import React, { useState } from 'react';
import { 
  Bell, 
  ChevronRight, 
  AlertTriangle, 
  Info, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';
import { NoticeItem } from '../types';

interface NoticeBoardProps {
  notices: NoticeItem[];
  onOpenGuidelines: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, onOpenGuidelines }) => {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(notices[0]?.id || null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed || notices.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
        >
          <Bell className="w-3.5 h-3.5 text-blue-600" />
          <span>Show Announcements ({notices.length})</span>
        </button>
      </div>
    );
  }

  const activeNotice = notices.find((n) => n.id === selectedNotice) || notices[0];

  return (
    <div id="notice-board-section" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-950 rounded-2xl shadow-md text-white overflow-hidden border border-blue-800/40">
        {/* Main Urgent Alert Banner */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Alert Header & Content */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex-shrink-0 mt-0.5">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Important Notice
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {activeNotice.date}
                  </span>
                  {activeNotice.isNew && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[10px] font-extrabold uppercase">
                      New
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeNotice.title}
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {activeNotice.summary}
                </p>
                {activeNotice.details && (
                  <p className="text-xs text-emerald-200/90 mt-1.5 font-medium">
                    Note: {activeNotice.details}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              <button
                onClick={onOpenGuidelines}
                className="px-3.5 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Read Exam Rules</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Dismiss Notice Bar"
                aria-label="Dismiss Notice Bar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab switcher for multiple notices if present */}
        {notices.length > 1 && (
          <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Other Notices:</span>
            {notices.map((notice) => (
              <button
                key={notice.id}
                onClick={() => setSelectedNotice(notice.id)}
                className={`px-2.5 py-1 rounded-md transition-all truncate max-w-[200px] sm:max-w-xs text-left ${
                  selectedNotice === notice.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {notice.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
