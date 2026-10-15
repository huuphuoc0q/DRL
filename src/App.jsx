import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  ShieldCheck,
  Users,
  HeartHandshake,
  Star,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
  Building,
  User,
  FileSpreadsheet,
  Save,
  Check,
  TrendingUp,
  Sliders,
  Plus,
  Minus
} from 'lucide-react';

// Storage key
const STORAGE_KEY = 'HCMUE_DRL_APP_DATA_V1';

// Initial Student Info
const defaultStudentInfo = {
  fullName: '',
  mssv: '',
  classRoom: '',
  faculty: 'Công nghệ Thông tin',
  semester: 'Học kỳ 1',
  academicYear: '2023 - 2024',
  evaluationDate: new Date().toISOString().split('T')[0]
};

// Initial Score Form State
const defaultScores = {
  // --- MỤC I (Max 20) ---
  sec1_onTime: false,              // +1.5
  sec1_prepared: false,            // +1.5
  sec1_seminars: 0,                // +3 / hoạt động
  sec1_researches: 0,              // +5 / đề tài
  sec1_cheerCompetitions: 0,       // +1 / hoạt động
  sec1_deptCompetitions: 0,        // +3 / hoạt động
  sec1_schoolCompetitions: 0,      // +4 / hoạt động
  sec1_cityCompetitions: 0,        // +5 / hoạt động
  sec1_academicResult: 'none',     // xs: 10, gioi: 8, kha: 6, tb: 5, yeu: 3, kem: 0
  sec1_overcomingDifficulties: 0,  // 0 - 3 (slider/input)
  sec1_academicAwards_dept: 0,     // +3 / thành tích
  sec1_academicAwards_school: 0,   // +4 / thành tích
  sec1_academicAwards_city: 0,     // +5 / thành tích
  sec1_academicAwards_national: 0, // +6 / thành tích
  sec1_skippedSurveys: 0,          // -3 / lần
  sec1_examViolations_reprimand: 0,// -2 / lần đầu, -4 lần sau
  sec1_examViolations_warning: 0,  // -3 / lần đầu, -6 lần sau
  sec1_examViolations_suspend: 0,  // -4 / lần đầu, -8 lần sau

  // --- MỤC II (Max 25) ---
  sec2_complyDormRegulations: false, // +3
  sec2_tuitionOnTime: true,          // +3
  sec2_insuranceOnTime: true,        // +2
  sec2_campusViolations: 0,          // -3 / lần
  sec2_deptActivityAbsence: 0,       // -3 / lần
  sec2_schoolActivityAbsence: 0,     // -4 / lần
  sec2_lateSubmissionDocs: 0,        // -3 / lần
  sec2_noInsurance: false,           // -5
  sec2_citizenWeek: 'passed',        // passed: +10, failed: 0
  sec2_classMeetings: 5,             // 0 - 5 điểm
  sec2_onTimeEvaluation: true,       // +2
  sec2_disciplinaryAction: 'none',   // reprimand: -5, warning: -10, suspend: 'fail'

  // --- MỤC III (Max 20) ---
  sec3_clubMemberships: 0,           // +3 / clb
  sec3_cheerActivities: 0,           // +2 / lần
  sec3_officialMeetings: 0,          // +4 / hoạt động
  sec3_officialMeetingsAbsence: 0,   // -4 / hoạt động
  sec3_artSport_class: 0,            // +1
  sec3_artSport_dept: 0,             // +2
  sec3_artSport_school: 0,           // +3
  sec3_artSport_city: 0,             // +4
  sec3_bloodDonation: 0,             // +3 / lần
  sec3_antiSocialEvils: 0,           // +3 / lần
  sec3_joinedYouthUnion: false,      // +2
  sec3_joinedParty: false,           // +3
  sec3_movementAwards_dept: 0,       // +3 / thành tích
  sec3_movementAwards_school: 0,     // +4 / thành tích
  sec3_movementAwards_city: 0,       // +5 / thành tích
  sec3_movementAwards_national: 0,   // +6 / thành tích

  // --- MỤC IV (Max 25) ---
  sec4_policyAwareness: false,       // +2.5
  sec4_policyAdvocacy: false,        // +2.5
  sec4_volunteerSpirit: false,       // +3
  sec4_volunteer_class: 0,           // +2 / hoạt động
  sec4_volunteer_dept: 0,            // +3 / hoạt động
  sec4_volunteer_school: 0,          // +4 / hoạt động
  sec4_volunteerAwards_dept: 0,      // +3 / thành tích
  sec4_volunteerAwards_school: 0,    // +4 / thành tích
  sec4_volunteerAwards_city: 0,      // +5 / thành tích
  sec4_volunteerAwards_national: 0,  // +6 / thành tích

  // --- MỤC V (Max 10) ---
  sec5_supportGeneralActivity: false,// +3
  sec5_cadreRole: 'none',            // role selection
  sec5_cadrePerformance: 'none',     // excellent, good, passed, failed
  sec5_specialMerit: 'none'          // none, school: +4, city: +5, national_third: +6, national_first: +7
};

