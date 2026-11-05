import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CategoryStat } from '../../types/waste';
import { getCategoryInfo } from '../../constants/wasteCategories';

interface CategoryChartProps {
  data: CategoryStat[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const chartData = data.map((item) => {
    const info = getCategoryInfo(item.categoryKey || item.category);
    return {
      name: info.labelVi,
      count: item.count,
      color: item.color || info.chartColor,
      binColorName: info.binColorName,
    };
  });

  const total = chartData.reduce((acc, cur) => acc + cur.count, 0);

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/90 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-lg lg:text-xl font-extrabold text-slate-900">
            Phân bố theo nhóm rác
          </h4>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Tỷ lệ các loại rác thải đã nhận diện trong hệ thống
          </p>
        </div>
        <span className="text-sm font-bold px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full">
          {total.toLocaleString()} lượt
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center flex-1">
        {/* Donut Chart */}
        <div className="h-60 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                    return (
                      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl text-xs shadow-xl space-y-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-emerald-300 font-extrabold text-sm">
                          {item.count.toLocaleString()} lượt ({pct}%)
                        </p>
                        <p className="text-slate-300 text-xs font-medium">
                          {item.binColorName}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={88}
                paddingAngle={4}
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng số
            </span>
            <span className="text-2xl font-black text-slate-900">
              {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend / Category List Breakdown */}
        <div className="space-y-2.5">
          {chartData.map((item, idx) => {
            const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="truncate">
                    <span className="font-bold text-slate-800 text-sm block truncate">
                      {item.name}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {item.binColorName}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-xs ml-1.5 font-bold">
                    ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
