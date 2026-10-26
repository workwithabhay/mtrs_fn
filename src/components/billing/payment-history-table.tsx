'use client';

import * as React from 'react';
import { Receipt, CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PaymentEventItem } from '@/lib/api/types';

interface PaymentHistoryTableProps {
  events?: PaymentEventItem[];
  items?: PaymentEventItem[];
  isLoading?: boolean;
}

export function PaymentHistoryTable({
  events,
  items,
  isLoading = false,
}: PaymentHistoryTableProps) {
  const transactionList = events && events.length > 0 ? events : items || [];

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading payment history"
        className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xs animate-pulse space-y-3"
      >
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="h-24 w-full bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-brand-text-primary">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text-primary">
              Billing &amp; Payment History
            </h3>
            <p className="text-xs text-brand-text-secondary">
              Record of all verified checkouts, renewals, and promotional activations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-brand-text-secondary bg-slate-50 px-2.5 py-1 rounded-lg border border-brand-border/60 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Server Verified Transactions</span>
        </div>
      </div>

      {transactionList.length === 0 ? (
        <div className="text-center py-10 rounded-xl border border-dashed border-brand-border bg-slate-50/50 p-6">
          <Receipt className="w-8 h-8 text-brand-text-secondary/50 mx-auto mb-2" />
          <p className="text-xs font-medium text-brand-text-primary">No payment history yet</p>
          <p className="text-[11px] text-brand-text-secondary mt-0.5">
            Invoices and verified plan transaction records will appear here as you subscribe.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-text-secondary font-semibold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Transaction</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Reference / Order ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {transactionList.map((event) => {
                const isSuccess = event.status === 'success';
                const isFailed = event.status === 'failed';
                const isPending = event.status === 'pending';

                const dateStr = new Date(event.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                const formattedAmount =
                  event.amount === 0
                    ? '₹0'
                    : `₹${(event.amount / 100).toLocaleString('en-IN')}`;

                const eventLabel =
                  event.eventType === 'checkout.initiated'
                    ? 'Checkout Initiated'
                    : event.eventType === 'payment.succeeded'
                      ? 'Payment Succeeded'
                      : event.eventType === 'payment.failed'
                        ? 'Payment Failed'
                        : event.eventType === 'promo.redeemed'
                          ? 'FREE4YOU Redeemed'
                          : event.eventType === 'subscription.cancelled'
                            ? 'Subscription Cancelled'
                            : event.eventType.replace('.', ' ');

                return (
                  <tr
                    key={event._id || event.id || event.idempotencyKey || `${event.createdAt}-${event.amount}`}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="py-3 px-3 font-medium text-brand-text-primary whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3 px-3 text-brand-text-primary font-medium">
                      <div>
                        <span>{eventLabel}</span>
                        {isFailed && event.failureReason && (
                          <p className="text-[10px] text-red-600 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{event.failureReason}</span>
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-brand-text-primary">
                      {formattedAmount}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={isSuccess ? 'success' : isPending ? 'secondary' : 'destructive'}
                        className="text-[10px] gap-1"
                      >
                        {isSuccess ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : isPending ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span className="capitalize">{event.status}</span>
                      </Badge>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {event.isSimulated ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Test Mode
                        </span>
                      ) : event.provider === 'razorpay' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          Razorpay
                        </span>
                      ) : event.provider === 'promo' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          Promo
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px] capitalize">
                          {event.provider || 'Gateway'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-brand-text-secondary truncate max-w-[160px]">
                      {event.paymentReference || event.checkoutId || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
