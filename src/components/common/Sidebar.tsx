import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  BrainCircuit, 
  Sliders, 
  ShieldAlert, 
  Radio, 
  BarChart3, 
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';

export const Sidebar: React.FC = () => {
  const { competition, submissions } = useCompetition();
  const compId = competition.id;

  const navItems = [
    { label: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
    { label: 'New Competition', path: '/organizer/competitions/new', icon: PlusCircle },
    { label: 'Submissions', path: `/organizer/competitions/${compId}/submissions`, icon: FileText },
    { label: 'AI Analysis', path: `/organizer/competitions/${compId}/submissions/sub-1`, icon: BrainCircuit },
    { label: 'Judge Calibration', path: `/organizer/competitions/${compId}/calibration`, icon: Sliders },
    { label: 'Originality Scan', path: `/organizer/competitions/${compId}/submissions/sub-1?tab=originality`, icon: ShieldAlert },
    { label: 'Live Pitch Assistant', path: `/organizer/live/sub-1`, icon: Radio },
    { label: 'Participant Portal', path: '/participant', icon: UserCheck },
    { label: 'Analytics', path: `/organizer/competitions/${compId}/analytics`, icon: BarChart3 },
    { label: 'Final Results', path: `/organizer/competitions/${compId}/results`, icon: Award }
  ];

  return (
    <aside className="w-64 flex-shrink-0 glass-panel border-r border-white/20 min-h-[calc(100vh-4rem)] p-4 hidden md:block space-y-6">
      
      {/* Active Competition Box */}
      <div className="px-3.5 py-3 rounded-2xl bg-white/80 border border-[#E87D87] space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9D0D2F] block">Active Competition</span>
        <h3 className="text-xs font-extrabold text-[#3E0D1E] truncate" title={competition.name}>
          {competition.name}
        </h3>
        <p className="text-[11px] text-[#3E0D1E]/70 font-semibold">
          {submissions.length} Submissions • {competition.criteria.length} Rubric Criteria
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/organizer'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-[#9D0D2F] text-white shadow-md shadow-rose-950/20'
                    : 'text-[#3E0D1E] hover:text-[#9D0D2F] hover:bg-[#9D0D2F]/10'
                }`
              }
            >
              <div className="flex items-center space-x-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#B4204A]" />
            </NavLink>
          );
        })}
      </nav>

      {/* Principle Badge */}
      <div className="p-3.5 rounded-2xl bg-white/90 border border-[#E87D87] text-xs space-y-1 shadow-2xs">
        <div className="font-extrabold text-[#9D0D2F] flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#B4204A] animate-pulse"></span>
          <span>OpenJudge Principle</span>
        </div>
        <p className="text-[11px] text-[#3E0D1E] leading-relaxed font-semibold">
          AI assists. Humans decide. Overrides are logged and transparent.
        </p>
      </div>
    </aside>
  );
};
