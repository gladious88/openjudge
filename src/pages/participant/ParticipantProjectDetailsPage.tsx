import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';

export const ParticipantProjectDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTeam } = useCompetition();

  const [projectName, setProjectName] = useState<string>(() => {
    return localStorage.getItem('draft_projectName') || '';
  });
  const [category, setCategory] = useState<string>(() => {
    return localStorage.getItem('draft_category') || 'AI & Sustainability';
  });
  const [problem, setProblem] = useState<string>(() => {
    return localStorage.getItem('draft_problem') || '';
  });
  const [solution, setSolution] = useState<string>(() => {
    return localStorage.getItem('draft_solution') || '';
  });
  const [targetUsers, setTargetUsers] = useState<string>(() => {
    return localStorage.getItem('draft_targetUsers') || '';
  });
  const [impact, setImpact] = useState<string>(() => {
    return localStorage.getItem('draft_impact') || '';
  });

  const handleNext = () => {
    if (!projectName.trim() || !problem.trim() || !solution.trim()) {
      alert('Please enter your project name, problem statement, and proposed solution.');
      return;
    }

    localStorage.setItem('draft_projectName', projectName);
    localStorage.setItem('draft_category', category);
    localStorage.setItem('draft_problem', problem);
    localStorage.setItem('draft_solution', solution);
    localStorage.setItem('draft_targetUsers', targetUsers);
    localStorage.setItem('draft_impact', impact);

    navigate('/participant/submission/technical');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-white/20">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#9D0D2F]">
          <span className="w-6 h-6 rounded-full bg-[#9D0D2F] text-white flex items-center justify-center text-xs">1</span>
          <span className="text-[#3E0D1E]">Project Overview</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-[#9D0D2F] font-medium">
          <span>Step 1 of 4</span>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3E0D1E]">Project Overview & Vision</h1>
          <p className="text-xs text-[#3E0D1E]/80 mt-1 font-medium">
            Describe the core problem, proposed solution, and user impact for team: <span className="font-semibold text-[#9D0D2F]">{currentTeam?.teamName}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="e.g. AgriSense AI — Smart Crop Disease Detection"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-sm font-semibold focus:outline-none focus:border-[#9D0D2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-sm font-semibold focus:outline-none focus:border-[#9D0D2F]"
            >
              <option value="AI & Sustainability">AI & Sustainability</option>
              <option value="Civic & Public Tech">Civic & Public Tech</option>
              <option value="Healthcare & Wellbeing">Healthcare & Wellbeing</option>
              <option value="FinTech & Blockchain">FinTech & Blockchain</option>
              <option value="Education & AI Learning">Education & AI Learning</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              Problem Statement *
            </label>
            <textarea
              rows={3}
              value={problem}
              onChange={e => setProblem(e.target.value)}
              placeholder="What specific problem or inefficiency does your project address?"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
              Proposed Solution *
            </label>
            <textarea
              rows={3}
              value={solution}
              onChange={e => setSolution(e.target.value)}
              placeholder="How does your innovation solve this problem? What is the core mechanism?"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F] leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                Target Users
              </label>
              <input
                type="text"
                value={targetUsers}
                onChange={e => setTargetUsers(e.target.value)}
                placeholder="e.g. Rural farmers in Midwest region"
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                Expected Impact / Metrics
              </label>
              <input
                type="text"
                value={impact}
                onChange={e => setImpact(e.target.value)}
                placeholder="e.g. Reduce crop yield loss by 35%"
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#9D0D2F]/20">
          <button
            onClick={() => navigate('/participant')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] font-semibold text-xs border border-[#9D0D2F]/30 transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#9D0D2F]" />
            <span>Cancel</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <span>Next: Technical Stack</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
