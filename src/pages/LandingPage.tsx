import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Search, 
  Sliders, 
  Radio, 
  BarChart3, 
  Users, 
  AlertCircle, 
  FileCheck,
  UserCheck
} from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadDemoCompetition } = useCompetition();

  const handleStartDemo = () => {
    loadDemoCompetition();
    navigate('/organizer');
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#E87D87] text-xs font-extrabold text-[#9D0D2F] mb-8 shadow-sm animate-pulse">
          <Sparkles className="w-4 h-4 text-[#B4204A]" />
          <span>AI assists. Humans decide.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          OpenJudge <span className="gradient-text font-black">AI</span>
        </h1>
        
        <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#ECA59D] tracking-wide">
          "One rubric. Every project. Smarter judging."
        </h2>

        <p className="mt-6 text-base sm:text-lg text-[#ECA59D] max-w-2xl mx-auto leading-relaxed font-semibold">
          An AI judging assistant — not a judge — that gives every submission in a hackathon or innovation competition the same rubric-based first read, backed by evidence, so human judges spend their limited time on informed final decisions instead of inconsistent first impressions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/organizer/competitions/new"
            className="w-full sm:w-auto px-8 py-4 btn-primary text-base flex items-center justify-center space-x-2"
          >
            <span>Create Competition</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </Link>

          <Link
            to="/participant"
            className="w-full sm:w-auto px-8 py-4 btn-secondary text-base flex items-center justify-center space-x-2"
          >
            <UserCheck className="w-5 h-5 text-[#9D0D2F]" />
            <span>Participant Portal</span>
          </Link>
          
          <button
            onClick={handleStartDemo}
            className="w-full sm:w-auto px-8 py-4 btn-primary text-base flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>Load Demo (100 Projects)</span>
          </button>
        </div>

        <div className="mt-12 inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-white/90 border border-[#E87D87] text-xs sm:text-sm text-[#3E0D1E] shadow-xs">
          <Shield className="w-5 h-5 text-[#9D0D2F] flex-shrink-0" />
          <span><strong className="text-[#9D0D2F]">Product Rule:</strong> AI never rejects projects automatically. Humans retain complete override control.</span>
        </div>
      </section>

      {/* Workflow Banner */}
      <section className="py-8 glass-panel border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-extrabold uppercase tracking-wider text-[#9D0D2F] mb-6">
            Standardized Evaluation Workflow
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {[
              { step: '1. Submission', desc: 'Code & Pitch Upload', icon: FileCheck },
              { step: '2. AI Analysis', desc: '4-Agent Panel Review', icon: Cpu },
              { step: '3. Multi-Agent Debate', desc: 'Synthesis & Consensus', icon: Layers },
              { step: '4. Evidence Check', desc: 'Originality & Integrity', icon: Search },
              { step: '5. Human Judge', desc: 'Calibrated Scorecard', icon: Users },
              { step: '6. Final Decision', desc: 'Transparent Leaderboard', icon: CheckCircle2 }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="p-3.5 rounded-2xl bg-white/90 border border-[#E87D87] flex flex-col items-center shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-[#9D0D2F] mb-2 border border-[#E87D87]/60">
                    <Icon className="w-4 h-4 text-[#9D0D2F]" />
                  </div>
                  <span className="text-xs font-extrabold text-[#3E0D1E]">{item.step}</span>
                  <span className="text-[10px] text-[#9D0D2F] font-bold mt-0.5">{item.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-xs font-extrabold text-[#E87D87] uppercase tracking-widest">Platform Capabilities</h2>
          <h3 className="text-3xl font-extrabold text-white">Engineered for Enterprise Judging</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Multi-Agent AI Panel', desc: '4 specialized AI personas evaluate Feasibility, Business, Originality, and Impact.', icon: Cpu },
            { title: 'Originality Detection', desc: 'Scans public repos and prior hackathon databases for concept overlap graph mapping.', icon: Search },
            { title: 'Judge Calibration', desc: 'Monitors statistical scoring variance across judge personas without auto-overriding.', icon: Sliders },
            { title: 'Explainable Scoring', desc: 'Every score includes evidence bullet lists, confidence percentages, and risk factors.', icon: Layers },
            { title: 'Live Pitch Assistant', desc: 'Streams live audio transcripts and generates targeted follow-up technical questions.', icon: Radio },
            { title: 'Integrity Detection', desc: 'Cross-checks pitch claims against codebase repositories for potential inconsistencies.', icon: AlertCircle },
            { title: 'Competition Analytics', desc: 'Scatter plots, agreement percentages, and estimated judging time savings metrics.', icon: BarChart3 },
            { title: 'Participant Pre-Check', desc: 'Provides actionable rubric guidance to teams prior to official deadline submission.', icon: UserCheck }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-3xl glass-card-hover border border-white/20">
                <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#E87D87] flex items-center justify-center text-[#9D0D2F] mb-4 shadow-2xs">
                  <Icon className="w-6 h-6 text-[#9D0D2F]" />
                </div>
                <h4 className="text-base font-extrabold text-[#3E0D1E] mb-2">{feat.title}</h4>
                <p className="text-xs text-[#3E0D1E]/80 leading-relaxed font-semibold">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
