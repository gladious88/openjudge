import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { JudgePersona } from '../../types';

interface JudgeVarianceBoxPlotProps {
  judges: JudgePersona[];
  panelAvg?: number;
}

export const JudgeVarianceBoxPlot: React.FC<JudgeVarianceBoxPlotProps> = ({ judges, panelAvg = 7.8 }) => {
  const data = judges.map(j => ({
    name: j.name.split('(')[0].trim(),
    fullName: j.name,
    avgScore: j.avgScore,
    delta: j.deltaVsPanel,
    projectsCount: j.projectsScored
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 13, 47, 0.15)" />
          <XAxis dataKey="name" stroke="#3E0D1E" tick={{ fontSize: 11, fill: '#3E0D1E' }} />
          <YAxis domain={[5, 10]} stroke="#3E0D1E" tick={{ fontSize: 11, fill: '#3E0D1E' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#3E0D1E', borderColor: '#E87D87', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
            formatter={(value: any, _name: any, item: any) => [
              `${Number(value).toFixed(1)} (Δ ${item.payload.delta > 0 ? '+' : ''}${item.payload.delta.toFixed(1)} vs Panel)`,
              'Average Score'
            ]}
          />
          <ReferenceLine y={panelAvg} stroke="#9D0D2F" strokeDasharray="4 4" label={{ value: `Panel Avg (${panelAvg})`, fill: '#9D0D2F', fontSize: 11, position: 'top' }} />
          <Bar dataKey="avgScore" name="Avg Score" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.delta > 0.5 ? '#35B779' : entry.delta < -0.5 ? '#F2B84B' : '#9D0D2F'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
