import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCheck, ArrowRight, User, CheckCircle2, FileUp } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';

export const DemoAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole, setActiveJudgeId, judges, loadDemoCompetition } = useCompetition();

  const handleOrganizerLogin = () => {
    setUserRole('organizer');
    loadDemoCompetition();
    navigate('/organizer');
  };

  const handleJudgeLogin = (judgeId: string) => {
    setUserRole('judge');
    setActiveJudgeId(judgeId);
    navigate(`/judge/projects/sub-1/score`);
  };

  const handleParticipantLogin = () => {
    setUserRole('participant');
    navigate('/participant');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-5xl w-full space-y-8">
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#9D0D2F]/10 border border-[#E87D87] flex items-center justify-center mx-auto shadow-sm">
            <UserCheck className="w-6 h-6 text-[#9D0D2F]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Demo Persona Switcher</h1>
          <p className="text-sm text-[#ECA59D] max-w-md mx-auto font-medium">
            Select a role to explore OpenJudge AI from an Organizer, Judge, or Participant perspective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Organizer Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/20 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9D0D2F]/10 border border-[#E87D87] flex items-center justify-center text-[#9D0D2F]">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-[#3E0D1E]">Organizer Portal</h2>
              <p className="text-xs text-[#3E0D1E]/80 leading-relaxed font-medium">
                Full administrative access: create competitions, set criteria weights, view all 100 submissions, run AI panels, monitor judge calibration variance, and finalize results.
              </p>
              <ul className="space-y-2 text-xs text-[#3E0D1E] font-medium">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
                  <span>Full 100-submission dataset control</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
                  <span>Multi-agent debate & originality scans</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
                  <span>CSV & PDF summary exporter</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleOrganizerLogin}
              className="mt-6 w-full py-3 px-4 btn-primary flex items-center justify-center space-x-2 text-xs"
            >
              <span>Organizer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Participant Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/20 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9D0D2F]/10 border border-[#E87D87] flex items-center justify-center text-[#9D0D2F]">
                <FileUp className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-[#3E0D1E]">Participant Portal</h2>
              <p className="text-xs text-[#3E0D1E]/80 leading-relaxed font-medium">
                Experience the participant submission flow: create team, submit project details, run OpenJudge AI Pre-Check, and verify rubric alignment.
              </p>
              <ul className="space-y-2 text-[#3E0D1E] font-medium text-xs">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
                  <span>Team creation & member roster</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
                  <span>AI Pre-Submission Rubric Check</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#35B779]" />
                  <span>Live submission linking</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleParticipantLogin}
              className="mt-6 w-full py-3 px-4 btn-primary flex items-center justify-center space-x-2 text-xs"
            >
              <span>Enter Participant Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Judge Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/20 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#9D0D2F]/10 border border-[#E87D87] flex items-center justify-center text-[#9D0D2F]">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-[#3E0D1E]">Judge Persona Portal</h2>
              <p className="text-xs text-[#3E0D1E]/80 leading-relaxed font-medium">
                Select one of 5 seeded judge personas to open the interactive human scorecard and score assigned projects.
              </p>

              <div className="space-y-2 pt-1 max-h-[220px] overflow-y-auto pr-1">
                {judges.map(judge => (
                  <button
                    key={judge.id}
                    onClick={() => handleJudgeLogin(judge.id)}
                    className="w-full p-2.5 rounded-xl bg-white/90 hover:bg-[#9D0D2F]/10 border border-[#E87D87]/60 flex items-center justify-between text-left transition-all text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <img src={judge.avatar} alt={judge.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-[#3E0D1E] truncate max-w-[120px]">{judge.name.split('(')[0]}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#9D0D2F] bg-[#9D0D2F]/10 px-2 py-0.5 rounded border border-[#E87D87]/60">
                      Scorecard
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
