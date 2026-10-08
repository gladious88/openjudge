import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Submission, Competition } from '../../types';

interface CriteriaBarChartProps {
  submissions: Submission[];
  competition: Competition;
}

export const CriteriaBarChart: React.FC<CriteriaBarChartProps> = ({ submissions, competition }) => {
  const data = competition.criteria.map(crit => {
    let aiSum = 0;
    let aiCount = 0;
    let humanSum = 0;
    let humanCount = 0;

    submissions.forEach(sub => {
      const exp = sub.explainableScoring.find(e => e.criterionId === crit.id || e.criterionName === crit.name);
      if (exp) {
        aiSum += exp.aiScore;
        aiCount += 1;
      }
      sub.humanEvaluations.forEach(evalItem => {
        if (evalItem.scores[crit.id] !== undefined) {
          humanSum += evalItem.scores[crit.id];
          humanCount += 1;
        }
      });
    });

    return {
      name: crit.name,
      aiAvg: aiCount > 0 ? Math.round((aiSum / aiCount) * 10) / 10 : 0,
      humanAvg: humanCount > 0 ? Math.round((humanSum / humanCount) * 10) / 10 : 0
    };
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 13, 47, 0.15)" />
          <XAxis dataKey="name" stroke="#3E0D1E" tick={{ fontSize: 11, fill: '#3E0D1E' }} />
          <YAxis domain={[0, 10]} stroke="#3E0D1E" tick={{ fontSize: 11, fill: '#3E0D1E' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#3E0D1E', borderColor: '#E87D87', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
          />
          <Legend formatter={(value) => <span className="text-xs text-[#3E0D1E] font-semibold">{value}</span>} />
          <Bar dataKey="aiAvg" name="Avg AI Score" fill="#9D0D2F" radius={[4, 4, 0, 0]} />
          <Bar dataKey="humanAvg" name="Avg Human Score" fill="#B4204A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
