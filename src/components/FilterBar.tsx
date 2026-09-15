import React from 'react';
import { 
  BookOpen, 
  FlaskConical, 
  Briefcase, 
  Palette, 
  Layers, 
  CheckCircle, 
  Clock, 
  Radio,
  RotateCcw
} from 'lucide-react';
import { Department, ClassLevel, ExamStatus } from '../types';

interface FilterBarProps {
  selectedDept: Department | 'All';
  onDeptChange: (dept: Department | 'All') => void;
  selectedClass: ClassLevel | 'All';
  onClassChange: (cls: ClassLevel | 'All') => void;
  selectedStatus: ExamStatus | 'All';
  onStatusChange: (status: ExamStatus | 'All') => void;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedDept,
  onDeptChange,
  selectedClass,
  onClassChange,
  selectedStatus,
  onStatusChange,
  totalCount,
  filteredCount,
  onResetFilters,
}) => {
  const isFiltered = selectedDept !== 'All' || selectedClass !== 'All' || selectedStatus !== 'All';

  const departments: { id: Department | 'All'; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'All Subjects', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'Science', label: 'Science', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'Commerce', label: 'Commerce', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'Arts', label: 'Humanities / Arts', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'Compulsory', label: 'Compulsory (All)', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  const classes: (ClassLevel | 'All')[] = ['All', 'Class 11', 'Class 12'];

  const statuses: { id: ExamStatus | 'All'; label: string; dotColor?: string }[] = [
    { id: 'All', label: 'All Statuses' },
    { id: 'Live Now', label: 'Live Now', dotColor: 'bg-emerald-500' },
    { id: 'Upcoming', label: 'Upcoming', dotColor: 'bg-amber-500' },
    { id: 'Completed', label: 'Completed', dotColor: 'bg-slate-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Top Row: Department Filter Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Department
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredCount}</strong> of {totalCount} subjects
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => {
              const isActive = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  id={`filter-dept-${dept.id.toLowerCase()}`}
                  onClick={() => onDeptChange(dept.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {dept.icon}
                  <span>{dept.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Class Selector + Status Filter + Reset */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Class:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              {classes.map((cls) => {
                const isActive = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    id={`filter-class-${cls.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onClassChange(cls)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cls === 'All' ? 'All Classes' : cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((st) => {
                const isActive = selectedStatus === st.id;
                return (
                  <button
                    key={st.id}
                    id={`filter-status-${st.id.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onStatusChange(st.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {st.dotColor && (
                      <span className={`w-2 h-2 rounded-full ${st.dotColor} ${st.id === 'Live Now' ? 'animate-pulse' : ''}`} />
                    )}
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Reset Filter Button */}
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors font-semibold ml-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
