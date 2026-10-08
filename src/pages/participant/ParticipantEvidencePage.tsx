import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Code, ExternalLink, Video, FileCheck } from 'lucide-react';

export const ParticipantEvidencePage: React.FC = () => {
  const navigate = useNavigate();

  const [githubUrl, setGithubUrl] = useState<string>(() => {
    return localStorage.getItem('draft_githubUrl') || '';
  });
  const [demoUrl, setDemoUrl] = useState<string>(() => {
    return localStorage.getItem('draft_demoUrl') || '';
  });
  const [demoVideoUrl, setDemoVideoUrl] = useState<string>(() => {
    return localStorage.getItem('draft_demoVideoUrl') || '';
  });
  const [pitchDeck, setPitchDeck] = useState<string>(() => {
    return localStorage.getItem('draft_pitchDeck') || '';
  });

  const handleNext = () => {
    localStorage.setItem('draft_githubUrl', githubUrl);
    localStorage.setItem('draft_demoUrl', demoUrl);
    localStorage.setItem('draft_demoVideoUrl', demoVideoUrl);
    localStorage.setItem('draft_pitchDeck', pitchDeck);

    navigate('/participant/submission/review');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-white/20">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#9D0D2F]">
          <span className="w-6 h-6 rounded-full bg-[#9D0D2F] text-white flex items-center justify-center text-xs">3</span>
          <span className="text-[#3E0D1E]">Proof & Evidence Links</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-[#9D0D2F] font-medium">
          <span>Step 3 of 4</span>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3E0D1E]">Verification & Evidence Links</h1>
          <p className="text-xs text-[#3E0D1E]/80 mt-1 font-medium">
            Provide your codebase repository, live demo link, video walkthrough, and pitch deck for AI evidence verification.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Code className="w-4 h-4 text-[#9D0D2F]" />
              <span>GitHub Repository URL</span>
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/team-name/project-repo"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs font-mono focus:outline-none focus:border-[#9D0D2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <ExternalLink className="w-4 h-4 text-[#9D0D2F]" />
              <span>Live Application / Demo URL</span>
            </label>
            <input
              type="url"
              value={demoUrl}
              onChange={e => setDemoUrl(e.target.value)}
              placeholder="https://my-demo-app.vercel.app"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs font-mono focus:outline-none focus:border-[#9D0D2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Video className="w-4 h-4 text-[#9D0D2F]" />
              <span>Demo Video Walkthrough (Loom / YouTube)</span>
            </label>
            <input
              type="url"
              value={demoVideoUrl}
              onChange={e => setDemoVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=demo-video"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs font-mono focus:outline-none focus:border-[#9D0D2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-[#35B779]" />
              <span>Pitch Deck Slide Link / Upload</span>
            </label>
            <input
              type="text"
              value={pitchDeck}
              onChange={e => setPitchDeck(e.target.value)}
              placeholder="https://docs.google.com/presentation/d/your-deck"
              className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-xs focus:outline-none focus:border-[#9D0D2F]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#9D0D2F]/20">
          <button
            onClick={() => navigate('/participant/submission/technical')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] font-semibold text-xs border border-[#9D0D2F]/30 transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#9D0D2F]" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <span>Next: AI Pre-Check & Submit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
