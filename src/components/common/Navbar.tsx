import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Sparkles, UserCheck, Play } from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { userRole, setUserRole, activeJudgeId, setActiveJudgeId, judges, startDemoTour, competition } = useCompetition();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleToggle = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'organizer') {
      navigate('/organizer');
    } else if (newRole === 'judge') {
      navigate(`/judge/projects/sub-1/score`);
    } else if (newRole === 'participant') {
      navigate('/participant');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9D0D2F] to-[#B4204A] p-0.5 shadow-md shadow-rose-950/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#9D0D2F]" />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[#3E0D1E] flex items-center gap-1.5">
                OpenJudge <span className="gradient-text font-black text-xs px-1.5 py-0.5 rounded bg-white/90 border border-[#E87D87]">AI</span>
              </span>
              <span className="hidden sm:block text-[11px] text-[#9D0D2F] font-semibold tracking-wide">
                One rubric. Every project.
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E87D87] text-xs text-[#9D0D2F] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#B4204A] animate-pulse" />
            <span>AI assists. Humans decide.</span>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-bold text-[#3E0D1E]">
          <Link
            to="/organizer"
            className={`px-3 py-1.5 rounded-xl transition-all ${
              location.pathname === '/organizer' ? 'bg-[#9D0D2F] hover:bg-[#B4204A] text-white shadow-xs' : 'hover:text-[#9D0D2F] hover:bg-[#9D0D2F]/10'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to={`/organizer/competitions/${competition.id}/submissions`}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              location.pathname.includes('/submissions') ? 'bg-[#9D0D2F] hover:bg-[#B4204A] text-white shadow-xs' : 'hover:text-[#9D0D2F] hover:bg-[#9D0D2F]/10'
            }`}
          >
            Submissions
          </Link>
          <Link
            to={`/organizer/competitions/${competition.id}/calibration`}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              location.pathname.includes('/calibration') ? 'bg-[#9D0D2F] hover:bg-[#B4204A] text-white shadow-xs' : 'hover:text-[#9D0D2F] hover:bg-[#9D0D2F]/10'
            }`}
          >
            Calibration
          </Link>
          <Link
            to="/participant"
            className={`px-3 py-1.5 rounded-xl transition-all ${
              location.pathname.includes('/participant') ? 'bg-[#9D0D2F] hover:bg-[#B4204A] text-white shadow-xs' : 'hover:text-[#9D0D2F] hover:bg-[#9D0D2F]/10'
            }`}
          >
            Participant Portal
          </Link>
          <Link
            to={`/organizer/competitions/${competition.id}/results`}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              location.pathname.includes('/results') ? 'bg-[#9D0D2F] hover:bg-[#B4204A] text-white shadow-xs' : 'hover:text-[#9D0D2F] hover:bg-[#9D0D2F]/10'
            }`}
          >
            Results
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2.5">
          
          <button
            onClick={() => {
              startDemoTour();
              navigate('/organizer');
            }}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-[#E87D87] text-[#9D0D2F] text-xs font-bold transition-all shadow-2xs"
            title="Start guided demo tour script"
          >
            <Play className="w-3.5 h-3.5 fill-[#9D0D2F] text-[#9D0D2F]" />
            <span>Guided Tour</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center p-1 rounded-xl bg-white/80 border border-[#E87D87] text-xs font-bold text-[#3E0D1E]">
            <button
              onClick={() => handleRoleToggle('organizer')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                userRole === 'organizer'
                  ? 'bg-[#9D0D2F] text-white shadow-xs'
                  : 'text-[#3E0D1E] hover:bg-[#9D0D2F]/10'
              }`}
            >
              Organizer
            </button>
            <button
              onClick={() => handleRoleToggle('judge')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                userRole === 'judge'
                  ? 'bg-[#9D0D2F] text-white shadow-xs'
                  : 'text-[#3E0D1E] hover:bg-[#9D0D2F]/10'
              }`}
            >
              Judge
            </button>
            <button
              onClick={() => handleRoleToggle('participant')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                userRole === 'participant'
                  ? 'bg-[#9D0D2F] text-white shadow-xs'
                  : 'text-[#3E0D1E] hover:bg-[#9D0D2F]/10'
              }`}
            >
              Participant
            </button>
          </div>

          {userRole === 'judge' && (
            <select
              value={activeJudgeId}
              onChange={e => setActiveJudgeId(e.target.value)}
              className="bg-white border border-[#E87D87] text-[#3E0D1E] text-xs font-bold rounded-xl px-2 py-1.5 focus:outline-none focus:border-[#9D0D2F]"
            >
              {judges.map(j => (
                <option key={j.id} value={j.id}>
                  {j.name.split('(')[0]}
                </option>
              ))}
            </select>
          )}

          <Link
            to="/demo"
            className="p-2 rounded-xl bg-white hover:bg-rose-50 text-[#3E0D1E] border border-[#E87D87] transition-colors"
            title="Switch Persona / Demo Auth"
          >
            <UserCheck className="w-4 h-4 text-[#9D0D2F]" />
          </Link>
        </div>

      </div>
    </header>
  );
};
