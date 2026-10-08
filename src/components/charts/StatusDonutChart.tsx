import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Submission } from '../../types';

interface StatusDonutChartProps {
  submissions: Submission[];
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ submissions }) => {
  const counts = {
    'Pending AI': submissions.filter(s => s.aiStatus === 'Pending').length,
    'AI Reviewing': submissions.filter(s => s.aiStatus === 'Analyzing').length,
    'AI Complete': submissions.filter(s => s.aiStatus === 'Complete' && s.humanEvaluations.length === 0).length,
    'Human Reviewing': submissions.filter(s => s.humanEvaluations.length > 0 && s.status !== 'Finalist').length,
    'Finalized': submissions.filter(s => s.status === 'Finalist').length,
  };

  const data = [
    { name: 'Pending AI', value: counts['Pending AI'], color: '#ECA59D' },
    { name: 'AI Reviewing', value: counts['AI Reviewing'], color: '#E87D87' },
    { name: 'AI Complete', value: counts['AI Complete'], color: '#B4204A' },
    { name: 'Human Reviewing', value: counts['Human Reviewing'], color: '#F2B84B' },
    { name: 'Finalized', value: counts['Finalized'], color: '#35B779' },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#3E0D1E', borderColor: '#E87D87', borderRadius: '0.75rem', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
            formatter={(val: any) => [`${val} Submissions`, 'Count']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-[#3E0D1E] font-bold">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
