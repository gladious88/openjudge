import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Submission } from '../../types';

interface ScatterScoreChartProps {
  submissions: Submission[];
}

export const ScatterScoreChart: React.FC<ScatterScoreChartProps> = ({ submissions }) => {
  const data = submissions
    .filter(s => s.humanScore !== null)
    .map(s => ({
      name: s.projectName,
      team: s.teamName,
      aiScore: s.aiScore,
      humanScore: s.humanScore ?? 0,
      diff: Math.abs(Math.round(((s.humanScore ?? 0) - s.aiScore) * 10) / 10)
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 13, 47, 0.15)" />
          <XAxis
            type="number"
            dataKey="aiScore"
            name="AI Score"
            domain={[4, 10]}
            stroke="#3E0D1E"
            tick={{ fontSize: 11, fill: '#3E0D1E' }}
            label={{ value: 'AI Score', position: 'bottom', fill: '#9D0D2F', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="humanScore"
            name="Human Score"
            domain={[4, 10]}
            stroke="#3E0D1E"
            tick={{ fontSize: 11, fill: '#3E0D1E' }}
            label={{ value: 'Human Score', angle: -90, position: 'left', fill: '#9D0D2F', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#3E0D1E', borderColor: '#E87D87', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
            formatter={(value: any, name: any) => [
              `${Number(value).toFixed(1)}`,
              name
            ]}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <ReferenceLine segment={[{ x: 4, y: 4 }, { x: 10, y: 10 }]} stroke="#9D0D2F" strokeDasharray="5 5" label={{ value: '1:1 Perfect Agreement Line', fill: '#9D0D2F', fontSize: 10, position: 'insideTopLeft' }} />
          <Scatter name="Projects" data={data} fill="#B4204A" opacity={0.85} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
