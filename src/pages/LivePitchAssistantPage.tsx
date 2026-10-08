import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Radio, Sparkles, MessageSquare, Check, Copy, ArrowLeft } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';
import { aiService } from '../services/aiService';

interface AskedQuestion {
  id: string;
  text: string;
  askedAt?: string;
  isAsked: boolean;
}

export const LivePitchAssistantPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const { submissions } = useCompetition();

  const submission = submissions.find(s => s.id === submissionId) || submissions[0];

  const defaultTranscript = submission.livePitchTranscript || [
    { id: 't1', speaker: 'Team' as const, text: 'Our platform allows rural students to access AI-powered education even with limited connectivity.', timestamp: '00:15' },
    { id: 't2', speaker: 'Judge' as const, text: 'Can you elaborate on how offline sync operates without cellular towers?', timestamp: '00:45' },
    { id: 't3', speaker: 'Team' as const, text: 'We stream telemetry packets using low-frequency radio bursts to local hub micro-servers.', timestamp: '01:10' }
  ];

  const [transcript] = useState(defaultTranscript);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [suggestedQuestions, setSuggestedQuestions] = useState<AskedQuestion[]>(() => {
    if (submission.suggestedQuestions && submission.suggestedQuestions.length > 0) {
      return submission.suggestedQuestions.map((q, i) => ({ id: `sq-${i}`, text: q, isAsked: false }));
    }
    return [
      { id: 'q1', text: `How does ${submission.projectName} handle AI inference under peak traffic?`, isAsked: false },
      { id: 'q2', text: `How did your team validate this solution with target user group: ${submission.targetUsers || submission.summary?.targetUsers || 'end users'}?`, isAsked: false },
      { id: 'q3', text: 'What prevents competitors from replicating this exact technical approach?', isAsked: false }
    ];
  });

  const handleGenerateQuestion = async () => {
    const newQs = aiService.generateFollowUpQuestions(submission);
    const unadded = newQs.filter((qText: string) => !suggestedQuestions.some(sq => sq.text === qText));
    
    if (unadded.length > 0) {
      setSuggestedQuestions(prev => [
        ...prev,
        { id: `q-${Date.now()}`, text: unadded[0], isAsked: false }
      ]);
    } else {
      setSuggestedQuestions(prev => [
        ...prev,
        { id: `q-${Date.now()}`, text: 'What prevents competitors from replicating this exact solution?', isAsked: false }
      ]);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAsked = (id: string) => {
    setSuggestedQuestions(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            isAsked: !q.isAsked,
            askedAt: !q.isAsked ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return q;
      })
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              to={`/organizer/competitions/comp-2026-nsic/submissions/${submission.id}`}
              className="p-2.5 btn-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-[#9D0D2F]" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-[#9D0D2F]/10 px-2.5 py-1 rounded-full border border-[#E87D87] flex items-center space-x-1">
                  <Radio className="w-3.5 h-3.5 text-[#9D0D2F] animate-pulse" />
                  <span>Live Pitch Telemetry</span>
                </span>
                <span className="text-xs font-extrabold text-[#3E0D1E]">{submission.projectName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-1">
                Live Pitch Assistant
              </h1>
            </div>
          </div>

          <button
            onClick={handleGenerateQuestion}
            className="px-4 py-2.5 btn-primary text-xs flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Targeted Question</span>
          </button>
        </div>

        {/* Live Assistant Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Audio Transcript */}
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#9D0D2F]" />
              <span>Real-Time Pitch Audio Transcript</span>
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {transcript.map(item => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-white/80 border border-[#E87D87]/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-[11px] ${item.speaker === 'Team' ? 'text-[#9D0D2F]' : 'text-[#B4204A]'}`}>
                      {item.speaker}
                    </span>
                    <span className="text-[10px] text-[#3E0D1E]/70">{item.timestamp}</span>
                  </div>
                  <p className="text-[#3E0D1E] leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggested Questions */}
          <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-4">
            <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#9D0D2F]" />
              <span>AI Suggested Follow-Up Questions ({suggestedQuestions.length})</span>
            </h3>

            <div className="space-y-3">
              {suggestedQuestions.map(q => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 text-xs ${
                    q.isAsked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-white/80 border-[#E87D87]/60 text-[#3E0D1E]'
                  }`}
                >
                  <p className="font-semibold leading-relaxed">{q.text}</p>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-[#E87D87]/30">
                    <button
                      onClick={() => handleToggleAsked(q.id)}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center space-x-1 ${
                        q.isAsked
                          ? 'bg-[#35B779] text-white'
                          : 'bg-white border border-[#E87D87] hover:bg-rose-50 text-[#3E0D1E]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{q.isAsked ? `Asked at ${q.askedAt}` : 'Mark as Asked'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(q.id, q.text)}
                      className="px-2.5 py-1 btn-secondary text-[11px] flex items-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#9D0D2F]" />
                      <span>{copiedId === q.id ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
