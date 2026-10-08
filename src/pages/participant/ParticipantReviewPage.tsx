import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  CheckCircle,
  FileText, 
  Code,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';
import { aiService } from '../../services/aiService';
import { PreSubmissionCheckResult } from '../../types';

export const ParticipantReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { competition, addParticipantSubmission } = useCompetition();

  const draft = {
    projectName: localStorage.getItem('draft_projectName') || 'AgriSense AI',
    category: localStorage.getItem('draft_category') || 'AI & Sustainability',
    problem: localStorage.getItem('draft_problem') || 'Crop diseases destroy over $220B worth of smallholder farm harvests annually due to delayed detection.',
    solution: localStorage.getItem('draft_solution') || 'Mobile vision model coupled with localized offline push notifications for early leaf blight identification.',
    targetUsers: localStorage.getItem('draft_targetUsers') || 'Smallholder farmers and agricultural extension agents in East Africa.',
    impact: localStorage.getItem('draft_impact') || 'Reduce harvest loss by 35% across 50,000 enrolled farms.',
    technologies: (localStorage.getItem('draft_technologies') || 'React, TypeScript, PyTorch, FastAPI, SQLite').split(',').map(s => s.trim()),
    architecture: localStorage.getItem('draft_architecture') || 'Mobile PWA with ONNX Web Runtime for offline inference.',
    aiComponents: localStorage.getItem('draft_aiComponents') || 'YOLOv8 fine-tuned on PlantVillage dataset.',
    limitations: localStorage.getItem('draft_limitations') || 'Requires camera phone.',
    githubUrl: localStorage.getItem('draft_githubUrl') || 'https://github.com/team-horizon/agrisense-ai',
    demoUrl: localStorage.getItem('draft_demoUrl') || 'https://agrisense-ai.demo.app',
    demoVideoUrl: localStorage.getItem('draft_demoVideoUrl') || '',
    pitchDeck: localStorage.getItem('draft_pitchDeck') || 'https://docs.google.com/presentation/d/agrisense-deck'
  };

  const [preCheckResult, setPreCheckResult] = useState<PreSubmissionCheckResult | null>(null);
  const [isRunningCheck, setIsRunningCheck] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRunPreCheck = () => {
    setIsRunningCheck(true);
    setTimeout(() => {
      const res = aiService.analyzePreSubmissionCheck(draft, competition);
      setPreCheckResult(res);
      setIsRunningCheck(false);
    }, 900);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newSub = await addParticipantSubmission(draft);
      
      // Clear draft localStorage
      const keys = ['projectName', 'category', 'problem', 'solution', 'targetUsers', 'impact', 'technologies', 'architecture', 'aiComponents', 'limitations', 'githubUrl', 'demoUrl', 'demoVideoUrl', 'pitchDeck'];
      keys.forEach(k => localStorage.removeItem(`draft_${k}`));

      navigate(`/participant/submission/success?id=${newSub.id}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-white/20">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#9D0D2F]">
          <span className="w-6 h-6 rounded-full bg-[#9D0D2F] text-white flex items-center justify-center text-xs">4</span>
          <span className="text-[#3E0D1E]">Review & AI Pre-Submission Check</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-[#9D0D2F] font-medium">
          <span>Step 4 of 4</span>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3E0D1E]">Final Submission Review</h1>
          <p className="text-xs text-[#3E0D1E]/80 mt-1 font-medium">
            Run OpenJudge AI Pre-Check to verify rubric coverage before final submission.
          </p>
        </div>

        {/* Draft Summary Box */}
        <div className="p-4 rounded-2xl bg-white/60 border border-[#9D0D2F]/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-[#9D0D2F]/10 border border-[#B4204A]/30 text-[#9D0D2F] text-[11px] font-bold">
              {draft.category}
            </span>
            <span className="text-xs font-bold text-[#3E0D1E]">{draft.projectName}</span>
          </div>

          <div className="space-y-1.5 text-xs text-[#3E0D1E]/90 font-medium">
            <p><strong>Problem:</strong> {draft.problem}</p>
            <p><strong>Solution:</strong> {draft.solution}</p>
            <p><strong>Target Users:</strong> {draft.targetUsers || 'Not specified'}</p>
            <p><strong>Tech Stack:</strong> {draft.technologies.join(', ')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-[#9D0D2F] border-t border-[#9D0D2F]/20 font-medium">
            {draft.githubUrl && <span className="flex items-center space-x-1 text-[#3E0D1E]"><Code className="w-3.5 h-3.5 text-[#9D0D2F]" /><span>GitHub</span></span>}
            {draft.demoUrl && <span className="flex items-center space-x-1 text-[#9D0D2F]"><ExternalLink className="w-3.5 h-3.5 text-[#9D0D2F]" /><span>Demo</span></span>}
            {draft.pitchDeck && <span className="flex items-center space-x-1 text-[#35B779]"><FileText className="w-3.5 h-3.5 text-[#35B779]" /><span>Pitch Deck</span></span>}
          </div>
        </div>

        {/* AI Pre-Check Trigger Banner */}
        <div className="p-5 rounded-2xl bg-white/80 border border-[#9D0D2F]/30 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#3E0D1E] font-bold text-sm">
              <Sparkles className="w-5 h-5 text-[#9D0D2F] animate-pulse" />
              <span>OpenJudge AI Pre-Submission Assistant</span>
            </div>

            <button
              onClick={handleRunPreCheck}
              disabled={isRunningCheck}
              className="px-4 py-2 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isRunningCheck ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Project...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run OpenJudge AI Pre-Check</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-[#3E0D1E]/90 font-medium leading-relaxed">
            Evaluates your submission completeness against {competition.name} rubric requirements before judges review it.
          </p>

          <p className="text-[11px] text-[#9D0D2F] font-semibold italic border-t border-[#9D0D2F]/20 pt-2">
            "This is guidance and does not determine the final judging result."
          </p>
        </div>

        {/* Pre-Check Results */}
        {preCheckResult && (
          <div className="p-5 rounded-2xl bg-white border border-[#9D0D2F]/30 space-y-4 shadow-sm animate-fade-in">
            <h3 className="text-xs font-bold text-[#3E0D1E] uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
              <span>Pre-Check Coverage Scores</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-[#9D0D2F]/10 border border-[#9D0D2F]/30">
                <span className="text-[10px] text-[#9D0D2F] font-semibold uppercase block">Overall</span>
                <span className="text-lg font-extrabold text-[#3E0D1E]">{preCheckResult.completeness}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#9D0D2F]/20">
                <span className="text-[10px] text-[#3E0D1E] font-semibold uppercase block">Problem Clarity</span>
                <span className="text-lg font-extrabold text-[#3E0D1E]">{preCheckResult.problemClarity}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#9D0D2F]/10 border border-[#9D0D2F]/30">
                <span className="text-[10px] text-[#9D0D2F] font-semibold uppercase block">Tech Completeness</span>
                <span className="text-lg font-extrabold text-[#3E0D1E]">{preCheckResult.technicalCompleteness}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#35B779]/20 border border-[#35B779]/40">
                <span className="text-[10px] text-[#35B779] font-semibold uppercase block">Impact Evidence</span>
                <span className="text-lg font-extrabold text-[#3E0D1E]">{preCheckResult.impactEvidence}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F2B84B]/20 border border-[#F2B84B]/40">
                <span className="text-[10px] text-[#F2B84B] font-semibold uppercase block">Rubric Coverage</span>
                <span className="text-lg font-extrabold text-[#3E0D1E]">{preCheckResult.rubricCoverage}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#D94A63]/20 border border-[#D94A63]/40">
                <span className="text-[10px] text-[#D94A63] font-semibold uppercase block">Evidence Links</span>
                <span className="text-lg font-extrabold text-[#3E0D1E]">{preCheckResult.evidenceCoverage}%</span>
              </div>
            </div>

            {/* Strengths */}
            {preCheckResult.strengths.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#35B779] block">Verified Strengths:</span>
                <ul className="list-disc list-inside text-[#3E0D1E]/90 font-medium space-y-1 pl-1">
                  {preCheckResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {preCheckResult.suggestions.length > 0 && (
              <div className="space-y-1 text-xs pt-2 border-t border-[#9D0D2F]/20">
                <span className="font-bold text-[#9D0D2F] block">Recommended Actionable Improvements:</span>
                <ul className="list-disc list-inside text-[#3E0D1E]/90 font-medium space-y-1 pl-1">
                  {preCheckResult.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-[#9D0D2F]/20">
          <button
            onClick={() => navigate('/participant/submission/evidence')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] font-semibold text-xs border border-[#9D0D2F]/30 transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#9D0D2F]" />
            <span>Back</span>
          </button>

          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-7 py-3 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Project...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Final Submit Project</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
