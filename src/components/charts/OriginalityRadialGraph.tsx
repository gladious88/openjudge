import React from 'react';
import { SimilarityFinding } from '../../types';
import { ShieldAlert, GitBranch, Rocket, Award, Layers } from 'lucide-react';

interface OriginalityRadialGraphProps {
  projectName: string;
  findings: SimilarityFinding[];
}

export const OriginalityRadialGraph: React.FC<OriginalityRadialGraphProps> = ({ projectName, findings }) => {
  return (
    <div className="w-full bg-white/80 border border-[#E87D87]/60 rounded-2xl p-6 relative overflow-hidden my-4 shadow-sm">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#9D0D2F]/5 via-[#ECA59D]/10 to-[#B4204A]/5 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#B4204A]" />
          <span>Similarity Topology Map</span>
        </h4>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 font-semibold">
          Radial Force Visualizer
        </span>
      </div>

      <div className="relative min-h-[300px] flex items-center justify-center">
        
        {/* Center Target Node */}
        <div className="relative z-10 w-28 h-28 rounded-full bg-[#3E0D1E] border-2 border-[#B4204A] flex flex-col items-center justify-center p-3 text-center shadow-xl shadow-rose-950/20">
          <div className="w-8 h-8 rounded-full bg-[#B4204A]/20 flex items-center justify-center mb-1">
            <Award className="w-4 h-4 text-[#E87D87]" />
          </div>
          <span className="text-xs font-bold text-white truncate max-w-[90px]">{projectName}</span>
          <span className="text-[10px] text-[#ECA59D] font-semibold mt-0.5">Target Project</span>
        </div>

        {/* Orbit Lines & Matching Satellite Nodes */}
        {findings.map((item, idx) => {
          // Angle positions around the circle
          const angles = [45, 165, 285];
          const angle = angles[idx % angles.length];
          const rad = (angle * Math.PI) / 180;
          const distance = 130; // distance from center
          
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          const getIcon = (type: string) => {
            if (type.includes('GitHub')) return GitBranch;
            if (type.includes('Startup')) return Rocket;
            return ShieldAlert;
          };

          const Icon = getIcon(item.sourceType);

          return (
            <React.Fragment key={item.id}>
              {/* Connecting dashed line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${x}px)`}
                  y2={`calc(50% + ${y}px)`}
                  stroke={item.similarityPercent > 60 ? '#D94A63' : '#F2B84B'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
              </svg>

              {/* Satellite Node */}
              <div
                className="absolute z-20 p-3 rounded-xl bg-white border border-[#E87D87] shadow-lg flex flex-col items-center justify-center text-center transition-transform hover:scale-105"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  width: `${Math.max(100, Math.min(140, item.similarityPercent * 1.6))}px`
                }}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${
                  item.similarityPercent > 60 ? 'bg-rose-500/20 text-rose-600' : 'bg-amber-500/20 text-amber-600'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#3E0D1E] truncate w-full">{item.name}</span>
                <span className="text-[10px] text-slate-500 block truncate">{item.sourceType}</span>
                <span className={`mt-1 text-[11px] font-extrabold px-1.5 py-0.5 rounded ${
                  item.similarityPercent > 60 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.similarityPercent}% Match
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-600 mt-4">
        Connecting lines indicate overlapping concepts and public repository vector proximity.
      </p>
    </div>
  );
};
