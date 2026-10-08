import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/20 glass-panel py-10 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E87D87]/50">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#9D0D2F]" />
              <span className="text-lg font-extrabold text-[#3E0D1E]">OpenJudge AI</span>
            </div>
            <p className="text-xs text-[#3E0D1E]/80 max-w-sm leading-relaxed font-semibold">
              "One rubric. Every project. Smarter judging."
              Fair, evidence-backed first-read support for hackathons and innovation competitions.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 border border-[#E87D87] text-xs text-[#9D0D2F] font-extrabold">
              <Sparkles className="w-4 h-4 text-[#B4204A]" />
              <span>AI assists. Humans decide.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#9D0D2F] uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs font-bold text-[#3E0D1E]">
              <li><Link to="/" className="hover:text-[#B4204A] transition-colors">Home Landing</Link></li>
              <li><Link to="/participant" className="hover:text-[#B4204A] transition-colors">Participant Portal</Link></li>
              <li><Link to="/organizer" className="hover:text-[#B4204A] transition-colors">Organizer Dashboard</Link></li>
              <li><Link to="/organizer/competitions/new" className="hover:text-[#B4204A] transition-colors">Create Competition</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#9D0D2F] uppercase tracking-wider mb-3">Evaluation Engine</h4>
            <ul className="space-y-2 text-xs font-bold text-[#3E0D1E]">
              <li><span>4-Agent AI Panel</span></li>
              <li><span>Originality & Prior-Art Scan</span></li>
              <li><span>Statistical Calibration</span></li>
              <li><span>Live Pitch Assistant</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#3E0D1E]/80 font-bold gap-4">
          <p>© 2026 OpenJudge AI. Built for transparent, consistent judging.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 font-bold text-[#35B779]">
              <span className="w-2 h-2 rounded-full bg-[#35B779] animate-ping inline-block mr-1"></span>
              <span>Seeded Engine Active</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
