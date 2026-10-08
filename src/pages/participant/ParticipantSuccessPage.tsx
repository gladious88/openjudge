import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';

export const ParticipantSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const subId = searchParams.get('id');
  const { submissions, competition } = useCompetition();

  const submission = submissions.find(s => s.id === subId) || submissions[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      
      <div className="w-20 h-20 rounded-3xl bg-[#35B779]/20 border border-[#35B779]/40 flex items-center justify-center mx-auto text-[#35B779] shadow-xl">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-[#35B779]/20 border border-[#35B779]/40 text-[#3E0D1E] text-xs font-bold">
          Submission Received & AI Analyzed
        </span>
        <h1 className="text-3xl font-extrabold text-[#3E0D1E]">
          Project Submitted Successfully!
        </h1>
        <p className="text-xs text-[#3E0D1E]/80 max-w-md mx-auto font-medium">
          Your project <strong className="text-[#3E0D1E]">{submission?.projectName}</strong> has been received by <strong className="text-[#9D0D2F]">{competition.name}</strong> organizers and evaluated by OpenJudge AI.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4 text-left max-w-lg mx-auto">
        <div className="flex items-center justify-between border-b border-[#9D0D2F]/20 pb-3">
          <span className="text-xs font-bold text-[#3E0D1E]">{submission?.projectName}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#9D0D2F]/10 text-[#3E0D1E] border border-[#B4204A]/30 text-[11px] font-bold">
            AI Score: {submission?.aiScore}/10
          </span>
        </div>

        <div className="space-y-1 text-xs text-[#3E0D1E]/90 font-medium">
          <p><strong>Team:</strong> {submission?.teamName}</p>
          <p><strong>Category:</strong> {submission?.category}</p>
          <p><strong>AI Status:</strong> Complete ({submission?.aiProviderMode || 'Local Fallback Analysis'})</p>
        </div>

        <div className="p-3 rounded-xl bg-white/80 border border-[#9D0D2F]/30 text-xs text-[#3E0D1E] space-y-1 shadow-xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#9D0D2F]">
            <Sparkles className="w-4 h-4 text-[#9D0D2F]" />
            <span>AI Multi-Agent Evaluation Complete</span>
          </div>
          <p className="text-[11px] text-[#3E0D1E]/90 font-medium leading-relaxed">
            Your project is now in the organizer's review queue and assigned to human judges.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/participant"
          className="px-6 py-3 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] font-bold text-xs border border-[#9D0D2F]/30 transition-colors flex items-center space-x-2"
        >
          <LayoutDashboard className="w-4 h-4 text-[#9D0D2F]" />
          <span>Participant Portal</span>
        </Link>

        {submission && (
          <Link
            to={`/organizer/competitions/${competition.id}/submissions/${submission.id}`}
            className="px-6 py-3 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <span>View Full AI Breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

    </div>
  );
};
