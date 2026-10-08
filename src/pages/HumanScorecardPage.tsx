import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sliders, CheckCircle2, Sparkles } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';
import { calculateWeightedScore } from '../utils/scoring';

export const HumanScorecardPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const { submissions, competition, activeJudgeId, judges, submitHumanEvaluation } = useCompetition();

  const currentJudge = judges.find(j => j.id === activeJudgeId) || judges[0];
  const submission = submissions.find(s => s.id === submissionId) || submissions[0];

  const existingEval = submission.humanEvaluations.find(e => e.judgeId === activeJudgeId);

  const [scoreInputs, setScoreInputs] = useState<Record<string, number>>(() => {
    if (existingEval) return existingEval.scores;
    const initial: Record<string, number> = {};
    competition.criteria.forEach(crit => {
      initial[crit.id] = 7.5;
    });
    return initial;
  });

  const [strengths, setStrengths] = useState<string>(existingEval?.strengths || '');
  const [concerns, setConcerns] = useState<string>(existingEval?.concerns || '');
  const [questions] = useState<string>(existingEval?.questions || '');
  const [justificationNote] = useState<string>(existingEval?.justificationNote || '');

  const currentWeightedTotal = calculateWeightedScore(scoreInputs, competition.criteria);

  const handleScoreChange = (critId: string, value: number) => {
    setScoreInputs(prev => ({ ...prev, [critId]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitHumanEvaluation(
      submission.id,
      activeJudgeId,
      scoreInputs,
      strengths,
      concerns,
      questions,
      justificationNote
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-[#ECA59D]/40 px-2.5 py-1 rounded-full border border-[#ECA59D]/60">
                Human Judge Scorecard
              </span>
              <span className="text-xs font-extrabold text-[#3E0D1E]">
                Persona: {currentJudge.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">
              Scoring: {submission.projectName}
            </h1>
            <p className="text-xs text-[#3E0D1E]/80 mt-1 font-medium">
              Evaluating project for team <span className="font-semibold text-[#9D0D2F]">{submission.teamName}</span> against {competition.name} rubric.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right p-3 rounded-2xl bg-[#9D0D2F]/10 border border-[#B4204A]/30 text-xs">
              <span className="text-[#9D0D2F] font-bold block uppercase text-[10px]">Weighted Score</span>
              <span className="text-xl font-extrabold text-[#3E0D1E] font-mono">{currentWeightedTotal.toFixed(1)} / 10</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Score Sliders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-6">
              <h3 className="text-base font-extrabold text-[#3E0D1E] flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#9D0D2F]" />
                <span>Rubric Criteria Evaluation</span>
              </h3>

              <div className="space-y-6">
                {competition.criteria.map(crit => (
                  <div key={crit.id} className="p-4 rounded-2xl bg-white/60 border border-[#9D0D2F]/20 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-[#3E0D1E] text-sm block">{crit.name} ({crit.weight}%)</span>
                        <span className="text-[#9D0D2F]">{crit.description}</span>
                      </div>
                      <span className="text-xl font-extrabold text-[#3E0D1E] font-mono px-3 py-1 rounded-xl bg-[#9D0D2F]/10 border border-[#B4204A]/30">
                        {scoreInputs[crit.id] || 7.5}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={scoreInputs[crit.id] || 7.5}
                      onChange={e => handleScoreChange(crit.id, Number(e.target.value))}
                      className="w-full accent-[#9D0D2F]"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-[#9D0D2F]/20">
                <div>
                  <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                    Key Strengths
                  </label>
                  <textarea
                    rows={2}
                    value={strengths}
                    onChange={e => setStrengths(e.target.value)}
                    placeholder="Note positive highlights of architecture or impact..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                    Concerns / Risks
                  </label>
                  <textarea
                    rows={2}
                    value={concerns}
                    onChange={e => setConcerns(e.target.value)}
                    placeholder="Note potential scalability, team, or technical risks..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="w-full py-3 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Scorecard Evaluation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: AI Side-by-Side Evidence */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
              <div className="flex items-center justify-between border-b border-[#9D0D2F]/20 pb-3">
                <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#9D0D2F]" />
                  <span>AI Reference Brief</span>
                </h3>
                <span className="text-xs font-extrabold text-[#3E0D1E] bg-[#9D0D2F]/10 px-2.5 py-0.5 rounded-full border border-[#B4204A]/30">
                  AI: {submission.aiScore}/10
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {submission.agentScores.map(agent => (
                  <div key={agent.agentId} className="p-3 rounded-xl bg-white/60 border border-[#9D0D2F]/20 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#3E0D1E]">{agent.agentName}</span>
                      <span className="text-[#9D0D2F]">{agent.score}/10</span>
                    </div>
                    <p className="text-[#3E0D1E]/90 text-[11px] leading-relaxed">{agent.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
