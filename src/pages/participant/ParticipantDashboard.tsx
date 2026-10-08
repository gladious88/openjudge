import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Upload, 
  Code2, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';

export const ParticipantDashboard: React.FC = () => {
  const { currentTeam, submissions, competition } = useCompetition();

  // Find submissions for this participant team
  const mySubmissions = submissions.filter(
    s => s.teamId === currentTeam?.id || s.teamName === currentTeam?.teamName
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/20 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-[#ECA59D]/40 px-2.5 py-1 rounded-full border border-[#ECA59D]/60">
            Participant Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">
            Welcome, {currentTeam?.teamName || 'Team Lead'}!
          </h1>
          <p className="text-xs text-[#3E0D1E]/80 mt-1 font-medium">
            Registered for: <span className="font-semibold text-[#9D0D2F]">{competition.name}</span> • Deadline: <span className="font-semibold text-[#9D0D2F]">{competition.deadline}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/participant/team"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] font-semibold text-xs border border-[#9D0D2F]/30 shadow-xs transition-all flex items-center space-x-2"
          >
            <Users className="w-4 h-4 text-[#9D0D2F]" />
            <span>Manage Team ({currentTeam?.members.length || 0})</span>
          </Link>

          <Link
            to="/participant/submission/project"
            className="px-4 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-semibold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project Submission</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Submissions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#ECA59D] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#B4204A]" />
              <span>My Competition Projects</span>
            </h2>
            <span className="text-xs text-[#ECA59D]/80 font-semibold">{mySubmissions.length} project(s)</span>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl border border-white/20 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#9D0D2F]/20 border border-[#B4204A]/30 flex items-center justify-center mx-auto text-[#9D0D2F]">
                <Upload className="w-7 h-7" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-[#3E0D1E]">No Projects Submitted Yet</h3>
                <p className="text-xs text-[#3E0D1E]/80 font-medium">
                  Create your submission to run the OpenJudge AI Pre-Check and submit before the competition deadline.
                </p>
              </div>
              <Link
                to="/participant/submission/project"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Start Submission Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mySubmissions.map(sub => (
                <div key={sub.id} className="glass-card p-6 rounded-3xl border border-white/20 hover:shadow-md transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#9D0D2F]/20 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#9D0D2F]/10 border border-[#B4204A]/30 text-[11px] font-bold text-[#9D0D2F]">
                          {sub.category}
                        </span>
                        <span className="text-xs text-[#9D0D2F]">v{sub.version || 1}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#3E0D1E] mt-1">{sub.projectName}</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.aiStatus === 'Complete' 
                          ? 'bg-[#35B779]/20 text-[#3E0D1E] border border-[#35B779]/40'
                          : 'bg-[#F2B84B]/20 text-[#3E0D1E] border border-[#F2B84B]/40'
                      }`}>
                        AI Status: {sub.aiStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#3E0D1E]/90 font-medium line-clamp-2">
                    {sub.problem || sub.summary?.problem}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#9D0D2F] pt-2 border-t border-[#9D0D2F]/20 font-medium">
                    <span className="flex items-center space-x-1">
                      <Code2 className="w-3.5 h-3.5 text-[#B4204A]" />
                      <span>{sub.githubUrl ? 'GitHub Attached' : 'No GitHub Link'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#B4204A]" />
                      <span>AI Score: {sub.aiScore > 0 ? `${sub.aiScore}/10` : 'Pending'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#9D0D2F]" />
                      <span>Submitted: {sub.submittedDate}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <Link
                      to={`/participant/submission/review?id=${sub.id}`}
                      className="px-4 py-2 rounded-xl bg-white text-[#3E0D1E] hover:bg-[#ECA59D]/30 font-semibold text-xs border border-[#9D0D2F]/30 transition-colors flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#9D0D2F]" />
                      <span>AI Pre-Check</span>
                    </Link>

                    <Link
                      to={`/organizer/competitions/${competition.id}/submissions/${sub.id}`}
                      className="px-4 py-2 rounded-xl bg-[#9D0D2F] text-white font-semibold text-xs hover:bg-[#B4204A] transition-colors flex items-center space-x-1.5"
                    >
                      <span>View Live Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Team Overview & Rubric Info */}
        <div className="space-y-6">
          
          {/* Team Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#9D0D2F]" />
                <span>My Team</span>
              </h3>
              <Link to="/participant/team" className="text-xs text-[#9D0D2F] font-semibold hover:underline">
                Edit Team
              </Link>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#3E0D1E]">{currentTeam?.teamName}</div>
              <div className="space-y-1.5">
                {currentTeam?.members.map(m => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-white/60 border border-[#9D0D2F]/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#3E0D1E] block">{m.name}</span>
                      <span className="text-[11px] text-[#9D0D2F] font-medium">{m.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rubric Weights Box */}
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-3">
            <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#35B779]" />
              <span>Judging Rubric Weights</span>
            </h3>
            <p className="text-xs text-[#3E0D1E]/90 font-medium">
              OpenJudge AI evaluates your submission based on the organizer's active weighted rubric:
            </p>
            <div className="space-y-2 pt-1">
              {competition.criteria.map(crit => (
                <div key={crit.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/60 border border-[#9D0D2F]/20">
                  <span className="font-semibold text-[#3E0D1E]">{crit.name}</span>
                  <span className="font-bold text-[#9D0D2F] bg-[#9D0D2F]/10 px-2 py-0.5 rounded border border-[#B4204A]/30">
                    {crit.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