export default function App() {
  const [studentInfo, setStudentInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_INFO`);
      return saved ? JSON.parse(saved) : defaultStudentInfo;
    } catch {
      return defaultStudentInfo;
    }
  });

  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_SCORES`);
      return saved ? JSON.parse(saved) : defaultScores;
    } catch {
      return defaultScores;
    }
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all' or section index 1..5
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_INFO`, JSON.stringify(studentInfo));
    localStorage.setItem(`${STORAGE_KEY}_SCORES`, JSON.stringify(scores));
  }, [studentInfo, scores]);

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại tất cả thông tin và điểm rèn luyện về mặc định?')) {
      setStudentInfo(defaultStudentInfo);
      setScores(defaultScores);
      localStorage.removeItem(`${STORAGE_KEY}_INFO`);
      localStorage.removeItem(`${STORAGE_KEY}_SCORES`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for numeric inputs
  const updateNumber = (field, val, min = 0, max = 99) => {
    const num = Math.max(min, Math.min(max, parseInt(val, 10) || 0));
    setScores(prev => ({ ...prev, [field]: num }));
  };

  // --- CALCULATE SECTION SCORES ---
  const calculated = useMemo(() => {
    // === MỤC I ===
    let raw1 = 0;
    if (scores.sec1_onTime) raw1 += 1.5;
    if (scores.sec1_prepared) raw1 += 1.5;
    raw1 += scores.sec1_seminars * 3;
    raw1 += scores.sec1_researches * 5;
    raw1 += scores.sec1_cheerCompetitions * 1;
    raw1 += scores.sec1_deptCompetitions * 3;
    raw1 += scores.sec1_schoolCompetitions * 4;
    raw1 += scores.sec1_cityCompetitions * 5;

    const academicMap = { none: 0, xs: 10, gioi: 8, kha: 6, tb: 5, yeu: 3, kem: 0 };
    raw1 += academicMap[scores.sec1_academicResult] || 0;
    raw1 += Number(scores.sec1_overcomingDifficulties) || 0;

    raw1 += scores.sec1_academicAwards_dept * 3;
    raw1 += scores.sec1_academicAwards_school * 4;
    raw1 += scores.sec1_academicAwards_city * 5;
    raw1 += scores.sec1_academicAwards_national * 6;

    // Phạt học thuật
    raw1 -= scores.sec1_skippedSurveys * 3;
    // Vi phạm thi: Lần đầu -2, lần sau -4
    if (scores.sec1_examViolations_reprimand > 0) {
      raw1 -= 2 + (scores.sec1_examViolations_reprimand - 1) * 4;
    }
    if (scores.sec1_examViolations_warning > 0) {
      raw1 -= 3 + (scores.sec1_examViolations_warning - 1) * 6;
    }
    if (scores.sec1_examViolations_suspend > 0) {
      raw1 -= 4 + (scores.sec1_examViolations_suspend - 1) * 8;
    }
    const final1 = Math.max(0, Math.min(20, raw1));

    // === MỤC II ===
    let raw2 = 0;
    if (scores.sec2_complyDormRegulations) raw2 += 3;
    if (scores.sec2_tuitionOnTime) raw2 += 3;
    if (scores.sec2_insuranceOnTime) raw2 += 2;
    if (scores.sec2_citizenWeek === 'passed') raw2 += 10;
    raw2 += Number(scores.sec2_classMeetings) || 0;
    if (scores.sec2_onTimeEvaluation) raw2 += 2;

    // Trừ điểm
    raw2 -= scores.sec2_campusViolations * 3;
    raw2 -= scores.sec2_deptActivityAbsence * 3;
    raw2 -= scores.sec2_schoolActivityAbsence * 4;
    raw2 -= scores.sec2_lateSubmissionDocs * 3;
    if (scores.sec2_noInsurance) raw2 -= 5;
    if (scores.sec2_disciplinaryAction === 'reprimand') raw2 -= 5;
    if (scores.sec2_disciplinaryAction === 'warning') raw2 -= 10;

    let final2 = Math.max(0, Math.min(25, raw2));

    // === MỤC III ===
    let raw3 = 0;
    raw3 += scores.sec3_clubMemberships * 3;
    raw3 += scores.sec3_cheerActivities * 2;
    raw3 += scores.sec3_officialMeetings * 4;
    raw3 -= scores.sec3_officialMeetingsAbsence * 4;

    raw3 += scores.sec3_artSport_class * 1;
    raw3 += scores.sec3_artSport_dept * 2;
    raw3 += scores.sec3_artSport_school * 3;
    raw3 += scores.sec3_artSport_city * 4;

    raw3 += scores.sec3_bloodDonation * 3;
    raw3 += scores.sec3_antiSocialEvils * 3;
    if (scores.sec3_joinedYouthUnion) raw3 += 2;
    if (scores.sec3_joinedParty) raw3 += 3;

    raw3 += scores.sec3_movementAwards_dept * 3;
    raw3 += scores.sec3_movementAwards_school * 4;
    raw3 += scores.sec3_movementAwards_city * 5;
    raw3 += scores.sec3_movementAwards_national * 6;

    const final3 = Math.max(0, Math.min(20, raw3));

    // === MỤC IV ===
    let raw4 = 0;
    if (scores.sec4_policyAwareness) raw4 += 2.5;
    if (scores.sec4_policyAdvocacy) raw4 += 2.5;
    if (scores.sec4_volunteerSpirit) raw4 += 3;

    raw4 += scores.sec4_volunteer_class * 2;
    raw4 += scores.sec4_volunteer_dept * 3;
    raw4 += scores.sec4_volunteer_school * 4;

    raw4 += scores.sec4_volunteerAwards_dept * 3;
    raw4 += scores.sec4_volunteerAwards_school * 4;
    raw4 += scores.sec4_volunteerAwards_city * 5;
    raw4 += scores.sec4_volunteerAwards_national * 6;

    const final4 = Math.max(0, Math.min(25, raw4));

    // === MỤC V ===
    let raw5 = 0;
    if (scores.sec5_supportGeneralActivity) raw5 += 3;

    // Chức vụ cán bộ
    const cadrePoints = {
      bcs: { excellent: 3, good: 2, passed: 1, failed: -3 },
      dept_lead: { excellent: 4, good: 3, passed: 2, failed: -5 },
      school_lead: { excellent: 4, good: 3, passed: 2, failed: -5 }
    };

    if (scores.sec5_cadreRole !== 'none' && scores.sec5_cadrePerformance !== 'none') {
      const roleTable = cadrePoints[scores.sec5_cadreRole];
      if (roleTable && roleTable[scores.sec5_cadrePerformance] !== undefined) {
        raw5 += roleTable[scores.sec5_cadrePerformance];
      }
    }

    // Khen thưởng đặc biệt
    const meritPoints = {
      none: 0,
      school: 4,          // Cấp trường: SV5T, Thanh niên tiên tiến...
      city: 5,            // Cấp TP: SV5T TP, Giải I II III NCKH TP...
      national_first: 7,  // Cấp TW: SV5T TW, Sao Tháng Giêng, Giải I II III NCKH Bộ...
      national_second: 6  // Giải Khuyến khích NCKH Bộ, Bằng khen TW Đoàn...
    };
    raw5 += meritPoints[scores.sec5_specialMerit] || 0;

    const final5 = Math.max(0, Math.min(10, raw5));

    // TỔNG ĐIỂM
    let total = final1 + final2 + final3 + final4 + final5;
    total = Math.max(0, Math.min(100, Math.round(total * 10) / 10));

    // XẾP LOẠI
    let classification = { text: 'Kém', color: 'bg-rose-500 text-white', border: 'border-rose-300', bgSoft: 'bg-rose-50 text-rose-700' };
    if (scores.sec2_disciplinaryAction === 'suspend') {
      classification = { text: 'Kém (Đình chỉ)', color: 'bg-rose-700 text-white', border: 'border-rose-400', bgSoft: 'bg-rose-100 text-rose-800' };
    } else if (total >= 90) {
      classification = { text: 'Xuất sắc', color: 'bg-emerald-600 text-white', border: 'border-emerald-300', bgSoft: 'bg-emerald-50 text-emerald-800' };
    } else if (total >= 80) {
      classification = { text: 'Tốt', color: 'bg-blue-600 text-white', border: 'border-blue-300', bgSoft: 'bg-blue-50 text-blue-800' };
    } else if (total >= 65) {
      classification = { text: 'Khá', color: 'bg-amber-500 text-white', border: 'border-amber-300', bgSoft: 'bg-amber-50 text-amber-800' };
    } else if (total >= 50) {
      classification = { text: 'Trung bình', color: 'bg-orange-500 text-white', border: 'border-orange-300', bgSoft: 'bg-orange-50 text-orange-800' };
    } else if (total >= 35) {
      classification = { text: 'Yếu', color: 'bg-orange-600 text-white', border: 'border-orange-400', bgSoft: 'bg-orange-100 text-orange-900' };
    }

    return {
      raw1, final1,
      raw2, final2,
      raw3, final3,
      raw4, final4,
      raw5, final5,
      total,
      classification
    };
  }, [scores]);

  const toggleSection = (id) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const notifySaved = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* ===================== TOAST NOTIFICATION ===================== */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-500 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="font-medium text-sm">Đã lưu tự động vào trình duyệt!</span>
        </div>
      )}

      {/* ===================== NO-PRINT: MAIN APP UI ===================== */}
      <div className="no-print">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Đánh Giá Điểm Rèn Luyện
                </h1>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Biểu mẫu BM.01/CTCT-HSSV • Trường Đại học Sư phạm TP.HCM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200"
                title="Đặt lại thông tin về mặc định"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden md:inline">Đặt lại</span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem(`${STORAGE_KEY}_SCORES`, JSON.stringify(scores));
                  notifySaved();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition border border-slate-200"
                title="Lưu tiến độ"
              >
                <Save className="w-4 h-4 text-blue-600" />
                <span className="hidden md:inline">Lưu</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition shadow-md shadow-blue-500/25 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Xuất phiếu BM.01</span>
              </button>
            </div>
          </div>
        </header>

        {/* STICKY SCORE DASHBOARD BANNER */}
        <div className="sticky top-16 z-30 bg-slate-900 text-white shadow-xl border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Overall Total and Rank */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-baseline">
                      <span>{calculated.total}</span>
                      <span className="text-sm font-semibold text-slate-400 ml-1">/100</span>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-slate-700" />

                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Xếp loại</span>
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${calculated.classification.color} shadow-sm`}>
                      {calculated.classification.text}
                    </span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="hidden sm:block w-36 lg:w-48 ml-2">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Tiến độ đạt</span>
                    <span className="font-semibold text-white">{calculated.total}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, calculated.total)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Section Scores Pill Badges */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {[
                  { label: 'Mục I', score: calculated.final1, max: 20, raw: calculated.raw1, id: 1 },
                  { label: 'Mục II', score: calculated.final2, max: 25, raw: calculated.raw2, id: 2 },
                  { label: 'Mục III', score: calculated.final3, max: 20, raw: calculated.raw3, id: 3 },
                  { label: 'Mục IV', score: calculated.final4, max: 25, raw: calculated.raw4, id: 4 },
                  { label: 'Mục V', score: calculated.final5, max: 10, raw: calculated.raw5, id: 5 }
                ].map((sec) => (
                  <button
                    key={sec.label}
                    onClick={() => {
                      const el = document.getElementById(`section-${sec.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition group text-left sm:text-center"
                  >
                    <div className="text-[10px] text-slate-400 font-medium">{sec.label}</div>
                    <div className="font-bold text-slate-100 flex items-center justify-center gap-0.5 text-xs sm:text-sm">
                      <span className={sec.score === sec.max ? 'text-emerald-400' : 'text-white'}>
                        {sec.score}
                      </span>
                      <span className="text-[10px] text-slate-500">/{sec.max}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* ================= SECTION: STUDENT INFO ================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 mb-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Thông tin cá nhân & Đợt đánh giá</h2>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-md">
                Tự động lưu vào máy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên Sinh viên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={studentInfo.fullName}
                  onChange={(e) => setStudentInfo({ ...studentInfo, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã số sinh viên (MSSV)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 48.01.104.001"
                  value={studentInfo.mssv}
                  onChange={(e) => setStudentInfo({ ...studentInfo, mssv: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp sinh hoạt</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Sư phạm Toán A - K48"
                  value={studentInfo.classRoom}
                  onChange={(e) => setStudentInfo({ ...studentInfo, classRoom: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khoa / Đơn vị</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Toán - Tin học"
                  value={studentInfo.faculty}
                  onChange={(e) => setStudentInfo({ ...studentInfo, faculty: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Học kỳ đánh giá</label>
                <select
                  value={studentInfo.semester}
                  onChange={(e) => setStudentInfo({ ...studentInfo, semester: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="Học kỳ 1">Học kỳ 1</option>
                  <option value="Học kỳ 2">Học kỳ 2</option>
                  <option value="Học kỳ Hè">Học kỳ Hè</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Năm học</label>
                <input
                  type="text"
                  placeholder="2023 - 2024"
                  value={studentInfo.academicYear}
                  onChange={(e) => setStudentInfo({ ...studentInfo, academicYear: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* SMART NOTICES & SUGGESTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <span className="font-bold">Mẹo đạt điểm rèn luyện cao:</span> Hãy kiểm tra kỹ các tiêu chí như tuần sinh hoạt công dân, tham gia BHYT và các hoạt động tình nguyện cấp Trường/Khoa để tối ưu hóa điểm số nhé!
              </div>
            </div>

            {scores.sec2_disciplinaryAction !== 'none' ||
             scores.sec1_skippedSurveys > 0 ||
             scores.sec2_campusViolations > 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold">Lưu ý điểm trừ:</span> Bạn đang có tiêu chí bị trừ điểm vi phạm. Đảm bảo khai báo đúng với biên bản hoặc thông báo chính thức để tránh bị hạ bậc khi hội đồng chấm lại.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold">Hồ sơ kỷ luật sạch:</span> Hiện tại bạn không có khoản trừ vi phạm nội quy nào. Hãy duy trì thái độ chuẩn mực suốt học kỳ!
                </div>
              </div>
            )}
          </div>

          {/* ===================== FORM SECTIONS (5 MỤC) ===================== */}
          <div className="space-y-6">

            {/* -------------------- MỤC I -------------------- */}
            <div id="section-1" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div
                onClick={() => toggleSection(1)}
                className="p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-200/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    I
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Đánh Giá Về Ý Thức Tham Gia Học Tập
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tối đa: <span className="font-semibold text-slate-700">20 điểm</span> • Điểm tính: <span className="font-bold text-blue-600">{calculated.raw1}</span> (Nhận: <span className="font-bold text-emerald-600">{calculated.final1}</span>)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${calculated.final1 === 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                    {calculated.final1} / 20 đ
                  </span>
                  {collapsedSections[1] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {!collapsedSections[1] && (
                <div className="p-6 space-y-6">
                  {/* a. Tinh thần thái độ */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      a. Tinh thần và thái độ trong học tập (Khung: 0 - 3 điểm)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={scores.sec1_onTime}
                          onChange={(e) => setScores({ ...scores, sec1_onTime: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Đi học đúng giờ, đầy đủ</span>
                          <span className="text-slate-500">+1.5 điểm</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={scores.sec1_prepared}
                          onChange={(e) => setScores({ ...scores, sec1_prepared: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Chuẩn bị bài tốt, nghiêm túc</span>
                          <span className="text-slate-500">+1.5 điểm</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* b. NCKH & Học thuật */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      b. Tham gia các hoạt động học thuật & Nghiên cứu khoa học (NCKH)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-800">Hội thảo, tọa đàm, NCKH</div>
                          <div className="text-slate-500">+3 điểm / hoạt động</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateNumber('sec1_seminars', scores.sec1_seminars - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{scores.sec1_seminars}</span>
                          <button
                            onClick={() => updateNumber('sec1_seminars', scores.sec1_seminars + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-800">Đề tài NCKH, bài báo, san uy tín</div>
                          <div className="text-slate-500">+5 điểm / đề tài, bài viết</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateNumber('sec1_researches', scores.sec1_researches - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{scores.sec1_researches}</span>
                          <button
                            onClick={() => updateNumber('sec1_researches', scores.sec1_researches + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* c. Tham gia các kỳ thi, cuộc thi học thuật */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      c. Tham gia các kỳ thi, cuộc thi học thuật
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pl-4">
                      {[
                        { label: 'Cổ vũ cuộc thi', sub: '+1đ / hoạt động', field: 'sec1_cheerCompetitions' },
                        { label: 'Cấp Khoa', sub: '+3đ / hoạt động', field: 'sec1_deptCompetitions' },
                        { label: 'Cấp Trường', sub: '+4đ / hoạt động', field: 'sec1_schoolCompetitions' },
                        { label: 'Cấp Tỉnh/Thành trở lên', sub: '+5đ / hoạt động', field: 'sec1_cityCompetitions' }
                      ].map((item) => (
                        <div key={item.field} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-2">
                          <div className="text-xs">
                            <div className="font-semibold text-slate-800">{item.label}</div>
                            <div className="text-slate-500 text-[11px]">{item.sub}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">Số lượng:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateNumber(item.field, scores[item.field] - 1)}
                                className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-xs">{scores[item.field]}</span>
                              <button
                                onClick={() => updateNumber(item.field, scores[item.field] + 1)}
                                className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* d. Kết quả học tập */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      d. Kết quả học tập của học kỳ (Khung: 0 - 10 điểm)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pl-4">
                      {[
                        { val: 'xs', title: 'Xuất sắc', pts: '+10' },
                        { val: 'gioi', title: 'Giỏi', pts: '+8' },
                        { val: 'kha', title: 'Khá', pts: '+6' },
                        { val: 'tb', title: 'Trung bình', pts: '+5' },
                        { val: 'yeu', title: 'Yếu', pts: '+3' },
                        { val: 'kem', title: 'Kém', pts: '0' }
                      ].map((item) => (
                        <label
                          key={item.val}
                          className={`flex flex-col items-center p-3 rounded-xl border text-center cursor-pointer transition ${
                            scores.sec1_academicResult === item.val
                              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-900'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="academicResult"
                            value={item.val}
                            checked={scores.sec1_academicResult === item.val}
                            onChange={(e) => setScores({ ...scores, sec1_academicResult: e.target.value })}
                            className="sr-only"
                          />
                          <span className="text-xs font-bold">{item.title}</span>
                          <span className="text-[11px] font-semibold text-blue-600 mt-1">{item.pts} điểm</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* e. Tinh thần vượt khó */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      e. Tinh thần vượt khó, phấn đấu vươn lên trong học tập (0 - 3 điểm)
                    </h4>
                    <div className="pl-4 max-w-md">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Mức điểm cộng:</span>
                        <span className="text-blue-600 font-bold text-sm">+{scores.sec1_overcomingDifficulties} điểm</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.5"
                        value={scores.sec1_overcomingDifficulties}
                        onChange={(e) => setScores({ ...scores, sec1_overcomingDifficulties: parseFloat(e.target.value) })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>0 điểm</span>
                        <span>1.5 điểm</span>
                        <span>3 điểm (Tối đa)</span>
                      </div>
                    </div>
                  </div>

                  {/* f. Khen thưởng và Kỷ luật học thuật */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      f. Khen thưởng & Kỷ luật học thuật
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                      {/* Khen thưởng */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                        <span className="text-xs font-bold text-emerald-800 block">Khen thưởng thành tích học thuật</span>
                        {[
                          { label: 'Cấp Khoa (+3đ)', field: 'sec1_academicAwards_dept' },
                          { label: 'Cấp Trường (+4đ)', field: 'sec1_academicAwards_school' },
                          { label: 'Cấp Tỉnh/Thành (+5đ)', field: 'sec1_academicAwards_city' },
                          { label: 'Cấp Trung ương (+6đ)', field: 'sec1_academicAwards_national' }
                        ].map(it => (
                          <div key={it.field} className="flex items-center justify-between text-xs">
                            <span className="text-slate-700">{it.label}</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateNumber(it.field, scores[it.field] - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                              <span className="w-5 text-center font-bold">{scores[it.field]}</span>
                              <button onClick={() => updateNumber(it.field, scores[it.field] + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Kỷ luật */}
                      <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-3">
                        <span className="text-xs font-bold text-rose-800 block">Kỷ luật & Vi phạm</span>
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-700 block">Không thực hiện khảo sát</span>
                            <span className="text-rose-600 text-[10px]">-3 điểm / lần</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateNumber('sec1_skippedSurveys', scores.sec1_skippedSurveys - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                            <span className="w-5 text-center font-bold">{scores.sec1_skippedSurveys}</span>
                            <button onClick={() => updateNumber('sec1_skippedSurveys', scores.sec1_skippedSurveys + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-700 block">Vi phạm thi: Khiển trách</span>
                            <span className="text-rose-600 text-[10px]">-2đ lần đầu, -4đ lần sau</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateNumber('sec1_examViolations_reprimand', scores.sec1_examViolations_reprimand - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                            <span className="w-5 text-center font-bold">{scores.sec1_examViolations_reprimand}</span>
                            <button onClick={() => updateNumber('sec1_examViolations_reprimand', scores.sec1_examViolations_reprimand + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-700 block">Vi phạm thi: Cảnh cáo</span>
                            <span className="text-rose-600 text-[10px]">-3đ lần đầu, -6đ lần sau</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateNumber('sec1_examViolations_warning', scores.sec1_examViolations_warning - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                            <span className="w-5 text-center font-bold">{scores.sec1_examViolations_warning}</span>
                            <button onClick={() => updateNumber('sec1_examViolations_warning', scores.sec1_examViolations_warning + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* -------------------- MỤC II -------------------- */}
            <div id="section-2" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div
                onClick={() => toggleSection(2)}
                className="p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-200/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    II
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Ý Thức Chấp Hành Nội Quy, Quy Chế, Quy Định Trong Trường
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tối đa: <span className="font-semibold text-slate-700">25 điểm</span> • Điểm tính: <span className="font-bold text-indigo-600">{calculated.raw2}</span> (Nhận: <span className="font-bold text-emerald-600">{calculated.final2}</span>)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${calculated.final2 === 25 ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                    {calculated.final2} / 25 đ
                  </span>
                  {collapsedSections[2] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {!collapsedSections[2] && (
                <div className="p-6 space-y-6">
                  {/* Chấp hành quy định KTX, BHYT, học phí */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Quy định Ký túc xá / Ngoại trú, Học phí & BHYT
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-4">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={scores.sec2_complyDormRegulations}
                          onChange={(e) => setScores({ ...scores, sec2_complyDormRegulations: e.target.checked })}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Chấp hành tốt nội quy KTX / Ngoại trú</span>
                          <span className="text-slate-500">+3 điểm</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={scores.sec2_tuitionOnTime}
                          onChange={(e) => setScores({ ...scores, sec2_tuitionOnTime: e.target.checked })}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Đóng học phí đúng hạn</span>
                          <span className="text-slate-500">+3 điểm</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={scores.sec2_insuranceOnTime}
                          onChange={(e) => setScores({ ...scores, sec2_insuranceOnTime: e.target.checked })}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Tham gia BHYT đúng hạn</span>
                          <span className="text-slate-500">+2 điểm</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Tuần sinh hoạt công dân & Sinh hoạt lớp */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <label className="text-xs font-bold text-slate-800 block mb-2">Tuần sinh hoạt công dân - Sinh viên</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="citizenWeek"
                            checked={scores.sec2_citizenWeek === 'passed'}
                            onChange={() => setScores({ ...scores, sec2_citizenWeek: 'passed' })}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-semibold text-emerald-700">Đạt (+10 điểm)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="citizenWeek"
                            checked={scores.sec2_citizenWeek === 'failed'}
                            onChange={() => setScores({ ...scores, sec2_citizenWeek: 'failed' })}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-semibold text-rose-700">Không đạt (0 điểm)</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-800">Tham gia sinh hoạt lớp định kỳ</label>
                        <span className="text-xs font-bold text-indigo-600">{scores.sec2_classMeetings} / 5 điểm</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={scores.sec2_classMeetings}
                        onChange={(e) => setScores({ ...scores, sec2_classMeetings: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Tiến độ đánh giá ĐRL */}
                  <div className="pl-4">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer max-w-md">
                      <input
                        type="checkbox"
                        checked={scores.sec2_onTimeEvaluation}
                        onChange={(e) => setScores({ ...scores, sec2_onTimeEvaluation: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-800">Tự đánh giá kết quả ĐRL đúng tiến độ</span>
                        <span className="text-slate-500">+2 điểm</span>
                      </div>
                    </label>
                  </div>

                  {/* Các vi phạm trừ điểm */}
                  <div>
                    <h4 className="text-sm font-bold text-rose-700 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      Các mục trừ điểm vi phạm nội quy, quy chế
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pl-4">
                      {[
                        { label: 'Vi phạm giờ học, thẻ SV', sub: '-3đ / lần', field: 'sec2_campusViolations' },
                        { label: 'Vắng hoạt động cấp Khoa', sub: '-3đ / lần', field: 'sec2_deptActivityAbsence' },
                        { label: 'Vắng hoạt động cấp Trường', sub: '-4đ / lần', field: 'sec2_schoolActivityAbsence' },
                        { label: 'Trễ hạn nộp hồ sơ, giấy tờ', sub: '-3đ / lần', field: 'sec2_lateSubmissionDocs' }
                      ].map(item => (
                        <div key={item.field} className="p-3 rounded-xl border border-rose-100 bg-rose-50/20 flex flex-col justify-between gap-2">
                          <div className="text-xs">
                            <div className="font-semibold text-slate-800">{item.label}</div>
                            <div className="text-rose-600 text-[11px] font-medium">{item.sub}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Số lần:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateNumber(item.field, scores[item.field] - 1)}
                                className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-600"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-bold text-xs">{scores[item.field]}</span>
                              <button
                                onClick={() => updateNumber(item.field, scores[item.field] + 1)}
                                className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-600"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 mt-3">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-rose-200 bg-rose-50/30 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scores.sec2_noInsurance}
                          onChange={(e) => setScores({ ...scores, sec2_noInsurance: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Không tham gia BHYT theo quy định</span>
                          <span className="text-rose-600 font-medium">-5 điểm</span>
                        </div>
                      </label>

                      <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/30">
                        <label className="text-xs font-semibold block text-slate-800 mb-1">Kỷ luật từ Hội đồng thi đua khen thưởng:</label>
                        <select
                          value={scores.sec2_disciplinaryAction}
                          onChange={(e) => setScores({ ...scores, sec2_disciplinaryAction: e.target.value })}
                          className="w-full text-xs p-1.5 bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="none">Không vi phạm</option>
                          <option value="reprimand">Khiển trách (-5 điểm)</option>
                          <option value="warning">Cảnh cáo (-10 điểm)</option>
                          <option value="suspend">Đình chỉ học tập (Xếp loại Kém)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* -------------------- MỤC III -------------------- */}
            <div id="section-3" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div
                onClick={() => toggleSection(3)}
                className="p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-200/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    III
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Ý Thức Tham Gia Hoạt Động Chính Trị, Xã Hội, VH-VN-TT
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tối đa: <span className="font-semibold text-slate-700">20 điểm</span> • Điểm tính: <span className="font-bold text-purple-600">{calculated.raw3}</span> (Nhận: <span className="font-bold text-emerald-600">{calculated.final3}</span>)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${calculated.final3 === 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>
                    {calculated.final3} / 20 đ
                  </span>
                  {collapsedSections[3] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {!collapsedSections[3] && (
                <div className="p-6 space-y-6">
                  {/* CLB & Cổ vũ */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Tham gia CLB, Đội, Nhóm & Cổ vũ
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-800">Thành viên các CLB</div>
                          <div className="text-slate-500">+3 điểm / CLB</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateNumber('sec3_clubMemberships', scores.sec3_clubMemberships - 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">-</button>
                          <span className="w-8 text-center font-bold text-sm">{scores.sec3_clubMemberships}</span>
                          <button onClick={() => updateNumber('sec3_clubMemberships', scores.sec3_clubMemberships + 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-800">Tham gia cổ vũ các hoạt động</div>
                          <div className="text-slate-500">+2 điểm / hoạt động</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateNumber('sec3_cheerActivities', scores.sec3_cheerActivities - 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">-</button>
                          <span className="w-8 text-center font-bold text-sm">{scores.sec3_cheerActivities}</span>
                          <button onClick={() => updateNumber('sec3_cheerActivities', scores.sec3_cheerActivities + 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hoạt động triệu tập Đoàn - Hội */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Hoạt động chính trị triệu tập (Đoàn - Hội, Đại hội, Hội nghị)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-800">Tham gia theo triệu tập</div>
                          <div className="text-slate-500">+4 điểm / hoạt động</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateNumber('sec3_officialMeetings', scores.sec3_officialMeetings - 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">-</button>
                          <span className="w-8 text-center font-bold text-sm">{scores.sec3_officialMeetings}</span>
                          <button onClick={() => updateNumber('sec3_officialMeetings', scores.sec3_officialMeetings + 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50/20">
                        <div className="text-xs">
                          <div className="font-semibold text-rose-800">Vắng không lý do khi triệu tập</div>
                          <div className="text-rose-600 text-[11px]">-4 điểm / hoạt động</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateNumber('sec3_officialMeetingsAbsence', scores.sec3_officialMeetingsAbsence - 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">-</button>
                          <span className="w-8 text-center font-bold text-sm text-rose-700">{scores.sec3_officialMeetingsAbsence}</span>
                          <button onClick={() => updateNumber('sec3_officialMeetingsAbsence', scores.sec3_officialMeetingsAbsence + 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-300">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hoạt động Văn nghệ - Thể thao */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Tham gia hoạt động Văn hóa, Văn nghệ, Thể dục thể thao
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-4">
                      {[
                        { label: 'Cấp Lớp (+1đ)', field: 'sec3_artSport_class' },
                        { label: 'Cấp Khoa (+2đ)', field: 'sec3_artSport_dept' },
                        { label: 'Cấp Trường (+3đ)', field: 'sec3_artSport_school' },
                        { label: 'Tỉnh/Thành (+4đ)', field: 'sec3_artSport_city' }
                      ].map(item => (
                        <div key={item.field} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-2">
                          <div className="text-xs font-semibold text-slate-800">{item.label}</div>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => updateNumber(item.field, scores[item.field] - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                            <span className="w-6 text-center font-bold text-xs">{scores[item.field]}</span>
                            <button onClick={() => updateNumber(item.field, scores[item.field] + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hiến máu, phòng chống tệ nạn, kết nạp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <span className="text-xs font-bold text-slate-800 block">Hiến máu & Tuyên truyền an sinh</span>
                      <div className="flex items-center justify-between text-xs">
                        <span>Hiến máu / Công ích (+3đ/lần)</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateNumber('sec3_bloodDonation', scores.sec3_bloodDonation - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                          <span className="w-5 text-center font-bold">{scores.sec3_bloodDonation}</span>
                          <button onClick={() => updateNumber('sec3_bloodDonation', scores.sec3_bloodDonation + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span>Tuyên truyền phòng chống tệ nạn (+3đ/lần)</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateNumber('sec3_antiSocialEvils', scores.sec3_antiSocialEvils - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                          <span className="w-5 text-center font-bold">{scores.sec3_antiSocialEvils}</span>
                          <button onClick={() => updateNumber('sec3_antiSocialEvils', scores.sec3_antiSocialEvils + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <span className="text-xs font-bold text-slate-800 block">Kết nạp Đoàn / Đảng</span>
                      <label className="flex items-center gap-3 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={scores.sec3_joinedYouthUnion}
                          onChange={(e) => setScores({ ...scores, sec3_joinedYouthUnion: e.target.checked })}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <span className="font-semibold block text-slate-800">Được kết nạp Đoàn TNCS Hồ Chí Minh</span>
                          <span className="text-slate-500">+2 điểm</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={scores.sec3_joinedParty}
                          onChange={(e) => setScores({ ...scores, sec3_joinedParty: e.target.checked })}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <span className="font-semibold block text-slate-800">Được kết nạp vào Đảng Cộng sản Việt Nam</span>
                          <span className="text-slate-500">+3 điểm</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Khen thưởng phong trào */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Khen thưởng thành tích phong trào chính trị - xã hội, VH-VN-TT
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-4">
                      {[
                        { label: 'Cấp Khoa (+3đ)', field: 'sec3_movementAwards_dept' },
                        { label: 'Cấp Trường (+4đ)', field: 'sec3_movementAwards_school' },
                        { label: 'Tỉnh/Thành (+5đ)', field: 'sec3_movementAwards_city' },
                        { label: 'Trung ương (+6đ)', field: 'sec3_movementAwards_national' }
                      ].map(item => (
                        <div key={item.field} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-2">
                          <div className="text-xs font-semibold text-slate-800">{item.label}</div>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => updateNumber(item.field, scores[item.field] - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                            <span className="w-6 text-center font-bold text-xs">{scores[item.field]}</span>
                            <button onClick={() => updateNumber(item.field, scores[item.field] + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* -------------------- MỤC IV -------------------- */}
            <div id="section-4" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div
                onClick={() => toggleSection(4)}
                className="p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-200/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                    IV
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Ý Thức Công Dân Trong Quan Hệ Cộng Đồng
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tối đa: <span className="font-semibold text-slate-700">25 điểm</span> • Điểm tính: <span className="font-bold text-teal-600">{calculated.raw4}</span> (Nhận: <span className="font-bold text-emerald-600">{calculated.final4}</span>)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${calculated.final4 === 25 ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-50 text-teal-700'}`}>
                    {calculated.final4} / 25 đ
                  </span>
                  {collapsedSections[4] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {!collapsedSections[4] && (
                <div className="p-6 space-y-6">
                  {/* Chấp hành & Tuyên truyền đường lối */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      Ý thức chấp hành và tham gia tuyên truyền các chủ trương, chính sách
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scores.sec4_policyAwareness}
                          onChange={(e) => setScores({ ...scores, sec4_policyAwareness: e.target.checked })}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Tích cực tìm hiểu, chấp hành tốt đường lối Nhà nước</span>
                          <span className="text-slate-500">+2.5 điểm</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scores.sec4_policyAdvocacy}
                          onChange={(e) => setScores({ ...scores, sec4_policyAdvocacy: e.target.checked })}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Tích cực tham gia tuyên truyền, triển khai chủ trương</span>
                          <span className="text-slate-500">+2.5 điểm</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Hoạt động tình nguyện */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      Tham gia các hoạt động tình nguyện vì cộng đồng
                    </h4>
                    <div className="pl-4 space-y-3">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer max-w-md">
                        <input
                          type="checkbox"
                          checked={scores.sec4_volunteerSpirit}
                          onChange={(e) => setScores({ ...scores, sec4_volunteerSpirit: e.target.checked })}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Có ý thức tham gia các hoạt động tình nguyện vì cộng đồng</span>
                          <span className="text-slate-500">+3 điểm</span>
                        </div>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: 'Cấp Lớp (+2đ)', field: 'sec4_volunteer_class' },
                          { label: 'Cấp Khoa (+3đ)', field: 'sec4_volunteer_dept' },
                          { label: 'Cấp Trường (+4đ)', field: 'sec4_volunteer_school' }
                        ].map(item => (
                          <div key={item.field} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-2">
                            <div className="text-xs font-semibold text-slate-800">{item.label}</div>
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => updateNumber(item.field, scores[item.field] - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                              <span className="w-6 text-center font-bold text-xs">{scores[item.field]}</span>
                              <button onClick={() => updateNumber(item.field, scores[item.field] + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Khen thưởng tình nguyện */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      Khen thưởng hoạt động tình nguyện vì cộng đồng (biểu dương, khen thưởng)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-4">
                      {[
                        { label: 'Cấp Khoa (+3đ)', field: 'sec4_volunteerAwards_dept' },
                        { label: 'Cấp Trường (+4đ)', field: 'sec4_volunteerAwards_school' },
                        { label: 'Tỉnh/Thành (+5đ)', field: 'sec4_volunteerAwards_city' },
                        { label: 'Trung ương (+6đ)', field: 'sec4_volunteerAwards_national' }
                      ].map(item => (
                        <div key={item.field} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-2">
                          <div className="text-xs font-semibold text-slate-800">{item.label}</div>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => updateNumber(item.field, scores[item.field] - 1)} className="w-6 h-6 rounded bg-white border border-slate-300">-</button>
                            <span className="w-6 text-center font-bold text-xs">{scores[item.field]}</span>
                            <button onClick={() => updateNumber(item.field, scores[item.field] + 1)} className="w-6 h-6 rounded bg-white border border-slate-300">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* -------------------- MỤC V -------------------- */}
            <div id="section-5" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div
                onClick={() => toggleSection(5)}
                className="p-5 flex items-center justify-between cursor-pointer bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-200/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    V
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Ý Thức & Kết Quả Tham Gia Công Tác Phụ Trách Lớp, Đoàn Thể, Thành Tích Xuất Sắc
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tối đa: <span className="font-semibold text-slate-700">10 điểm</span> • Điểm tính: <span className="font-bold text-amber-600">{calculated.raw5}</span> (Nhận: <span className="font-bold text-emerald-600">{calculated.final5}</span>)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${calculated.final5 === 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {calculated.final5} / 10 đ
                  </span>
                  {collapsedSections[5] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {!collapsedSections[5] && (
                <div className="p-6 space-y-6">
                  {/* a. Hỗ trợ hoạt động */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      a. Hỗ trợ và tham gia tích cực vào hoạt động chung của lớp, tập thể, Trường
                    </h4>
                    <div className="pl-4">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer max-w-md">
                        <input
                          type="checkbox"
                          checked={scores.sec5_supportGeneralActivity}
                          onChange={(e) => setScores({ ...scores, sec5_supportGeneralActivity: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold block text-slate-800">Nhiệt tình hỗ trợ tập thể, lớp, khoa, trường</span>
                          <span className="text-slate-500">+3 điểm</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* b. Chức vụ cán bộ & Mức độ hoàn thành */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      b. Đánh giá mức độ hoàn thành nhiệm vụ cán bộ (Chỉ chọn 1 chức vụ cao nhất)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Chức vụ đảm nhiệm</label>
                        <select
                          value={scores.sec5_cadreRole}
                          onChange={(e) => setScores({ ...scores, sec5_cadreRole: e.target.value })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        >
                          <option value="none">Không giữ chức vụ</option>
                          <option value="bcs">Ban cán sự lớp, BCH Chi đoàn, BCH Chi hội, CLB-Đ-N</option>
                          <option value="dept_lead">Bí thư / PB Đoàn Khoa; LCH Trưởng / Phó; UV BCH Trường; CN CLB...</option>
                          <option value="school_lead">Ủy viên Ban Thường vụ Đoàn Trường, Ban Thư ký Hội SV, Chi ủy</option>
                        </select>
                      </div>

                      {scores.sec5_cadreRole !== 'none' && (
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">Mức độ hoàn thành nhiệm vụ</label>
                          <select
                            value={scores.sec5_cadrePerformance}
                            onChange={(e) => setScores({ ...scores, sec5_cadrePerformance: e.target.value })}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          >
                            <option value="none">-- Chọn mức độ --</option>
                            <option value="excellent">Hoàn thành Xuất sắc (+3đ đến +4đ)</option>
                            <option value="good">Hoàn thành Tốt (+2đ đến +3đ)</option>
                            <option value="passed">Hoàn thành nhiệm vụ (+1đ đến +2đ)</option>
                            <option value="failed">Không hoàn thành nhiệm vụ (-3đ đến -5đ)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* c. Khen thưởng thành tích đặc biệt */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      c. Sinh viên đạt được các thành tích đặc biệt (Chọn mức khen thưởng cao nhất)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-4">
                      {[
                        { val: 'none', title: 'Không có thành tích đặc biệt', pts: '0đ' },
                        { val: 'school', title: 'Cấp Trường: SV 5 Tốt, TNTT theo lời Bác...', pts: '+4 điểm' },
                        { val: 'city', title: 'Cấp Thành phố: SV 5 Tốt TP, Giải I-II-III NCKH...', pts: '+5 điểm' },
                        { val: 'national_second', title: 'Cấp TW: Khuyến khích NCKH Bộ, Bằng khen TW...', pts: '+6 điểm' },
                        { val: 'national_first', title: 'Cấp TW: SV 5 Tốt TW, Sao Tháng Giêng, Giải I-II-III Bộ...', pts: '+7 điểm' }
                      ].map(item => (
                        <label
                          key={item.val}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex flex-col justify-between transition ${
                            scores.sec5_specialMerit === item.val
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="specialMerit"
                              value={item.val}
                              checked={scores.sec5_specialMerit === item.val}
                              onChange={(e) => setScores({ ...scores, sec5_specialMerit: e.target.value })}
                              className="mt-0.5 text-amber-600"
                            />
                            <span className="text-slate-800 leading-snug">{item.title}</span>
                          </div>
                          <span className="text-amber-700 font-bold mt-2 self-end">{item.pts}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* ===================== PRINT TEMPLATE: BM.01/CTCT-HSSV ===================== */}
      {/* This view only displays when printing (Ctrl+P) or in print mode */}
      <div className="print-only text-black bg-white p-2 font-serif text-[12px] leading-tight">
        {/* Header Form */}
        <div className="flex justify-between items-start mb-2">
          <div className="text-center w-5/12">
            <div className="font-normal uppercase text-[11px]">BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
            <div className="font-bold text-[12px] uppercase">TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH</div>
            <div className="mt-1 font-semibold text-[11px]">KHOA: <span className="uppercase">{studentInfo.faculty || '...........................................'}</span></div>
          </div>
          <div className="text-center w-6/12">
            <div className="text-right text-[11px] font-bold">BM 01/CTCT-HSSV</div>
            <div className="font-bold text-[12px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="font-bold text-[12px]">Độc lập - Tự do - Hạnh phúc</div>
            <div className="text-[11px] mt-0.5">-------------------</div>
          </div>
        </div>

        <div className="text-center my-3">
          <h2 className="text-sm font-bold uppercase tracking-wider">PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN</h2>
          <div className="font-medium italic text-[12px] mt-1">
            {studentInfo.semester} - Năm học: {studentInfo.academicYear}
          </div>
        </div>

        {/* Student metadata */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-[12px]">
          <div>Họ tên: <strong className="uppercase">{studentInfo.fullName || '...................................................'}</strong></div>
          <div>MSSV: <strong>{studentInfo.mssv || '...........................................'}</strong></div>
          <div>Lớp: <strong>{studentInfo.classRoom || '...................................................'}</strong></div>
          <div>Khoa: <strong>{studentInfo.faculty || '...........................................'}</strong></div>
        </div>

        {/* Detailed Table */}
        <table className="w-full border-collapse border border-black text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-1 w-7/12" rowSpan={2}>NỘI DUNG ĐÁNH GIÁ</th>
              <th className="border border-black p-1 w-2/12" rowSpan={2}>KHUNG ĐIỂM</th>
              <th className="border border-black p-1 w-3/12" colSpan={3}>ĐIỂM ĐÁNH GIÁ</th>
            </tr>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-1 w-1/12">SV</th>
              <th className="border border-black p-1 w-1/12">LỚP</th>
              <th className="border border-black p-1 w-1/12">KHOA</th>
            </tr>
          </thead>
          <tbody>
            {/* Mục I */}
            <tr className="font-bold bg-slate-50">
              <td className="border border-black p-1">I. ĐÁNH GIÁ VỀ Ý THỨC THAM GIA HỌC TẬP</td>
              <td className="border border-black p-1 text-center">Tối đa 20 điểm</td>
              <td className="border border-black p-1 text-center font-bold text-blue-900">{calculated.final1}</td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">a. Tinh thần và thái độ trong học tập (Đúng giờ, chuẩn bị bài...)</td>
              <td className="border border-black p-1 text-center">0 - 3 điểm</td>
              <td className="border border-black p-1 text-center">{(scores.sec1_onTime ? 1.5 : 0) + (scores.sec1_prepared ? 1.5 : 0)}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">b. Tham gia NCKH, hội thảo, tọa đàm</td>
              <td className="border border-black p-1 text-center">3 - 5 điểm/HĐ</td>
              <td className="border border-black p-1 text-center">{scores.sec1_seminars * 3 + scores.sec1_researches * 5}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">c. Tham gia các kỳ thi, cuộc thi học thuật (Cổ vũ/Tham gia)</td>
              <td className="border border-black p-1 text-center">1 - 5 điểm/HĐ</td>
              <td className="border border-black p-1 text-center">{scores.sec1_cheerCompetitions * 1 + scores.sec1_deptCompetitions * 3 + scores.sec1_schoolCompetitions * 4 + scores.sec1_cityCompetitions * 5}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">d. Kết quả học tập của học kỳ ({scores.sec1_academicResult.toUpperCase()})</td>
              <td className="border border-black p-1 text-center">0 - 10 điểm</td>
              <td className="border border-black p-1 text-center">
                {{ none: 0, xs: 10, gioi: 8, kha: 6, tb: 5, yeu: 3, kem: 0 }[scores.sec1_academicResult]}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">e. Tinh thần vượt khó, phấn đấu vươn lên trong học tập</td>
              <td className="border border-black p-1 text-center">0 - 3 điểm</td>
              <td className="border border-black p-1 text-center">{scores.sec1_overcomingDifficulties}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">f. Khen thưởng - kỷ luật học thuật</td>
              <td className="border border-black p-1 text-center">+3 đến +6 / trừ</td>
              <td className="border border-black p-1 text-center">
                {scores.sec1_academicAwards_dept * 3 + scores.sec1_academicAwards_school * 4 + scores.sec1_academicAwards_city * 5 + scores.sec1_academicAwards_national * 6 - (scores.sec1_skippedSurveys * 3)}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>

            {/* Mục II */}
            <tr className="font-bold bg-slate-50">
              <td className="border border-black p-1">II. Ý THỨC CHẤP HÀNH NỘI QUY, QUY CHẾ, QUY ĐỊNH</td>
              <td className="border border-black p-1 text-center">Tối đa 25 điểm</td>
              <td className="border border-black p-1 text-center font-bold text-blue-900">{calculated.final2}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">a. Chấp hành các văn bản chỉ đạo, nội quy, quy định, nộp học phí, BHYT</td>
              <td className="border border-black p-1 text-center">Theo quy định</td>
              <td className="border border-black p-1 text-center">
                {(scores.sec2_complyDormRegulations ? 3 : 0) + (scores.sec2_tuitionOnTime ? 3 : 0) + (scores.sec2_insuranceOnTime ? 2 : 0) - (scores.sec2_campusViolations * 3) - (scores.sec2_deptActivityAbsence * 3) - (scores.sec2_schoolActivityAbsence * 4) - (scores.sec2_lateSubmissionDocs * 3) - (scores.sec2_noInsurance ? 5 : 0)}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">b. Tuần Sinh hoạt công dân - Sinh viên</td>
              <td className="border border-black p-1 text-center">0 - 10 điểm</td>
              <td className="border border-black p-1 text-center">{scores.sec2_citizenWeek === 'passed' ? 10 : 0}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">c. Đánh giá kết quả RLSV đúng thời hạn</td>
              <td className="border border-black p-1 text-center">2 điểm</td>
              <td className="border border-black p-1 text-center">{scores.sec2_onTimeEvaluation ? 2 : 0}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">d. Sinh hoạt lớp định kỳ</td>
              <td className="border border-black p-1 text-center">0 - 5 điểm</td>
              <td className="border border-black p-1 text-center">{scores.sec2_classMeetings}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>

            {/* Mục III */}
            <tr className="font-bold bg-slate-50">
              <td className="border border-black p-1">III. Ý THỨC THAM GIA HOẠT ĐỘNG CHÍNH TRỊ, XÃ HỘI, VH-VN-TT</td>
              <td className="border border-black p-1 text-center">Tối đa 20 điểm</td>
              <td className="border border-black p-1 text-center font-bold text-blue-900">{calculated.final3}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">a. Tham gia CLB, cổ vũ, văn nghệ, thể dục thể thao</td>
              <td className="border border-black p-1 text-center">1 - 4 điểm/lần</td>
              <td className="border border-black p-1 text-center">
                {scores.sec3_clubMemberships * 3 + scores.sec3_cheerActivities * 2 + scores.sec3_artSport_class * 1 + scores.sec3_artSport_dept * 2 + scores.sec3_artSport_school * 3 + scores.sec3_artSport_city * 4}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">b. Tham gia triệu tập của Đoàn - Hội</td>
              <td className="border border-black p-1 text-center">+/- 4 điểm/HĐ</td>
              <td className="border border-black p-1 text-center">{scores.sec3_officialMeetings * 4 - scores.sec3_officialMeetingsAbsence * 4}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">c. Hiến máu tình nguyện, phòng chống tệ nạn xã hội</td>
              <td className="border border-black p-1 text-center">3 điểm/hoạt động</td>
              <td className="border border-black p-1 text-center">{scores.sec3_bloodDonation * 3 + scores.sec3_antiSocialEvils * 3}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">d. Kết nạp Đoàn / Đảng; Khen thưởng phong trào</td>
              <td className="border border-black p-1 text-center">Theo quy định</td>
              <td className="border border-black p-1 text-center">
                {(scores.sec3_joinedYouthUnion ? 2 : 0) + (scores.sec3_joinedParty ? 3 : 0) + scores.sec3_movementAwards_dept * 3 + scores.sec3_movementAwards_school * 4 + scores.sec3_movementAwards_city * 5 + scores.sec3_movementAwards_national * 6}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>

            {/* Mục IV */}
            <tr className="font-bold bg-slate-50">
              <td className="border border-black p-1">IV. Ý THỨC CÔNG DÂN TRONG QUAN HỆ CỘNG ĐỒNG</td>
              <td className="border border-black p-1 text-center">Tối đa 25 điểm</td>
              <td className="border border-black p-1 text-center font-bold text-blue-900">{calculated.final4}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">a. Ý thức chấp hành & tuyên truyền chủ trương, chính sách</td>
              <td className="border border-black p-1 text-center">0 - 5 điểm</td>
              <td className="border border-black p-1 text-center">{(scores.sec4_policyAwareness ? 2.5 : 0) + (scores.sec4_policyAdvocacy ? 2.5 : 0)}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">b. Tham gia hoạt động tình nguyện vì cộng đồng (Lớp/Khoa/Trường)</td>
              <td className="border border-black p-1 text-center">2 - 4 điểm/lần</td>
              <td className="border border-black p-1 text-center">
                {(scores.sec4_volunteerSpirit ? 3 : 0) + scores.sec4_volunteer_class * 2 + scores.sec4_volunteer_dept * 3 + scores.sec4_volunteer_school * 4}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">c. Khen thưởng tình nguyện vì cộng đồng</td>
              <td className="border border-black p-1 text-center">+3 đến +6 điểm</td>
              <td className="border border-black p-1 text-center">
                {scores.sec4_volunteerAwards_dept * 3 + scores.sec4_volunteerAwards_school * 4 + scores.sec4_volunteerAwards_city * 5 + scores.sec4_volunteerAwards_national * 6}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>

            {/* Mục V */}
            <tr className="font-bold bg-slate-50">
              <td className="border border-black p-1">V. Ý THỨC VÀ KẾT QUẢ THAM GIA CÔNG TÁC PHỤ TRÁCH LỚP, ĐOÀN THỂ</td>
              <td className="border border-black p-1 text-center">Tối đa 10 điểm</td>
              <td className="border border-black p-1 text-center font-bold text-blue-900">{calculated.final5}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">a. Hỗ trợ và tham gia tích cực hoạt động tập thể</td>
              <td className="border border-black p-1 text-center">3 điểm</td>
              <td className="border border-black p-1 text-center">{scores.sec5_supportGeneralActivity ? 3 : 0}</td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">b. Mức độ hoàn thành nhiệm vụ cán bộ</td>
              <td className="border border-black p-1 text-center">-5 đến +4 điểm</td>
              <td className="border border-black p-1 text-center">
                {(() => {
                  const cadrePoints = {
                    bcs: { excellent: 3, good: 2, passed: 1, failed: -3 },
                    dept_lead: { excellent: 4, good: 3, passed: 2, failed: -5 },
                    school_lead: { excellent: 4, good: 3, passed: 2, failed: -5 }
                  };
                  return (cadrePoints[scores.sec5_cadreRole] && cadrePoints[scores.sec5_cadreRole][scores.sec5_cadrePerformance]) || 0;
                })()}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black p-1 pl-4">c. Khen thưởng thành tích đặc biệt (SV5T, NCKH cấp Bộ...)</td>
              <td className="border border-black p-1 text-center">+4 đến +7 điểm</td>
              <td className="border border-black p-1 text-center">
                {{ none: 0, school: 4, city: 5, national_second: 6, national_first: 7 }[scores.sec5_specialMerit]}
              </td>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1"></td>
            </tr>

            {/* Total Row */}
            <tr className="font-bold text-[12px] bg-slate-100">
              <td className="border border-black p-1.5 uppercase">TỔNG CỘNG:</td>
              <td className="border border-black p-1.5 text-center">100 điểm</td>
              <td className="border border-black p-1.5 text-center text-blue-900 font-extrabold text-[13px]">{calculated.total}</td>
              <td className="border border-black p-1.5"></td>
              <td className="border border-black p-1.5"></td>
            </tr>
          </tbody>
        </table>

        {/* Classification result checkbox representation */}
        <div className="mt-3 p-2 border border-black flex justify-between items-center text-[11px] font-semibold">
          <span className="uppercase">ĐẠT LOẠI RÈN LUYỆN:</span>
          <span>{calculated.classification.text === 'Xuất sắc' ? '☒' : '☐'} XUẤT SẮC</span>
          <span>{calculated.classification.text === 'Tốt' ? '☒' : '☐'} TỐT</span>
          <span>{calculated.classification.text === 'Khá' ? '☒' : '☐'} KHÁ</span>
          <span>{calculated.classification.text === 'Trung bình' ? '☒' : '☐'} TRUNG BÌNH</span>
          <span>{calculated.classification.text.startsWith('Yếu') ? '☒' : '☐'} YẾU</span>
          <span>{calculated.classification.text.startsWith('Kém') ? '☒' : '☐'} KÉM</span>
        </div>

        {/* Signatures */}
        <div className="mt-4 text-right italic text-[11px]">
          TP. Hồ Chí Minh, ngày ..... tháng ..... năm 20...
        </div>

        <div className="grid grid-cols-4 text-center mt-2 text-[11px] font-semibold gap-2">
          <div>
            <div>CỐ VẤN HỌC TẬP</div>
            <div className="font-normal italic text-[10px]">(Ký và ghi rõ họ tên)</div>
            <div className="h-14"></div>
          </div>
          <div>
            <div>LỚP TRƯỞNG</div>
            <div className="font-normal italic text-[10px]">(Ký và ghi rõ họ tên)</div>
            <div className="h-14"></div>
          </div>
          <div>
            <div>TM. BCH CHI ĐOÀN</div>
            <div className="font-normal italic text-[10px]">(Ký và ghi rõ họ tên)</div>
            <div className="h-14"></div>
          </div>
          <div>
            <div>SINH VIÊN</div>
            <div className="font-normal italic text-[10px]">(Ký và ghi rõ họ tên)</div>
            <div className="h-14"></div>
            <div className="font-bold uppercase text-[11px] mt-2">{studentInfo.fullName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
