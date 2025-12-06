'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

interface StatsChartProps {
  data: any[];
  type?: 'line' | 'bar' | 'pie';
  dataKey?: string;
}

export default function StatsChart({ data, type = 'line', dataKey = 'value' }: StatsChartProps) {
  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
          <XAxis dataKey="name" stroke="#c4b5fd" />
          <YAxis stroke="#c4b5fd" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(15, 12, 41, 0.9)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#e9d5ff'
            }}
          />
          <Legend />
          <Bar dataKey={dataKey} fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
        <XAxis dataKey="name" stroke="#c4b5fd" />
        <YAxis stroke="#c4b5fd" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(15, 12, 41, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: '#e9d5ff'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke="#8b5cf6" 
          strokeWidth={2}
          dot={{ fill: '#a78bfa', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

