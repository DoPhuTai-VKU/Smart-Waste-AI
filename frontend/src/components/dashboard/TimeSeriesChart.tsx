import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TimeSeriesStat } from '../../types/waste';

interface TimeSeriesChartProps {
  data: TimeSeriesStat[];
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/90 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-lg lg:text-xl font-extrabold text-slate-900">
            Xu hướng nhận diện theo thời gian
          </h4>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Số lượng lượt phân loại qua các ngày
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          7 ngày gần nhất
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={13}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={13}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl text-xs shadow-xl">
                      <p className="font-semibold text-slate-300">Ngày: {label}</p>
                      <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
                        {payload[0].value} lượt nhận diện
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#wasteGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
