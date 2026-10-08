import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ParticipantTechnicalPage: React.FC = () => {
  const navigate = useNavigate();

  const [techInput, setTechInput] = useState<string>(() => {
    return localStorage.getItem('draft_technologies') || 'React, TypeScript, Python, PyTorch, FastAPI, PostgreSQL';
  });
  const [architecture, setArchitecture] = useState<string>(() => {
    return localStorage.getItem('draft_architecture') || '';
  });
  const [aiComponents, setAiComponents] = useState<string>(() => {
    return localStorage.getItem('draft_aiComponents') || '';
  });
  const [limitations, setLimitations] = useState<string>(() => {
    return localStorage.getItem('draft_limitations') || '';
  });

  const handleNext = () => {
    localStorage.setItem('draft_technologies', techInput);
    localStorage.setItem('draft_architecture', architecture);
    localStorage.setItem('draft_aiComponents', aiComponents);
    localStorage.setItem('draft_limitations', limitations);

    navigate('/participant/submission/evidence');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-white/20">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#9D0D2F]">
          <span className="w-6 h-6 rounded-full bg-[#9D0D2F] text-white flex items-center justify-center text-xs">2</span>
          <span className="text-[#3E0D1E]">Technical Feasibility & Architecture</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-[#9D0D2F] font-medium">
          <span>Step 2 of 4</span>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3E0D1E]">Technical Implementation</h1>
          <p className="text-xs text-[#3E0D1E]/80 mt-1 font-medium">
            Specify your technical architecture, models, database design, and engineering considerations.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              Technology Stack (comma separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js, Python, TensorFlow, PostgreSQL"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              System Architecture & Infrastructure
            </label>
            <textarea
              rows={3}
              value={architecture}
              onChange={e => setArchitecture(e.target.value)}
              placeholder="Describe your backend pipeline, database indexing, edge caching, or cloud deployment strategy."
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              AI / ML Components (If applicable)
            </label>
            <textarea
              rows={2}
              value={aiComponents}
              onChange={e => setAiComponents(e.target.value)}
              placeholder="Specify models used, fine-tuning datasets, embedding indexes, or prompt engineering techniques."
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              Technical Limitations & Known Risks
            </label>
            <input
              type="text"
              value={limitations}
              onChange={e => setLimitations(e.target.value)}
              placeholder="e.g. High API latency under concurrent load; offline mode pending."
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#9D0D2F]/20">
          <button
            onClick={() => navigate('/participant/submission/project')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] font-semibold text-xs border border-[#9D0D2F]/30 transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#9D0D2F]" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <span>Next: Evidence & Links</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
