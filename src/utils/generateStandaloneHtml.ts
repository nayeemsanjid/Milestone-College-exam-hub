import { SubjectExam, NoticeItem } from '../types';
import { COLLEGE_INFO } from '../config/examData';

export function generateStandaloneHtml(exams: SubjectExam[], notices: NoticeItem[]): string {
  const jsonExams = JSON.stringify(exams, null, 2);
  const jsonNotices = JSON.stringify(notices, null, 2);
  const jsonCollege = JSON.stringify(COLLEGE_INFO, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Milestone College Exam Hub</title>
  <meta name="description" content="Online examination portal for Milestone College students to access live exams, subject schedules, and Google Form links.">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            brand: {
              navy: '#0f2e5a',
              blue: '#1d4ed8',
              emerald: '#059669',
            }
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    @keyframes pulseSlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.08); }
    }
    .pulse-live {
      animation: pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col justify-between">

  <!-- =========================================================================
       HEADER / NAVBAR
       ========================================================================= -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
    <!-- Top Utility Bar -->
    <div class="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="font-medium text-slate-200">Milestone College Assessment Portal</span>
          <span class="text-slate-500">|</span>
          <span class="hidden sm:inline text-slate-400">Committed to Quality Education</span>
        </div>
        <div class="flex items-center gap-3 text-slate-300">
          <span id="live-clock" class="font-mono font-medium">10:00:00 AM</span>
          <span class="text-slate-500 hidden sm:inline">(Dhaka, Bangladesh)</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Brand & Logo -->
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-1 flex items-center justify-center text-white shadow-md">
            <div class="text-center font-black">
              <span class="text-lg text-emerald-400">MC</span>
            </div>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Milestone College <span class="text-blue-700">Exam Hub</span>
            </h1>
            <p class="text-xs text-slate-500 font-medium">
              Official HSC & Term Assessment Portal • Uttara, Dhaka
            </p>
          </div>
        </div>

        <!-- Search Bar & Actions -->
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-80">
            <input 
              id="search-input"
              type="text" 
              placeholder="Search subject, paper, code..."
              class="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button 
            onclick="openGuidelinesModal()"
            class="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            Exam Rules
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden Admin Active Bar (Only visible when logged in) -->
    <div id="admin-active-bar" class="hidden bg-slate-900 text-white px-4 py-2 border-t border-blue-900 text-xs shadow-inner">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="font-bold text-emerald-400">Admin Mode Active:</span>
          <span class="text-slate-300">You can now customize Google Form URLs and exam statuses on any subject card.</span>
        </div>
        <button 
          onclick="handleAdminLogout()"
          class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded font-semibold text-xs transition-colors"
        >
          Exit Admin Mode
        </button>
      </div>
    </div>
  </header>

  <!-- =========================================================================
       NOTICE BOARD / ALERT SECTION
       ========================================================================= -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 pt-5 w-full">
    <div class="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 border border-blue-800/40 shadow-md">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Notice Board
              </span>
              <span class="text-xs text-slate-300 font-medium">HSC Term Examination Session</span>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-white">
              Upcoming Term Exam Schedule & Submission Guidelines
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Exams are conducted through official Google Forms. Submit within the allotted window. Ensure your College Roll and Section are correctly entered.
            </p>
          </div>
        </div>
        <button 
          onclick="openGuidelinesModal()"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
        >
          View Full Guidelines
        </button>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       FILTER BAR & DEPARTMENT SELECTOR
       ========================================================================= -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full">
    <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
      <!-- Departments -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Department:</span>
          <button onclick="setFilterDept('All')" data-dept="All" class="filter-dept-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-700 text-white">All Subjects</button>
          <button onclick="setFilterDept('Science')" data-dept="Science" class="filter-dept-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Science</button>
          <button onclick="setFilterDept('Commerce')" data-dept="Commerce" class="filter-dept-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Commerce</button>
          <button onclick="setFilterDept('Arts')" data-dept="Arts" class="filter-dept-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Arts</button>
          <button onclick="setFilterDept('Compulsory')" data-dept="Compulsory" class="filter-dept-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">Compulsory</button>
        </div>

        <!-- Class Filter -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400 font-medium">Class:</span>
          <div class="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
            <button onclick="setFilterClass('All')" data-class="All" class="filter-class-btn px-2.5 py-1 rounded-md font-bold bg-white text-slate-900 shadow-xs">All</button>
            <button onclick="setFilterClass('Class 11')" data-class="Class 11" class="filter-class-btn px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900">Class 11</button>
            <button onclick="setFilterClass('Class 12')" data-class="Class 12" class="filter-class-btn px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900">Class 12</button>
          </div>
        </div>
      </div>

      <!-- Secondary Row: Status Pills -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-medium">Status:</span>
          <button onclick="setFilterStatus('All')" data-status="All" class="filter-status-btn px-2.5 py-1 rounded-lg border bg-slate-900 text-white border-slate-900 font-semibold">All</button>
          <button onclick="setFilterStatus('Live Now')" data-status="Live Now" class="filter-status-btn px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100">Live Now</button>
          <button onclick="setFilterStatus('Upcoming')" data-status="Upcoming" class="filter-status-btn px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100">Upcoming</button>
          <button onclick="setFilterStatus('Completed')" data-status="Completed" class="filter-status-btn px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100">Completed</button>
        </div>

        <div id="subject-count" class="text-slate-400 font-medium text-xs">
          Showing subjects
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       SUBJECT GRID / EXAM HUB
       ========================================================================= -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
    <div id="subject-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <!-- Cards rendered via JavaScript -->
    </div>
    <div id="no-results" class="hidden text-center py-16 bg-white rounded-2xl border border-slate-200 my-4">
      <p class="text-slate-500 font-medium text-sm">No exam subjects match your current filter or search criteria.</p>
      <button onclick="resetAllFilters()" class="mt-3 px-4 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg">Reset Filters</button>
    </div>
  </main>

  <!-- =========================================================================
       FOOTER (Includes Admin Login for Faculty)
       ========================================================================= -->
  <footer class="bg-slate-900 text-slate-300 mt-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="font-bold text-white text-base">Milestone College Exam Hub</h3>
          <p class="text-xs text-emerald-400 font-semibold mt-0.5">Committed to Quality Education</p>
          <p class="text-xs text-slate-400 mt-2 leading-relaxed">
            Online examination gateway coordinating HSC term and annual assessments.
          </p>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-2">Campus Location & Contact</h4>
          <p class="text-xs text-slate-400">Sector 11 & 12, Uttara Model Town, Dhaka-1230</p>
          <p class="text-xs text-slate-400 mt-1">Phone: +880 2-8957542 | +880 1711-000000</p>
          <p class="text-xs text-slate-400 mt-1">Email: info@milestonecollege.edu.bd</p>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-2">Notice & Administration</h4>
          <p class="text-xs text-slate-400 leading-relaxed mb-3">
            Students must use valid Roll numbers. One response per Google Form is strictly enforced.
          </p>
          <!-- Admin Login Trigger in Footer -->
          <div id="footer-admin-login-container">
            <button 
              id="btn-footer-admin-login"
              onclick="openAdminLoginModal()" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
            >
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-slate-950 py-3.5 px-4 text-center text-xs text-slate-500 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
      <div>&copy; 2026 Milestone College. All rights reserved.</div>
      <div class="mt-2 sm:mt-0 flex items-center gap-3">
        <span>HSC Assessment Cell</span>
        <span>•</span>
        <button onclick="openAdminLoginModal()" class="hover:text-slate-400 text-slate-500">Faculty Login</button>
      </div>
    </div>
  </footer>

  <!-- =========================================================================
       ADMIN LOGIN MODAL
       ========================================================================= -->
  <div id="admin-login-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-200 text-slate-800">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            🔒
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Admin Mode Login</h3>
            <p class="text-[11px] text-slate-400">Milestone College Exam Cell</p>
          </div>
        </div>
        <button onclick="closeAdminLoginModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
      </div>

      <form onsubmit="handleAdminLoginSubmit(event)" class="space-y-4">
        <div class="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-slate-600">
          <p class="font-medium text-blue-900">Password Protected Area</p>
          <p class="text-[11px] mt-0.5">Enter the administrator passcode to customize Google Form links. (Passcode: <strong>1234</strong>)</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Admin Passcode:</label>
          <input 
            id="admin-password-input" 
            type="password" 
            placeholder="Enter password (e.g. 1234)"
            class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div id="admin-login-error" class="hidden text-xs text-rose-600 font-semibold">
          Incorrect passcode. Default passcode is 1234.
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button type="button" onclick="closeAdminLoginModal()" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
          <button type="submit" class="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs">Login as Admin</button>
        </div>
      </form>
    </div>
  </div>

  <!-- =========================================================================
       CUSTOMISE / EDIT LINK MODAL (Admin Only)
       ========================================================================= -->
  <div id="edit-link-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 border border-slate-200 text-slate-800">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Customise Subject Exam Link</h3>
          <p id="edit-modal-subtitle" class="text-xs text-slate-500 font-medium"></p>
        </div>
        <button onclick="closeEditLinkModal()" class="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
      </div>

      <form onsubmit="handleSaveEditLink(event)" class="space-y-4 text-xs">
        <input type="hidden" id="edit-exam-id" />

        <div>
          <label class="block font-bold text-slate-700 mb-1">Subject Title:</label>
          <input id="edit-exam-title" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Exam Status:</label>
          <select id="edit-exam-status" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium">
            <option value="Live Now">Live Now (Accepting Submissions)</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed / Closed</option>
          </select>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Google Form URL:</label>
          <input 
            id="edit-exam-url" 
            type="url" 
            required 
            placeholder="https://docs.google.com/forms/d/e/.../viewform"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div class="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <button type="button" onclick="closeEditLinkModal()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold">Cancel</button>
          <button type="submit" class="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-xl font-bold shadow-xs">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- =========================================================================
       GUIDELINES MODAL
       ========================================================================= -->
  <div id="guidelines-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 border border-slate-200 text-slate-800">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h3 class="text-base font-bold text-slate-900">Milestone College Exam Rules</h3>
        <button onclick="closeGuidelinesModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">&times;</button>
      </div>
      <div class="space-y-3 text-xs text-slate-600">
        <div class="p-3 bg-blue-50 rounded-xl border border-blue-100">
          <strong class="text-blue-900 block font-semibold">1. Google Account Login</strong>
          Ensure you are signed in to your browser with your valid student Google account before beginning.
        </div>
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <strong class="text-emerald-900 block font-semibold">2. Accurate Roll & Section</strong>
          Always double-check your College Roll, Section, and Shift in the first section of the form.
        </div>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-100">
          <strong class="text-amber-900 block font-semibold">3. Strict Timer Window</strong>
          Submit before the end time. Google Forms will automatically reject submissions after the cutoff timestamp.
        </div>
      </div>
      <div class="mt-5 pt-3 border-t border-slate-100 text-right">
        <button onclick="closeGuidelinesModal()" class="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold">Got it</button>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       EMBEDDED JAVASCRIPT CONFIGURATION & ENGINE
       ========================================================================= -->
  <script>
    /**
     * 🎓 MILESTONE COLLEGE EXAM PORTAL CONFIGURATION
     * Edit this array of objects to update subject names, exam status, and Google Form URLs.
     */
    let EXAM_CONFIG = ${jsonExams};

    // Admin Mode state (Hidden by default for students)
    let isAdmin = false;

    // Filter State
    let currentDept = 'All';
    let currentClass = 'All';
    let currentStatus = 'All';
    let currentSearch = '';

    // Clock updater
    function updateClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const clockEl = document.getElementById('live-clock');
      if (clockEl) clockEl.textContent = timeStr;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Render Cards
    function renderCards() {
      const grid = document.getElementById('subject-grid');
      const noResults = document.getElementById('no-results');
      const countEl = document.getElementById('subject-count');
      if (!grid) return;

      const filtered = EXAM_CONFIG.filter(exam => {
        const matchesDept = currentDept === 'All' || exam.department === currentDept;
        const matchesClass = currentClass === 'All' || exam.classLevel === currentClass;
        const matchesStatus = currentStatus === 'All' || exam.status === currentStatus;
        const matchesSearch = !currentSearch || 
          exam.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
          exam.code.toLowerCase().includes(currentSearch.toLowerCase()) ||
          exam.department.toLowerCase().includes(currentSearch.toLowerCase());
        
        return matchesDept && matchesClass && matchesStatus && matchesSearch;
      });

      countEl.textContent = 'Showing ' + filtered.length + ' of ' + EXAM_CONFIG.length + ' subjects';

      if (filtered.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
      }

      noResults.classList.add('hidden');

      grid.innerHTML = filtered.map(exam => {
        const isLive = exam.status === 'Live Now';
        const isUpcoming = exam.status === 'Upcoming';

        const deptColor = exam.department === 'Science' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          exam.department === 'Commerce' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          exam.department === 'Arts' ? 'bg-purple-50 text-purple-700 border-purple-200' :
          'bg-slate-100 text-slate-700 border-slate-200';

        const accentBar = isLive ? 'bg-emerald-500' :
          exam.department === 'Science' ? 'bg-blue-600' :
          exam.department === 'Commerce' ? 'bg-emerald-600' :
          exam.department === 'Arts' ? 'bg-purple-600' : 'bg-slate-700';

        // Only show Customise/Edit button if logged in as Admin
        const adminEditButton = isAdmin ? \`
          <button 
            onclick="openEditLinkModal('\${exam.id}')"
            class="w-full mb-2.5 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>✏️ Customise / Edit Link</span>
          </button>
        \` : '';

        return \`
          <div class="bg-white rounded-2xl border \${isLive ? 'border-emerald-300 ring-2 ring-emerald-500/15' : 'border-slate-200'} flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all">
            <div class="h-1.5 w-full \${accentBar}"></div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2.5">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border \${deptColor}">\${exam.department}</span>
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">\${exam.classLevel}</span>
                  </div>
                  <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Code: \${exam.code}</span>
                </div>

                <h3 class="text-lg font-bold text-slate-900">\${exam.title}</h3>
                <p class="text-xs font-semibold text-slate-500 mb-3">\${exam.paper || ''}</p>

                <div class="mb-4">
                  \${isLive ? \`
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Live Now (Open for Submission)</span>
                    </div>
                  \` : isUpcoming ? \`
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      <span>Upcoming Exam</span>
                    </div>
                  \` : \`
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
                      <span>Exam Closed</span>
                    </div>
                  \`}
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3">
                  <div><span class="text-slate-400 block text-[10px]">Date:</span><span class="font-medium">\${exam.examDate}</span></div>
                  <div><span class="text-slate-400 block text-[10px]">Time:</span><span class="font-medium">\${exam.timeSlot}</span></div>
                  <div><span class="text-slate-400 block text-[10px]">Duration:</span><span class="font-medium">\${exam.duration}</span></div>
                  <div><span class="text-slate-400 block text-[10px]">Marks:</span><span class="font-medium">\${exam.totalMarks} Marks</span></div>
                </div>

                <p class="text-xs text-slate-500 mb-2">
                  <strong class="text-slate-700">Format:</strong> \${exam.questionType}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-100 mt-2">
                \${adminEditButton}

                \${isLive ? \`
                  <a href="\${exam.googleFormUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all">
                    <span>Start Exam</span>
                    <span>↗</span>
                  </a>
                \` : isUpcoming ? \`
                  <a href="\${exam.googleFormUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all">
                    <span>Preview Form</span>
                    <span>↗</span>
                  </a>
                \` : \`
                  <a href="\${exam.googleFormUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all">
                    <span>Form Closed</span>
                    <span>↗</span>
                  </a>
                \`}
                <div class="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                  <span>Google Forms</span>
                  <span>Opens in new tab ↗</span>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Filter controls
    function setFilterDept(dept) {
      currentDept = dept;
      document.querySelectorAll('.filter-dept-btn').forEach(btn => {
        if (btn.getAttribute('data-dept') === dept) {
          btn.className = 'filter-dept-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-700 text-white';
        } else {
          btn.className = 'filter-dept-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200';
        }
      });
      renderCards();
    }

    function setFilterClass(cls) {
      currentClass = cls;
      document.querySelectorAll('.filter-class-btn').forEach(btn => {
        if (btn.getAttribute('data-class') === cls) {
          btn.className = 'filter-class-btn px-2.5 py-1 rounded-md font-bold bg-white text-slate-900 shadow-xs';
        } else {
          btn.className = 'filter-class-btn px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900';
        }
      });
      renderCards();
    }

    function setFilterStatus(status) {
      currentStatus = status;
      document.querySelectorAll('.filter-status-btn').forEach(btn => {
        if (btn.getAttribute('data-status') === status) {
          btn.className = 'filter-status-btn px-2.5 py-1 rounded-lg border bg-slate-900 text-white border-slate-900 font-semibold';
        } else {
          btn.className = 'filter-status-btn px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
        }
      });
      renderCards();
    }

    function resetAllFilters() {
      currentDept = 'All';
      currentClass = 'All';
      currentStatus = 'All';
      currentSearch = '';
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
      setFilterDept('All');
      setFilterClass('All');
      setFilterStatus('All');
    }

    // Search Input listener
    document.getElementById('search-input').addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderCards();
    });

    // Admin Login Modal Controls
    function openAdminLoginModal() {
      document.getElementById('admin-password-input').value = '';
      document.getElementById('admin-login-error').classList.add('hidden');
      document.getElementById('admin-login-modal').classList.remove('hidden');
      document.getElementById('admin-password-input').focus();
    }

    function closeAdminLoginModal() {
      document.getElementById('admin-login-modal').classList.add('hidden');
    }

    function handleAdminLoginSubmit(e) {
      e.preventDefault();
      const pwd = document.getElementById('admin-password-input').value;
      if (pwd === '1234') {
        isAdmin = true;
        closeAdminLoginModal();
        document.getElementById('admin-active-bar').classList.remove('hidden');
        renderCards();
      } else {
        document.getElementById('admin-login-error').classList.remove('hidden');
      }
    }

    function handleAdminLogout() {
      isAdmin = false;
      document.getElementById('admin-active-bar').classList.add('hidden');
      renderCards();
    }

    // Customise / Edit Link Modal Controls
    function openEditLinkModal(examId) {
      const exam = EXAM_CONFIG.find(e => e.id === examId);
      if (!exam) return;
      document.getElementById('edit-exam-id').value = exam.id;
      document.getElementById('edit-exam-title').value = exam.title;
      document.getElementById('edit-exam-status').value = exam.status;
      document.getElementById('edit-exam-url').value = exam.googleFormUrl;
      document.getElementById('edit-modal-subtitle').textContent = exam.department + ' • ' + exam.classLevel + ' (Code: ' + exam.code + ')';
      document.getElementById('edit-link-modal').classList.remove('hidden');
    }

    function closeEditLinkModal() {
      document.getElementById('edit-link-modal').classList.add('hidden');
    }

    function handleSaveEditLink(e) {
      e.preventDefault();
      const id = document.getElementById('edit-exam-id').value;
      const title = document.getElementById('edit-exam-title').value;
      const status = document.getElementById('edit-exam-status').value;
      const url = document.getElementById('edit-exam-url').value;

      const idx = EXAM_CONFIG.findIndex(item => item.id === id);
      if (idx !== -1) {
        EXAM_CONFIG[idx].title = title;
        EXAM_CONFIG[idx].status = status;
        EXAM_CONFIG[idx].googleFormUrl = url;
      }

      closeEditLinkModal();
      renderCards();
    }

    // Guidelines Modal Controls
    function openGuidelinesModal() {
      document.getElementById('guidelines-modal').classList.remove('hidden');
    }
    function closeGuidelinesModal() {
      document.getElementById('guidelines-modal').classList.add('hidden');
    }

    // Initial render
    renderCards();
  </script>
</body>
</html>`;
}
