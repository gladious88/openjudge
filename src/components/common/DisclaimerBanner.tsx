import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'originality' | 'integrity' | 'general';
  customText?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ type = 'general', customText }) => {
  if (type === 'originality') {
    return (
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start space-x-2.5 shadow-sm my-4">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-amber-900">Mandatory Similarity Scan Disclaimer</span>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            {customText || "Demo similarity results shown for illustration only — not verified legal or IP conclusions."}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'integrity') {
    return (
      <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-950 text-xs flex items-start space-x-2.5 shadow-sm my-4">
        <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-red-900">Integrity Cross-Check Verification</span>
          <p className="text-red-800 mt-0.5 leading-relaxed">
            {customText || "Flags indicate potential inconsistency and require human verification. OpenJudge AI does not make fraud or plagiarism accusations."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-white/80 border border-[#E87D87]/60 text-[#3E0D1E] text-xs flex items-center space-x-2.5 my-3 shadow-xs">
      <img src="/favicon.png" alt="Info" className="w-4 h-4 object-contain flex-shrink-0" />
      <span className="font-medium">{customText || "AI assists. Humans decide. Scores & evaluations remain editable by authorized judges."}</span>
    </div>
  );
};
