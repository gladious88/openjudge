import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Shield, 
  Cpu, 
  MessageSquare, 
  Layers, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Radio,
  RotateCcw,
  Code,
  ExternalLink
} from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';


export const ProjectAnalysisPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { submissions, competition, submitHumanEvaluation, activeJudgeId, runAiAnalysisForSubmission } = useCompetition();

  const tabParam = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [isReAnalyzing, setIsReAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab')!);
    }
  }, [searchParams]);

  const submission = submissions.find(s => s.id === submissionId) || submissions[0];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleReRunAi = async () => {
    setIsReAnalyzing(true);
    await runAiAnalysisForSubmission(submission.id);
    setIsReAnalyzing(false);
  };

  const existingEval = submission.humanEvaluations.find(e => e.judgeId === activeJudgeId);

  const [scoreInputs, setScoreInputs] = useState<Record<string, number>>(() => {
    if (existingEval) return existingEval.scores;
    const initial: Record<string, number> = {};
    competition.criteria.forEach(crit => {
      initial[crit.id] = 7.5;
    });
    return initial;
  });

  const [strengths] = useState<string>(existingEval?.strengths || '');
  const [concerns] = useState<string>(existingEval?.concerns || '');
  const [questions] = useState<string>(existingEval?.questions || '');
  const [justificationNote] = useState<string>(existingEval?.justificationNote || '');

  const handleScoreChange = (critId: string, value: number) => {
    setScoreInputs(prev => ({ ...prev, [critId]: value }));
  };

  const handleScorecardSubmit = (e: React.FormEvent) => {
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'panel', label: 'AI Judging Panel', icon: Cpu },
    { id: 'debate', label: 'Debate', icon: MessageSquare },
    { id: 'explainable', label: 'Explainable Scoring', icon: Layers },
    { id: 'originality', label: 'Originality', icon: Search },
    { id: 'integrity', label: 'Integrity', icon: AlertTriangle },
    { id: 'scorecard', label: 'Human Scorecard', icon: Sliders },
    { id: 'diff', label: 'AI vs. Human', icon: CheckCircle2 }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-[#ECA59D]/40 px-2.5 py-1 rounded-full border border-[#ECA59D]/60">
                  Submission Analysis
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#3E0D1E]/10 text-[#3E0D1E] font-mono font-bold border border-[#9D0D2F]/20">
                  ID: {submission.id} • v{submission.version || 1}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#9D0D2F]/20 text-[#3E0D1E] border border-[#B4204A]/40 font-bold">
                  {submission.aiProviderMode || 'Local Fallback Analysis'}
                </span>
                {submission.flagsCount > 0 && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#D94A63]/10 border border-[#D94A63]/30 text-[#D94A63] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Review Required</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2 flex items-center gap-2">
                <span>{submission.projectName}</span>
                <span className="text-xs text-[#9D0D2F] font-semibold">by {submission.teamName}</span>
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleReRunAi}
                disabled={isReAnalyzing}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#ECA59D]/30 border border-[#9D0D2F]/40 text-[#3E0D1E] font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isReAnalyzing ? 'animate-spin text-[#9D0D2F]' : 'text-[#9D0D2F]'}`} />
                <span>{isReAnalyzing ? 'Analyzing...' : 'Re-run AI Analysis'}</span>
              </button>

              <Link
                to={`/organizer/live/${submission.id}`}
                className="px-3.5 py-2 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Live Pitch Mode</span>
              </Link>
              
              <span className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#9D0D2F] text-white shadow-xs">
                {submission.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#9D0D2F]/20 text-xs">
            <div>
              <span className="text-[#9D0D2F] font-bold uppercase text-[10px]">Problem</span>
              <p className="text-[#3E0D1E] mt-1 leading-relaxed font-medium">{submission.problem || submission.summary?.problem}</p>
            </div>
            <div>
              <span className="text-[#9D0D2F] font-bold uppercase text-[10px]">Proposed Solution</span>
              <p className="text-[#3E0D1E] mt-1 leading-relaxed font-medium">{submission.solution || submission.summary?.proposedSolution}</p>
            </div>
            <div>
              <span className="text-[#9D0D2F] font-bold uppercase text-[10px]">Target Users</span>
              <p className="text-[#3E0D1E] mt-1 leading-relaxed font-medium">{submission.targetUsers || submission.summary?.targetUsers}</p>
            </div>
            <div>
              <span className="text-[#9D0D2F] font-bold uppercase text-[10px]">Technology & Evidence</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {(submission.technologies || submission.summary?.technology || []).map(tech => (
                  <span key={tech} className="px-2 py-0.5 rounded-md bg-[#9D0D2F]/10 border border-[#B4204A]/30 text-[#3E0D1E] font-mono text-[11px] font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-3 pt-2 text-[11px]">
                {submission.githubUrl && <a href={submission.githubUrl} target="_blank" rel="noreferrer" className="text-[#3E0D1E] hover:text-[#9D0D2F] font-bold flex items-center space-x-1"><Code className="w-3.5 h-3.5 text-[#9D0D2F]" /><span>Repo</span></a>}
                {submission.demoUrl && <a href={submission.demoUrl} target="_blank" rel="noreferrer" className="text-[#9D0D2F] hover:text-[#B4204A] font-bold flex items-center space-x-1"><ExternalLink className="w-3.5 h-3.5" /><span>Demo</span></a>}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-[#9D0D2F]/30 flex items-center space-x-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-3 text-xs font-bold rounded-t-2xl transition-all flex items-center space-x-2 border-b-2 flex-shrink-0 ${
                  isActive
                    ? 'border-[#9D0D2F] text-[#3E0D1E] bg-[#ECA59D] shadow-2xs'
                    : 'border-transparent text-[#ECA59D] hover:text-[#FFFFFF] hover:bg-[#4A1024]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#9D0D2F]' : 'text-[#B4204A]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] block">AI Recommendation</span>
                <div className="text-4xl font-extrabold text-[#3E0D1E] font-mono">
                  {submission.aiScore.toFixed(1)} <span className="text-sm font-normal text-[#9D0D2F]">/ 10</span>
                </div>
                <p className="text-xs text-[#3E0D1E]/80 leading-relaxed font-medium">
                  Weighted score calculated across 4 AI agents mapped directly to official competition rubric.
                </p>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#35B779] block">Human Judge Consensus</span>
                <div className="text-4xl font-extrabold text-[#3E0D1E] font-mono">
                  {submission.humanScore ? `${submission.humanScore.toFixed(1)}` : 'Unrated'}
                  <span className="text-sm font-normal text-[#9D0D2F]"> / 10</span>
                </div>
                <p className="text-xs text-[#3E0D1E]/80 leading-relaxed font-medium">
                  Average of {submission.humanEvaluations.length} human evaluations submitted for this project.
                </p>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B4204A] block">Analysis Governance</span>
                <div className="text-sm font-extrabold text-[#3E0D1E]">
                  {submission.aiProviderMode || 'Local Fallback Analysis'}
                </div>
                <p className="text-xs text-[#3E0D1E]/80 leading-relaxed font-medium">
                  Deterministic content feature extraction. Evaluated on content version v{submission.version || 1}.
                </p>
              </div>

            </div>

            <DisclaimerBanner customText={submission.reconciliation?.summaryText} />

            {/* AI Agent Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#ECA59D]">Specialized AI Agent Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {submission.agentScores.map(agent => {
                  let badgeStyle = 'bg-[#3E0D1E]/10 text-[#3E0D1E] border-[#9D0D2F]/30';
                  if (agent.agentId === 'business') badgeStyle = 'bg-[#F2B84B]/20 text-[#3E0D1E] border-[#F2B84B]/40';
                  if (agent.agentId === 'originality') badgeStyle = 'bg-[#B4204A]/20 text-[#3E0D1E] border-[#B4204A]/40';
                  if (agent.agentId === 'impact') badgeStyle = 'bg-[#35B779]/20 text-[#3E0D1E] border-[#35B779]/40';

                  return (
                    <div key={agent.agentId} className="glass-card p-5 rounded-3xl border border-white/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeStyle}`}>
                          {agent.agentName}
                        </span>
                        <span className="text-lg font-extrabold text-[#3E0D1E] font-mono">{agent.score.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-[#3E0D1E]/90 line-clamp-3 leading-relaxed">{agent.evidence}</p>
                      <div className="text-[11px] text-[#9D0D2F] font-semibold pt-1 border-t border-[#9D0D2F]/20 flex justify-between">
                        <span>Confidence: {agent.confidence}%</span>
                        <span>Risk: {agent.riskLevel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: AI Panel */}
        {activeTab === 'panel' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submission.agentScores.map(agent => (
                <div key={agent.agentId} className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#9D0D2F]/20 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-[#3E0D1E]">{agent.agentName}</h3>
                      <span className="text-xs text-[#9D0D2F]">Confidence: {agent.confidence}%</span>
                    </div>
                    <span className="text-2xl font-extrabold text-[#9D0D2F] font-mono">{agent.score}/10</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-[#3E0D1E] block">Explanation:</span>
                    <p className="text-[#3E0D1E]/90 leading-relaxed">{agent.whyThisScore?.fullExplanation || agent.evidence}</p>

                    <span className="font-bold text-[#3E0D1E] block pt-2">Evidence Bullets:</span>
                    <ul className="list-disc list-inside text-[#3E0D1E]/90 space-y-1">
                      {(agent.whyThisScore?.evidenceBullets || [agent.evidence]).map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Debate */}
        {activeTab === 'debate' && (
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E]">Multi-Agent Debate Log</h3>
            <div className="space-y-4">
              {submission.debate.map(turn => (
                <div key={turn.id} className="p-4 rounded-2xl bg-white/60 border border-[#9D0D2F]/20 flex items-start space-x-3 text-xs">
                  <img src={turn.avatar} alt={turn.agentName} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#3E0D1E]">{turn.agentName}</span>
                      <span className="text-[10px] text-[#9D0D2F] bg-[#9D0D2F]/10 px-2 py-0.5 rounded font-semibold">{turn.agentRole}</span>
                    </div>
                    <p className="text-[#3E0D1E]/90 leading-relaxed">{turn.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Explainable Scoring */}
        {activeTab === 'explainable' && (
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E]">Rubric Weighted Breakdown</h3>
            <div className="space-y-3">
              {submission.explainableScoring.map(crit => (
                <div key={crit.criterionId} className="p-4 rounded-2xl bg-white/60 border border-[#9D0D2F]/20 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[#3E0D1E] text-sm block">{crit.criterionName}</span>
                    <span className="text-[#9D0D2F]">Weight: {crit.weight}% • Score: {crit.aiScore}/10</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#9D0D2F] font-mono">
                      +{crit.weightedContribution.toFixed(2)} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Originality */}
        {activeTab === 'originality' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
              <h3 className="text-sm font-bold text-[#3E0D1E]">Competition-Level Similarity Analysis</h3>
              <p className="text-xs text-[#9D0D2F]">
                Identifies conceptual overlap with other submissions in {competition.name} and public repositories.
              </p>
              
              <div className="space-y-3 pt-2">
                {submission.originalityResults.similarityFindings.map(find => (
                  <div key={find.id} className="p-4 rounded-2xl bg-white/60 border border-[#9D0D2F]/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#3E0D1E] block">{find.name}</span>
                      <span className="text-[#9D0D2F]">{find.sourceType} • {find.overlappingConcepts}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-extrabold text-xs ${
                      find.similarityPercent > 40 ? 'bg-[#F2B84B]/20 text-[#3E0D1E] border border-[#F2B84B]/40' : 'bg-[#9D0D2F]/20 text-[#3E0D1E] border border-[#B4204A]/40'
                    }`}>
                      {find.similarityPercent}% Overlap
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Integrity */}
        {activeTab === 'integrity' && (
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E]">Integrity Cross-Check Verification</h3>
            {submission.integrityFlags.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#35B779]/20 border border-[#35B779]/40 text-[#3E0D1E] text-xs font-semibold">
                No potential inconsistencies detected. All claims and evidence links match.
              </div>
            ) : (
              <div className="space-y-3">
                {submission.integrityFlags.map(flag => (
                  <div key={flag.id} className="p-4 rounded-2xl bg-[#D94A63]/10 border border-[#D94A63]/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#3E0D1E]">{flag.comparisonItem}: {flag.pitchClaim}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D94A63]/20 text-[#3E0D1E] font-bold text-[10px]">
                        {flag.statusNote}
                      </span>
                    </div>
                    <p className="text-[#3E0D1E]/90">{flag.evidence}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Scorecard */}
        {activeTab === 'scorecard' && (
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-6">
            <h3 className="text-sm font-bold text-[#3E0D1E]">Human Judge Scorecard</h3>
            <form onSubmit={handleScorecardSubmit} className="space-y-6">
              <div className="space-y-4">
                {competition.criteria.map(crit => (
                  <div key={crit.id} className="p-4 rounded-2xl bg-white/60 border border-[#9D0D2F]/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[#3E0D1E]">{crit.name} ({crit.weight}%)</span>
                      <span className="font-extrabold text-[#9D0D2F] font-mono">{scoreInputs[crit.id] || 7.5}/10</span>
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

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-md transition-all"
                >
                  Submit Human Evaluation
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 8: Diff */}
        {activeTab === 'diff' && (
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E]">AI vs. Human Score Comparison</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#9D0D2F]/10 border border-[#9D0D2F]/30">
                <span className="text-xs font-bold text-[#9D0D2F] block uppercase">AI Score</span>
                <span className="text-2xl font-extrabold text-[#3E0D1E]">{submission.aiScore}/10</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#35B779]/20 border border-[#35B779]/40">
                <span className="text-xs font-bold text-[#35B779] block uppercase">Human Score</span>
                <span className="text-2xl font-extrabold text-[#3E0D1E]">{submission.humanScore ? `${submission.humanScore}/10` : 'Unrated'}</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
