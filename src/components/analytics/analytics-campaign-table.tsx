'use client';

import * as React from 'react';
import Link from 'next/link';
import { QrCode, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AnalyticsCampaignPerformanceItem } from '@/lib/api/types';

interface AnalyticsCampaignTableProps {
  campaigns: AnalyticsCampaignPerformanceItem[];
}

export function AnalyticsCampaignTable({ campaigns }: AnalyticsCampaignTableProps) {
  const hasCampaigns = campaigns.length > 0;

  return (
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-brand-primary" aria-hidden="true" />
            <CardTitle className="text-base font-bold">Campaign Performance</CardTitle>
          </div>
          <CardDescription className="text-xs text-brand-text-secondary mt-0.5">
            Compare scan activity, feedback conversion, and review taps by touchpoint.
          </CardDescription>
        </div>

        <Button asChild variant="outline" size="sm" className="text-xs gap-1.5 h-8">
          <Link href="/dashboard/campaigns">
            <span>Manage Touchpoints</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="pt-1">
        {!hasCampaigns ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-xs text-brand-text-muted">No QR campaigns have been created yet.</p>
            <Button asChild size="sm">
              <Link href="/dashboard/campaigns/new">Create First QR Campaign</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto border border-brand-border rounded-xl">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">Campaign touchpoint performance breakdown</caption>
                <thead className="bg-slate-50 text-brand-text-secondary border-b border-brand-border">
                  <tr>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Touchpoint / Campaign</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Status</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold text-right">Period Scans</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold text-right">Feedback</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold text-right">Submission Rate</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold text-right">Review Taps</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold text-right">All-Time Scans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {campaigns.map((camp) => {
                    const submissionRate =
                      camp.periodScans > 0
                        ? (camp.periodFeedbacks / camp.periodScans) * 100
                        : 0;

                    return (
                      <tr key={camp.campaignId} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-brand-text-primary">{camp.title}</div>
                          {camp.heading && (
                            <div className="text-[11px] text-brand-text-muted truncate max-w-xs">
                              {camp.heading}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={camp.status === 'active' ? 'success' : 'default'}
                            className="text-[10px] px-2 py-0.5"
                          >
                            {camp.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-brand-text-primary">
                          {camp.periodScans.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-brand-text-primary">
                          {camp.periodFeedbacks.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-brand-text-secondary">
                          {camp.periodScans > 0 ? `${submissionRate.toFixed(1)}%` : '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-sky-600">
                          {camp.periodGoogleReviewClicks.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-brand-text-muted">
                          {camp.totalScansAllTime.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {campaigns.map((camp) => {
                const submissionRate =
                  camp.periodScans > 0
                    ? (camp.periodFeedbacks / camp.periodScans) * 100
                    : 0;

                return (
                  <div
                    key={camp.campaignId}
                    className="p-3.5 bg-slate-50/60 rounded-xl border border-brand-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-text-primary truncate">{camp.title}</span>
                      <Badge
                        variant={camp.status === 'active' ? 'success' : 'default'}
                        className="text-[10px] px-2 py-0.5 shrink-0"
                      >
                        {camp.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-brand-border/40 text-[11px]">
                      <div>
                        <span className="text-brand-text-muted">Period Scans: </span>
                        <strong className="text-brand-text-primary">{camp.periodScans}</strong>
                      </div>
                      <div>
                        <span className="text-brand-text-muted">Feedback: </span>
                        <strong className="text-brand-text-primary">{camp.periodFeedbacks}</strong>
                      </div>
                      <div>
                        <span className="text-brand-text-muted">Submission Rate: </span>
                        <strong className="text-brand-text-secondary">
                          {camp.periodScans > 0 ? `${submissionRate.toFixed(1)}%` : '—'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-brand-text-muted">Review Taps: </span>
                        <strong className="text-sky-600">{camp.periodGoogleReviewClicks}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
