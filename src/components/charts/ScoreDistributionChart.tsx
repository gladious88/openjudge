import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Submission } from '../../types';

interface ScoreDistributionChartProps {
  submissions: Submission[];
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ submissions }) => {
  // Buckets from 1-2, 2-3, ... 9-10
  const buckets = [
    { range: '1.0-2.0', ai: 0, human: 0 },
    { range: '2.1-3.0', ai: 0, human: 0 },
    { range: '3.1-4.0', ai: 0, human: 0 },
    { range: '4.1-5.0', ai: 0, human: 0 },
    { range: '5.1-6.0', ai: 0, human: 0 },
    { range: '6.1-7.0', ai: 0, human: 0 },
    { range: '7.1-8.0', ai: 0, human: 0 },
    { range: '8.1-9.0', ai: 0, human: 0 },
    { range: '9.1-10.0', ai: 0, human: 0 },
  ];

  submissions.forEach(sub => {
    if (sub.aiScore > 0) {
      const idx = Math.min(8, Math.max(0, Math.floor(sub.aiScore) - 1));
      buckets[idx].ai += 1;
    }
    if (sub.humanScore !== null && sub.humanScore > 0) {
      const idx = Math.min(8, Math.max(0, Math.floor(sub.humanScore) - 1));
      buckets[idx].human += 1;
    }
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 13, 47, 0.15)" />
          <XAxis dataKey="range" stroke="#3E0D1E" tick={{ fontSize: 11, fill: '#3E0D1E' }} />
          <YAxis stroke="#3E0D1E" tick={{ fontSize: 11, fill: '#3E0D1E' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#3E0D1E', borderColor: '#E87D87', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
          />
          <Legend formatter={(value) => <span className="text-xs text-[#3E0D1E] font-semibold">{value}</span>} />
          <Bar dataKey="ai" name="AI Scores" fill="#9D0D2F" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Bar dataKey="human" name="Human Scores" fill="#B4204A" radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
