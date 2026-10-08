import React from 'react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';
import { JudgeVarianceBoxPlot } from '../components/charts/JudgeVarianceBoxPlot';

export const JudgeCalibrationPage: React.FC = () => {
  const { judges } = useCompetition();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-white/80 px-2.5 py-1 rounded-full border border-[#E87D87]">
            Statistical Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">
            Judge Calibration & Variance Analysis
          </h1>
          <p className="text-xs text-[#3E0D1E]/75 mt-1 font-semibold">
            Calibration highlights differences in scoring patterns. Organizers can review these patterns before finalizing results.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-[#E87D87]/60 text-xs text-[#3E0D1E] space-y-1 shadow-xs">
          <div className="flex items-center space-x-2 font-bold text-[#9D0D2F]">
            <img src="/favicon.png" alt="Info" className="w-4 h-4 object-contain flex-shrink-0" />
            <span>Statistical Calibration Principle</span>
          </div>
          <p className="text-[#3E0D1E]/80 leading-relaxed font-semibold">
            Neutral framing is strictly enforced: scoring variances reflect statistical distribution differences, not personal bias. Human judges retain score ownership. Organizers cannot silently alter submitted raw scores without explicit logged justification notes.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/20 overflow-hidden shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E87D87]/40 pb-3">
            <h3 className="text-sm font-bold text-[#3E0D1E]">Scoring Distribution across Judge Personas A–E</h3>
            <span className="text-xs text-[#3E0D1E]/70 font-semibold">{judges.length} Active Personas</span>
          </div>
          <JudgeVarianceBoxPlot judges={judges} />
        </div>

      </main>
    </div>
  );
};
