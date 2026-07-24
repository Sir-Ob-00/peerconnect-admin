

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  height?: number;
}

export function BarChart({ data, title, height = 200 }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full space-y-3">
      {title && <h3 className="text-sm font-semibold text-slate-800">{title}</h3>}
      {data.length === 0 ? (
        <div className="flex items-center justify-center border-b border-slate-200 text-xs text-slate-400" style={{ height: `${height}px` }}>
          No registration trend data available
        </div>
      ) : (
        <div className="flex items-end gap-3 w-full border-b border-slate-200 pb-2" style={{ height: `${height}px` }}>
          {data.map((item, idx) => {
            const percentage = Math.round((item.value / maxValue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-8 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {item.label}: {item.value}
                </div>
                <div className="text-xs font-semibold text-slate-600 mb-1">{item.value}</div>
                <div
                  className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${item.color || 'bg-brand-600'}`}
                  style={{ height: `${percentage}%`, minHeight: item.value > 0 ? '4px' : '0' }}
                />
                <span className="text-[11px] text-slate-500 mt-2 truncate max-w-full font-medium" title={item.label}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ProgressDistributionProps {
  items: Array<{ label: string; value: number; total: number; color?: string }>;
  title?: string;
}

export function ProgressDistribution({ items, title }: ProgressDistributionProps) {
  return (
    <div className="w-full space-y-4">
      {title && <h3 className="text-sm font-semibold text-slate-800">{title}</h3>}
      {items.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No distribution data available
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const percent = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>{item.label}</span>
                  <span>{item.value} ({percent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color || 'bg-brand-600'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  title?: string;
  totalLabel?: string;
}

export function DonutChart({ data, title, totalLabel = 'Total' }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full space-y-4">
      {title && <h3 className="text-sm font-semibold text-slate-800">{title}</h3>}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {total > 0 &&
              data.map((item, idx) => {
                const prevSum = data.slice(0, idx).reduce((s, d) => s + d.value, 0);
                const strokeDasharray = `${(item.value / total) * 100} ${100 - (item.value / total) * 100}`;
                const strokeDashoffset = -((prevSum / total) * 100);
                return (
                  <path
                    key={idx}
                    strokeWidth="4"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    stroke={item.color}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    className="transition-all duration-500"
                  />
                );
              })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold text-slate-900">{total}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">{totalLabel}</span>
          </div>
        </div>
        <div className="space-y-2 flex-1 w-full">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.label}</span>
              </div>
              <span className="font-bold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
