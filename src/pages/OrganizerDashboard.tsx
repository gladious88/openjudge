import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  Percent, 
  AlertTriangle, 
  Award, 
  PlusCircle, 
  ArrowUpRight,
  Shield,
  BarChart2,
  Edit3,
  History,
  RotateCcw,
  X,
  Save,
  Sparkles
} from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';
import { StatusDonutChart } from '../components/charts/StatusDonutChart';
import { ScoreDistributionChart } from '../components/charts/ScoreDistributionChart';
import { CriteriaBarChart } from '../components/charts/CriteriaBarChart';
import { JudgeVarianceBoxPlot } from '../components/charts/JudgeVarianceBoxPlot';
import { DisagreementBarChart } from '../components/charts/DisagreementBarChart';

export const OrganizerDashboard: React.FC = () => {
  const { 
    competition, 
    submissions, 
    kpis, 
    judges, 
    loadDemoCompetition, 
    openJudgePrinciple,
    updateOpenJudgePrinciple,
    resetOpenJudgePrinciple
  } = useCompetition();

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  const [titleInput, setTitleInput] = useState<string>(openJudgePrinciple.title);
  const [descriptionInput, setDescriptionInput] = useState<string>(openJudgePrinciple.description);
  const [taglineInput, setTaglineInput] = useState<string>(openJudgePrinciple.tagline || '');

  const handleOpenEdit = () => {
    setTitleInput(openJudgePrinciple.title);
    setDescriptionInput(openJudgePrinciple.description);
    setTaglineInput(openJudgePrinciple.tagline || '');
    setIsEditModalOpen(true);
  };

  const handleSavePrinciple = () => {
    if (!titleInput.trim() || !descriptionInput.trim()) return;
    updateOpenJudgePrinciple(titleInput, descriptionInput, taglineInput);
    setIsEditModalOpen(false);
  };

  const handleResetPrinciple = () => {
    resetOpenJudgePrinciple();
    setIsEditModalOpen(false);
  };

  const isNoCompetition = !competition || submissions.length === 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/20 shadow-xs">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#9D0D2F] bg-white/80 px-2.5 py-1 rounded-full border border-[#E87D87]">
                Organizer Command Center
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#35B779]/10 border border-[#35B779]/30 text-[#35B779] font-bold">
                Live Data Store
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">
              {competition?.name || 'Competition Dashboard'}
            </h1>
            <p className="text-xs text-[#3E0D1E]/75 mt-1 font-semibold">
              Standardized rubric first-read telemetry • "AI assists. Humans decide."
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/organizer/competitions/new"
              className="px-4 py-2.5 btn-primary flex items-center space-x-1.5 text-xs"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Create Competition</span>
            </Link>
          </div>
        </div>

        {/* OPENJUDGE PRINCIPLE CARD */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/20 bg-gradient-to-r from-[#ECA59D]/95 via-white/85 to-[#ECA59D]/95 space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B4204A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E87D87]/50 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#9D0D2F] text-white flex items-center justify-center shadow-md shadow-rose-950/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9D0D2F]">Governance Policy</span>
                <h2 className="text-xl font-extrabold text-[#3E0D1E]">{openJudgePrinciple.title}</h2>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-3.5 py-1.5 btn-secondary flex items-center space-x-1.5 text-xs"
              >
                <History className="w-3.5 h-3.5 text-[#9D0D2F]" />
                <span>View History ({openJudgePrinciple.history.length})</span>
              </button>

              <button
                onClick={handleOpenEdit}
                className="px-4 py-1.5 btn-primary flex items-center space-x-1.5 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
                <span>Edit Principle</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-extrabold text-[#3E0D1E] leading-snug">
              "{openJudgePrinciple.description}"
            </p>
            {openJudgePrinciple.tagline && (
              <p className="text-xs text-[#9D0D2F] font-bold pt-1">
                {openJudgePrinciple.tagline}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#3E0D1E]/70 pt-2 border-t border-[#E87D87]/40 font-bold">
            <span>Last Updated: <strong className="text-[#3E0D1E] font-extrabold">{openJudgePrinciple.updatedAt}</strong></span>
            <span>Policy Authority: <strong className="text-[#9D0D2F] font-extrabold">{openJudgePrinciple.updatedBy}</strong></span>
          </div>
        </div>

        {isNoCompetition ? (
          <div className="glass-panel p-12 rounded-3xl text-center max-w-lg mx-auto my-16 space-y-4">
            <Shield className="w-12 h-12 text-[#9D0D2F] mx-auto" />
            <h2 className="text-xl font-bold text-[#3E0D1E]">No competitions yet</h2>
            <p className="text-xs text-[#3E0D1E]/70">
              Create a new competition or load the pre-seeded National Student Innovation Challenge dataset.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/organizer/competitions/new"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white text-xs font-bold"
              >
                Create Competition
              </Link>
              <button
                onClick={loadDemoCompetition}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-[#3E0D1E] text-xs font-bold border border-[#E87D87]"
              >
                Load Demo Competition
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              <div className="glass-card p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between text-[#3E0D1E]/70 mb-2">
                  <span className="text-[11px] font-extrabold uppercase">Total Submissions</span>
                  <FileText className="w-4 h-4 text-[#9D0D2F]" />
                </div>
                <div className="text-2xl font-extrabold text-[#3E0D1E]">{kpis.totalSubmissions}</div>
                <span className="text-[10px] text-[#3E0D1E]/70 font-semibold mt-1 block">Full dataset size</span>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between text-[#3E0D1E]/70 mb-2">
                  <span className="text-[11px] font-extrabold uppercase">AI Reviewed</span>
                  <BrainCircuit className="w-4 h-4 text-[#B4204A]" />
                </div>
                <div className="text-2xl font-extrabold text-[#9D0D2F]">{kpis.aiReviewed}</div>
                <span className="text-[10px] text-[#9D0D2F] font-bold mt-1 block">{Math.round((kpis.aiReviewed/Math.max(1, kpis.totalSubmissions))*100)}% AI coverage</span>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between text-[#3E0D1E]/70 mb-2">
                  <span className="text-[11px] font-extrabold uppercase">Human Reviews</span>
                  <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
                </div>
                <div className="text-2xl font-extrabold text-[#35B779]">{kpis.humanReviewsCompleted}</div>
                <span className="text-[10px] text-[#35B779] font-bold mt-1 block">Completed evals</span>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between text-[#3E0D1E]/70 mb-2">
                  <span className="text-[11px] font-extrabold uppercase">Judging Progress</span>
                  <Percent className="w-4 h-4 text-[#F2B84B]" />
                </div>
                <div className="text-2xl font-extrabold text-[#F2B84B]">{kpis.judgingProgress}%</div>
                <div className="w-full h-1.5 bg-white/60 rounded-full mt-2 overflow-hidden border border-[#E87D87]/40">
                  <div className="h-full bg-[#F2B84B] rounded-full" style={{ width: `${kpis.judgingProgress}%` }} />
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between text-[#3E0D1E]/70 mb-2">
                  <span className="text-[11px] font-extrabold uppercase">Flagged Projects</span>
                  <AlertTriangle className="w-4 h-4 text-[#D94A63]" />
                </div>
                <div className="text-2xl font-extrabold text-[#D94A63]">{kpis.flaggedProjects}</div>
                <span className="text-[10px] text-[#D94A63] font-bold mt-1 block">Requires human verification</span>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between text-[#3E0D1E]/70 mb-2">
                  <span className="text-[11px] font-extrabold uppercase">Judge Agreement</span>
                  <Award className="w-4 h-4 text-[#9D0D2F]" />
                </div>
                <div className="text-2xl font-extrabold text-[#9D0D2F]">{kpis.judgeAgreement}%</div>
                <span className="text-[10px] text-[#3E0D1E]/70 font-semibold mt-1 block">Within ±1.0 pt tolerance</span>
              </div>

            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="glass-panel p-5 rounded-3xl border border-white/20 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#9D0D2F]" />
                    <span>Submission Status Distribution</span>
                  </h3>
                  <span className="text-[11px] text-[#3E0D1E]/70 font-bold">{submissions.length} Projects</span>
                </div>
                <StatusDonutChart submissions={submissions} />
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/20 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#35B779]" />
                    <span>AI vs. Human Score Distribution</span>
                  </h3>
                  <span className="text-[11px] text-[#3E0D1E]/70 font-bold">Overlaid Histogram</span>
                </div>
                <ScoreDistributionChart submissions={submissions} />
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/20 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#9D0D2F]" />
                    <span>Criteria Performance (Average Scores)</span>
                  </h3>
                  <span className="text-[11px] text-[#3E0D1E]/70 font-bold">Weighted 100% Total</span>
                </div>
                <CriteriaBarChart submissions={submissions} competition={competition} />
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/20 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#F2B84B]" />
                    <span>Judge Scoring Variance (Personas A–E)</span>
                  </h3>
                  <Link
                    to={`/organizer/competitions/${competition.id}/calibration`}
                    className="text-xs text-[#9D0D2F] hover:text-[#B4204A] font-bold flex items-center space-x-1"
                  >
                    <span>Calibration View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <JudgeVarianceBoxPlot judges={judges} />
              </div>

            </div>

            {/* Disagreement Queue */}
            <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#D94A63]" />
                    <span>Top Score Disagreements (|AI − Human|)</span>
                  </h3>
                  <p className="text-xs text-[#3E0D1E]/70 font-semibold mt-0.5">
                    Projects where human judge score differs notably from AI recommendation. Click "View" for diff details.
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#D94A63]/10 border border-[#D94A63]/30 text-[#D94A63] font-bold">
                  Review Priority Queue
                </span>
              </div>
              <DisagreementBarChart submissions={submissions} competition={competition} />
            </div>
          </>
        )}

      </main>

      {/* EDIT PRINCIPLE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3E0D1E]/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-2xl space-y-6 bg-[#ECA59D]/95">
            
            <div className="flex items-center justify-between border-b border-[#E87D87]/50 pb-4">
              <div className="flex items-center space-x-2 text-[#9D0D2F] font-extrabold text-base">
                <Edit3 className="w-5 h-5 text-[#9D0D2F]" />
                <span>Edit OpenJudge Principle</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-[#3E0D1E]/60 hover:text-[#3E0D1E] hover:bg-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#9D0D2F] uppercase tracking-wider mb-2">
                  Principle Title
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] font-extrabold text-sm focus:outline-none focus:border-[#9D0D2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#9D0D2F] uppercase tracking-wider mb-2">
                  Principle Description
                </label>
                <textarea
                  rows={3}
                  value={descriptionInput}
                  onChange={e => setDescriptionInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] text-xs font-bold focus:outline-none focus:border-[#9D0D2F] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#9D0D2F] uppercase tracking-wider mb-2">
                  Short Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={taglineInput}
                  onChange={e => setTaglineInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] text-xs font-bold focus:outline-none focus:border-[#9D0D2F]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E87D87]/50">
              <button
                onClick={handleResetPrinciple}
                className="px-4 py-2 btn-secondary flex items-center space-x-1.5 text-xs"
                title="Reset to default OpenJudge principle"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#9D0D2F]" />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrinciple}
                  className="px-5 py-2 btn-primary flex items-center space-x-1.5 text-xs"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW HISTORY MODAL */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3E0D1E]/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-2xl space-y-6 bg-[#ECA59D]/95">
            
            <div className="flex items-center justify-between border-b border-[#E87D87]/50 pb-4">
              <div className="flex items-center space-x-2 text-[#9D0D2F] font-extrabold text-base">
                <History className="w-5 h-5 text-[#9D0D2F]" />
                <span>OpenJudge Principle Revision History</span>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1.5 rounded-xl text-[#3E0D1E]/60 hover:text-[#3E0D1E] hover:bg-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {openJudgePrinciple.history.map(item => (
                <div key={item.version} className="p-4 rounded-2xl bg-white/90 border border-[#E87D87] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#9D0D2F] bg-rose-50 px-2.5 py-0.5 rounded-full text-[11px] border border-[#E87D87]">
                      Version {item.version}
                    </span>
                    <span className="text-[11px] text-[#3E0D1E]/70 font-semibold">{item.changedAt} • {item.changedBy}</span>
                  </div>
                  <h4 className="font-extrabold text-[#3E0D1E] text-sm">{item.title}</h4>
                  <p className="text-[#3E0D1E] leading-relaxed font-semibold">"{item.description}"</p>
                  {item.tagline && <p className="text-[11px] text-[#9D0D2F] font-bold italic">{item.tagline}</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-5 py-2 btn-primary text-xs"
              >
                Close History
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
