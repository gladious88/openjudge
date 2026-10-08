import React, { useState } from 'react';
import { Award, Download, FileText, Edit2 } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';
import { exportToCSV, exportToPDFSummary } from '../utils/exportUtils';
import { Submission, SubmissionStatus } from '../types';

export const FinalResultsPage: React.FC = () => {
  const { competition, submissions, updateSubmission } = useCompetition();

  const [selectedSubForDecision, setSelectedSubForDecision] = useState<Submission | null>(null);
  const [newStatus, setNewStatus] = useState<SubmissionStatus>('Finalist');
  const [customFinalScore, setCustomFinalScore] = useState<number>(0);

  const sortedSubmissions = [...submissions].sort((a, b) => {
    const scoreA = a.finalScore ?? a.humanScore ?? a.aiScore;
    const scoreB = b.finalScore ?? b.humanScore ?? b.aiScore;
    return scoreB - scoreA;
  });

  const handleOpenDecisionPanel = (sub: Submission) => {
    setSelectedSubForDecision(sub);
    setNewStatus(sub.status);
    setCustomFinalScore(sub.finalScore ?? sub.humanScore ?? sub.aiScore);
  };

  const handleConfirmDecision = () => {
    if (!selectedSubForDecision) return;

    updateSubmission(selectedSubForDecision.id, {
      status: newStatus,
      finalScore: customFinalScore
    });

    setSelectedSubForDecision(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>Official Competition Leaderboard</span>
              </span>
              <span className="text-xs font-extrabold text-[#35B779] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Calibrated Results
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">
              Final Decision & Leaderboard
            </h1>
            <p className="text-xs text-[#3E0D1E]/75 mt-1 font-semibold">
              Final project rankings for <span className="font-semibold text-[#9D0D2F]">{competition.name}</span>. Human judges retain complete final decision control.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCSV(submissions, competition.name)}
              className="px-4 py-2.5 btn-secondary flex items-center space-x-1.5 text-xs"
            >
              <Download className="w-4 h-4 text-[#9D0D2F]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportToPDFSummary(submissions, competition)}
              className="px-4 py-2.5 btn-primary flex items-center space-x-1.5 text-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Export Summary PDF</span>
            </button>
          </div>
        </div>

        {/* Podium Top 3 */}
        {sortedSubmissions.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Rank 2 */}
            <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-3 relative overflow-hidden order-2 md:order-1">
              <div className="flex justify-between items-center">
                <span className="w-9 h-9 rounded-2xl bg-[#3E0D1E] text-white font-black text-sm flex items-center justify-center shadow-xs">
                  2
                </span>
                <span className="text-xs font-bold text-[#3E0D1E] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#E87D87]/60">
                  Runner Up
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#3E0D1E]">{sortedSubmissions[1].projectName}</h3>
                <span className="text-xs text-slate-600">Team {sortedSubmissions[1].teamName}</span>
              </div>
              <div className="pt-2 border-t border-[#E87D87]/40 flex items-center justify-between">
                <span className="text-xs text-slate-700 font-medium">Final Score</span>
                <span className="text-xl font-extrabold text-[#9D0D2F] font-mono">
                  {(sortedSubmissions[1].finalScore ?? sortedSubmissions[1].aiScore).toFixed(1)}/10
                </span>
              </div>
            </div>

            {/* Rank 1 Winner */}
            <div className="glass-card p-7 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-white space-y-3 relative overflow-hidden order-1 md:order-2 shadow-md">
              <div className="flex justify-between items-center">
                <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-base flex items-center justify-center shadow-md shadow-amber-500/30">
                  1
                </span>
                <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Grand Winner</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#3E0D1E]">{sortedSubmissions[0].projectName}</h3>
                <span className="text-xs font-semibold text-amber-900">Team {sortedSubmissions[0].teamName}</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Final Score</span>
                <span className="text-2xl font-black text-amber-950 font-mono">
                  {(sortedSubmissions[0].finalScore ?? sortedSubmissions[0].aiScore).toFixed(1)}/10
                </span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-3 relative overflow-hidden order-3">
              <div className="flex justify-between items-center">
                <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center shadow-xs border border-amber-300">
                  3
                </span>
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                  2nd Runner Up
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#3E0D1E]">{sortedSubmissions[2].projectName}</h3>
                <span className="text-xs text-slate-600">Team {sortedSubmissions[2].teamName}</span>
              </div>
              <div className="pt-2 border-t border-[#E87D87]/40 flex items-center justify-between">
                <span className="text-xs text-slate-700 font-medium">Final Score</span>
                <span className="text-xl font-extrabold text-[#9D0D2F] font-mono">
                  {(sortedSubmissions[2].finalScore ?? sortedSubmissions[2].aiScore).toFixed(1)}/10
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Full Rankings Table */}
        <div className="glass-panel rounded-3xl border border-white/20 overflow-hidden shadow-2xs space-y-4 p-6">
          <h3 className="text-sm font-bold text-[#3E0D1E]">Full Competition Rankings</h3>
          
          <div className="divide-y divide-[#E87D87]/30 text-xs">
            {sortedSubmissions.map((sub, idx) => (
              <div key={sub.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-white border border-[#E87D87]/60 text-[#3E0D1E] font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-extrabold text-[#3E0D1E] block text-sm">{sub.projectName}</span>
                    <span className="text-[#3E0D1E]/70 font-semibold">{sub.teamName} • {sub.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#9D0D2F]/10 text-[#9D0D2F] font-bold text-xs border border-[#E87D87]/60">
                    {sub.status}
                  </span>

                  <span className="text-base font-extrabold text-[#9D0D2F] font-mono">
                    {(sub.finalScore ?? sub.humanScore ?? sub.aiScore).toFixed(1)}/10
                  </span>

                  <button
                    onClick={() => handleOpenDecisionPanel(sub)}
                    className="p-1.5 rounded-lg bg-white border border-[#E87D87]/60 hover:bg-[#9D0D2F]/10 text-[#3E0D1E] transition-colors"
                    title="Override Status or Final Score"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#9D0D2F]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Override Modal */}
        {selectedSubForDecision && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E0D1E]/50 backdrop-blur-md animate-fade-in">
            <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-white/80 space-y-4 bg-[#ECA59D] shadow-2xl">
              <h3 className="text-lg font-extrabold text-[#3E0D1E]">
                Override Final Decision
              </h3>
              <p className="text-xs text-[#3E0D1E]/80">
                Adjusting status for <strong className="text-[#3E0D1E]">{selectedSubForDecision.projectName}</strong>
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#3E0D1E] uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as SubmissionStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E87D87] text-[#3E0D1E] font-semibold"
                  >
                    <option value="Finalist">Finalist</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Disqualified">Disqualified</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3E0D1E] uppercase tracking-wider mb-1">Final Score Override</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={customFinalScore}
                    onChange={e => setCustomFinalScore(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E87D87] text-[#3E0D1E] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E87D87]/40">
                <button
                  onClick={() => setSelectedSubForDecision(null)}
                  className="px-4 py-2 btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDecision}
                  className="px-5 py-2 btn-primary text-xs"
                >
                  Save Decision
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
