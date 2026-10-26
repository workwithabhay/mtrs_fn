'use client';

import * as React from 'react';
import { TrendingUp, Table as TableIcon, LineChart as ChartIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AnalyticsDailyTrendPoint, AnalyticsPeriod } from '@/lib/api/types';

interface AnalyticsTrendChartProps {
  trends: AnalyticsDailyTrendPoint[];
  period?: AnalyticsPeriod;
}

export function AnalyticsTrendChart({ trends, period }: AnalyticsTrendChartProps) {
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart');
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const hasData = trends.length > 0;
  const maxVal = React.useMemo(() => {
    let max = 0;
    for (const pt of trends) {
      if (pt.scanCount > max) max = pt.scanCount;
      if (pt.feedbackCount > max) max = pt.feedbackCount;
      if (pt.googleReviewClicks > max) max = pt.googleReviewClicks;
    }
    return max > 0 ? max : 5; // default scale when all zeroes
  }, [trends]);

  // Chart layout dimensions
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Build SVG points string
  const pointSpacing = trends.length > 1 ? chartW / (trends.length - 1) : chartW / 2;

  const getCoordinates = (index: number, val: number) => {
    const x = padding.left + (trends.length > 1 ? index * pointSpacing : chartW / 2);
    const y = padding.top + chartH - (val / maxVal) * chartH;
    return { x, y };
  };

  const scanPoints = trends.map((pt, i) => getCoordinates(i, pt.scanCount));
  const feedbackPoints = trends.map((pt, i) => getCoordinates(i, pt.feedbackCount));
  const clickPoints = trends.map((pt, i) => getCoordinates(i, pt.googleReviewClicks));

  const toPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`, '');
  };

  const toAreaString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const linePart = toPathString(points);
    const bottomY = padding.top + chartH;
    const lastX = points[points.length - 1]?.x ?? 0;
    const firstX = points[0]?.x ?? 0;
    return `${linePart} L ${lastX.toFixed(1)},${bottomY} L ${firstX.toFixed(1)},${bottomY} Z`;
  };

  const hoveredPoint = hoveredIndex !== null && trends[hoveredIndex] ? trends[hoveredIndex] : null;

  return (
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-primary" aria-hidden="true" />
            <CardTitle className="text-base font-bold">Activity Trends</CardTitle>
          </div>
          <CardDescription className="text-xs text-brand-text-secondary mt-0.5">
            Daily QR scans, customer feedback submissions, and Google Review link taps over time.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium mr-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              Scans
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Feedback
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              Review Taps
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
            className="text-xs gap-1.5 h-8"
          >
            {viewMode === 'chart' ? (
              <>
                <TableIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View as Table</span>
              </>
            ) : (
              <>
                <ChartIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View as Chart</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {!hasData ? (
          <div className="py-12 text-center text-xs text-brand-text-muted">
            No trend data recorded for this time period.
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto max-h-80 border border-brand-border rounded-xl">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">Daily activity trend records</caption>
              <thead className="bg-slate-50 text-brand-text-secondary border-b border-brand-border sticky top-0">
                <tr>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Date (UTC)</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">QR Scans</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Feedback Submissions</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Average Rating</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Review Link Taps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {trends.map((row) => (
                  <tr key={row.date} className="hover:bg-slate-50/50">
                    <td className="py-2 px-4 font-medium text-brand-text-primary">{row.date}</td>
                    <td className="py-2 px-4 text-brand-text-secondary">{row.scanCount}</td>
                    <td className="py-2 px-4 text-brand-text-secondary">{row.feedbackCount}</td>
                    <td className="py-2 px-4 text-brand-text-secondary">
                      {row.averageRating !== null ? `${row.averageRating.toFixed(1)} / 5` : '—'}
                    </td>
                    <td className="py-2 px-4 text-brand-text-secondary">{row.googleReviewClicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Visual SVG Chart */}
            <div className="relative w-full aspect-[21/9] min-h-[220px]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible"
                role="img"
                aria-label={`Activity trend chart from ${period?.startDate ?? 'start'} to ${period?.endDate ?? 'end'}`}
              >
                <title>Activity Trends Chart</title>
                <desc>Daily visualization showing scans in indigo, feedbacks in emerald, and review clicks in sky blue.</desc>

                {/* Y-axis Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                  const y = padding.top + chartH * (1 - pct);
                  const val = Math.round(maxVal * pct);
                  return (
                    <g key={pct}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={width - padding.right}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[10px] fill-slate-400 select-none font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Area fills for Scans */}
                <path
                  d={toAreaString(scanPoints)}
                  fill="url(#scanGradient)"
                  opacity="0.2"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Lines */}
                <path
                  d={toPathString(scanPoints)}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={toPathString(feedbackPoints)}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={toPathString(clickPoints)}
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points / Vertical Hover Guides */}
                {trends.map((pt, idx) => {
                  const coords = scanPoints[idx];
                  if (!coords) return null;
                  const isHovered = hoveredIndex === idx;

                  return (
                    <g
                      key={pt.date}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="cursor-pointer"
                    >
                      {/* Vertical indicator on hover */}
                      {isHovered && (
                        <line
                          x1={coords.x}
                          y1={padding.top}
                          x2={coords.x}
                          y2={padding.top + chartH}
                          stroke="#94A3B8"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Visible dots */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isHovered ? 5 : 3}
                        fill="#4F46E5"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />

                      {/* Transparent wider hit area for easy hover on mobile */}
                      <rect
                        x={coords.x - pointSpacing / 2}
                        y={padding.top}
                        width={pointSpacing}
                        height={chartH}
                        fill="transparent"
                      />
                    </g>
                  );
                })}

                {/* X-axis date labels */}
                {trends
                  .filter((_, idx) => {
                    const step = Math.ceil(trends.length / 6);
                    return idx % step === 0 || idx === trends.length - 1;
                  })
                  .map((pt) => {
                    const idx = trends.indexOf(pt);
                    const coords = scanPoints[idx];
                    if (!coords) return null;

                    const dateShort = pt.date.slice(5); // MM-DD
                    return (
                      <text
                        key={pt.date}
                        x={coords.x}
                        y={padding.top + chartH + 18}
                        textAnchor="middle"
                        className="text-[10px] fill-slate-500 font-mono select-none"
                      >
                        {dateShort}
                      </text>
                    );
                  })}
              </svg>
            </div>

            {/* Hovered point details banner */}
            <div className="h-8 flex items-center justify-between text-xs px-3 py-1.5 bg-slate-50 rounded-lg border border-brand-border/60">
              {hoveredPoint ? (
                <div className="flex flex-wrap items-center gap-4 text-brand-text-secondary">
                  <span className="font-semibold text-brand-text-primary">
                    {hoveredPoint.date}:
                  </span>
                  <span className="flex items-center gap-1">
                    <strong className="text-indigo-600">{hoveredPoint.scanCount}</strong> scans
                  </span>
                  <span className="flex items-center gap-1">
                    <strong className="text-emerald-600">{hoveredPoint.feedbackCount}</strong> feedback
                  </span>
                  <span className="flex items-center gap-1">
                    <strong className="text-sky-600">{hoveredPoint.googleReviewClicks}</strong> review taps
                  </span>
                  {hoveredPoint.averageRating !== null && (
                    <span className="flex items-center gap-1">
                      <strong className="text-amber-600">{hoveredPoint.averageRating.toFixed(1)}★</strong> avg
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-brand-text-muted text-[11px]">
                  Hover over points on the chart to inspect daily breakdown.
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
