import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { useCompetition, DEMO_TOUR_STEPS } from '../../hooks/useCompetition';

export const DemoTourBar: React.FC = () => {
  const { isDemoTourActive, demoTourStepIndex, nextDemoTourStep, prevDemoTourStep, endDemoTour } = useCompetition();
  const navigate = useNavigate();

  const currentStep = DEMO_TOUR_STEPS[demoTourStepIndex];

  useEffect(() => {
    if (isDemoTourActive && currentStep) {
      navigate(currentStep.path);
    }
  }, [isDemoTourActive, demoTourStepIndex, currentStep, navigate]);

  if (!isDemoTourActive || !currentStep) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl glass-panel p-3.5 rounded-2xl border border-[#E87D87] shadow-2xl shadow-rose-950/20 flex items-center justify-between gap-4 bg-white/95">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-[#E87D87] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[#9D0D2F]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9D0D2F] bg-white px-2 py-0.5 rounded-full border border-[#E87D87]">
              Guided Tour ({demoTourStepIndex + 1}/{DEMO_TOUR_STEPS.length})
            </span>
            <h4 className="text-xs font-bold text-[#3E0D1E] truncate">{currentStep.title}</h4>
          </div>
          <p className="text-xs text-[#3E0D1E]/80 truncate mt-0.5 font-semibold">{currentStep.description}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={prevDemoTourStep}
          disabled={demoTourStepIndex === 0}
          className="p-1.5 rounded-lg bg-white border border-[#E87D87] disabled:opacity-40 text-[#3E0D1E] hover:bg-rose-50 transition-colors"
          title="Previous Step"
        >
          <ChevronLeft className="w-4 h-4 text-[#9D0D2F]" />
        </button>

        <button
          onClick={nextDemoTourStep}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-extrabold text-xs shadow-md shadow-rose-950/20 transition-all"
        >
          <span>{demoTourStepIndex === DEMO_TOUR_STEPS.length - 1 ? 'Finish' : 'Next Step'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={endDemoTour}
          className="p-1.5 rounded-lg bg-white border border-[#E87D87] text-[#3E0D1E] hover:bg-rose-50 hover:text-[#D94A63] transition-colors ml-1"
          title="Exit Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
