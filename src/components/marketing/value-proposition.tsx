import { QrCode, HeartHandshake, ShieldCheck, LineChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function ValueProposition() {
  const values = [
    {
      icon: <QrCode className="w-5 h-5 text-brand-primary" />,
      title: 'Physical Touchpoint QR Codes',
      description:
        'Print high-resolution QR codes directly on table tents, receipts, takeout bags, and storefront windows for effortless in-person scanning.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-success" />,
      title: 'Ethical & Non-Gated Reviews',
      description:
        'Never violate Google terms by filtering or blocking unhappy customers. Every patron has immediate, direct access to your public Google review page.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-brand-warning" />,
      title: 'Instant Private Service Recovery',
      description:
        'Provide a direct channel for dissatisfied customers to voice concerns privately to management before negative opinions reach public forums.',
    },
    {
      icon: <LineChart className="w-5 h-5 text-brand-info" />,
      title: 'Actionable Sentiment Trends',
      description:
        'Aggregate scans, ratings, and feedback volume over time so your team can identify operational bottlenecks and celebrate top-performing staff.',
    },
  ];

  return (
    <section className="py-20 bg-brand-background border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Why ReviewFlow
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-brand-text-primary">
            Built for Modern Business Touchpoints
          </p>
          <p className="text-sm text-brand-text-secondary leading-relaxed">
            Designed to bridge the gap between physical customer visits and digital reputation without annoying app installs or misleading review filters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <Card key={v.title} className="p-2 bg-brand-surface shadow-subtle hover:border-indigo-100 transition-colors">
              <CardHeader className="space-y-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-brand-border flex items-center justify-center">
                  {v.icon}
                </div>
                <CardTitle className="text-base font-bold text-brand-text-primary">
                  {v.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-brand-text-secondary leading-relaxed">
                {v.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
