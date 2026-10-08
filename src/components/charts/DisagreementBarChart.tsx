import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Submission, Competition } from '../../types';
import { ExternalLink } from 'lucide-react';

interface DisagreementBarChartProps {
  submissions: Submission[];
  competition: Competition;
}

export const DisagreementBarChart: React.FC<DisagreementBarChartProps> = ({ submissions, competition }) => {
  const items = submissions
    .filter(s => s.humanScore !== null)
    .map(s => {
      const diff = Math.abs(Math.round(((s.humanScore ?? 0) - s.aiScore) * 10) / 10);
      return {
        id: s.id,
        name: s.projectName,
        teamName: s.teamName,
        aiScore: s.aiScore,
        humanScore: s.humanScore ?? 0,
        disagreement: diff,
        isReviewRequired: diff >= 2.0
      };
    })
    .sort((a, b) => b.disagreement - a.disagreement)
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={items} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 13, 47, 0.15)" />
            <XAxis
              dataKey="name"
              stroke="#3E0D1E"
              tick={{ fontSize: 10, fill: '#3E0D1E' }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis stroke="#3E0D1E" tick={{ fontSize: 11, fill: '#3E0D1E' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#3E0D1E', borderColor: '#E87D87', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              formatter={(value: any, _name: any, payload: any) => [
                `|AI (${payload.payload.aiScore}) - Human (${payload.payload.humanScore})| = ${Number(value).toFixed(1)} pt`,
                'Score Delta'
              ]}
            />
            <Bar dataKey="disagreement" name="|AI - Human| Delta" radius={[4, 4, 0, 0]}>
              {items.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isReviewRequired ? '#D94A63' : '#F2B84B'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 pt-2 border-t border-[#E87D87]/40">
        <span className="text-[11px] font-bold text-[#9D0D2F] uppercase tracking-wider block">
          Highest Disagreement Submissions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.slice(0, 4).map(item => (
            <div key={item.id} className="p-2.5 rounded-lg bg-white/80 border border-[#E87D87]/60 flex items-center justify-between text-xs">
              <div className="truncate pr-2">
                <span className="font-semibold text-[#3E0D1E] truncate block">{item.name}</span>
                <span className="text-slate-600 text-[11px]">AI {item.aiScore} vs Human {item.humanScore}</span>
              </div>
              <Link
                to={`/organizer/competitions/${competition.id}/submissions/${item.id}?tab=diff`}
                className="px-2.5 py-1 rounded bg-[#9D0D2F]/10 hover:bg-[#9D0D2F]/20 text-[#9D0D2F] font-semibold flex items-center space-x-1 flex-shrink-0"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
