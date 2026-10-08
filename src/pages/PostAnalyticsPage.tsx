import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';
import { ScatterScoreChart } from '../components/charts/ScatterScoreChart';
import { CriteriaBarChart } from '../components/charts/CriteriaBarChart';

export const PostAnalyticsPage: React.FC = () => {
  const { submissions, competition } = useCompetition();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-white/80 px-2.5 py-1 rounded-full border border-[#E87D87]">
            Post-Competition Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">
            Competition Analytics & Insights
          </h1>
          <p className="text-xs text-[#3E0D1E]/75 mt-1 font-semibold">
            Statistical breakdown of AI vs Human scoring performance, judge agreement, and efficiency ROI.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">Total Projects</span>
            <span className="text-xl font-extrabold text-[#3E0D1E] font-mono mt-1 block">{submissions.length}</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">AI Evaluated</span>
            <span className="text-xl font-extrabold text-[#9D0D2F] font-mono mt-1 block">{submissions.filter(s => s.aiStatus === 'Complete').length}</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">Avg AI Score</span>
            <span className="text-xl font-extrabold text-[#9D0D2F] font-mono mt-1 block">7.5</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">Avg Human Score</span>
            <span className="text-xl font-extrabold text-[#35B779] font-mono mt-1 block">7.8</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">Agreement</span>
            <span className="text-xl font-extrabold text-[#35B779] font-mono mt-1 block">84%</span>
            <span className="text-[9px] text-[#3E0D1E]/70 font-medium">Within ±1.0 pt</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">Max Disagreement</span>
            <span className="text-xs font-bold text-[#F2B84B] mt-1 block">Scalability</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">Flags Handled</span>
            <span className="text-xl font-extrabold text-[#D94A63] font-mono mt-1 block">{submissions.filter(s => s.flagsCount > 0).length}</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/20">
            <span className="text-[10px] text-[#9D0D2F] font-bold uppercase block">Est. Time Saved</span>
            <span className="text-xl font-extrabold text-[#9D0D2F] font-mono mt-1 block">68 hrs</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#9D0D2F]" />
              <span>AI Recommendation vs. Human Score Correlation</span>
            </h3>
            <ScatterScoreChart submissions={submissions} />
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#35B779]" />
              <span>Criteria Average Performance</span>
            </h3>
            <CriteriaBarChart submissions={submissions} competition={competition} />
          </div>
        </div>

      </main>
    </div>
  );
};
