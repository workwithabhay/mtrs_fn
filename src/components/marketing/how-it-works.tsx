import { Store, QrCode, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: <Store className="w-6 h-6 text-brand-primary" />,
      title: 'Set Up Your Business Profile',
      description:
        'Enter your business details, category, and paste your official Google Business review link. Setup takes less than 2 minutes with email OTP verification.',
    },
    {
      step: '02',
      icon: <QrCode className="w-6 h-6 text-brand-primary" />,
      title: 'Generate & Place QR Codes',
      description:
        'Customize campaigns for different tables, counters, or receipts. Download in crisp vector formats (PNG, SVG, PDF) and print on physical collateral.',
    },
    {
      step: '03',
      icon: <ThumbsUp className="w-6 h-6 text-brand-primary" />,
      title: 'Collect Feedback & Guide Reviews',
      description:
        'Customers scan your code to rate their experience. Happy patrons are guided to your Google review link with one tap, while private feedback alerts your team.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-brand-background border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Simple 3-Step Process
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-brand-text-primary">
            How ReviewFlow Works
          </p>
          <p className="text-sm text-brand-text-secondary leading-relaxed">
            From setup to your first customer scan in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <Card key={s.step} className="p-6 bg-brand-surface border-brand-border shadow-card relative overflow-hidden">
              <span className="absolute top-4 right-4 text-3xl font-black text-slate-100 select-none">
                {s.step}
              </span>
              <CardContent className="p-0 space-y-4 pt-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  {s.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-brand-text-primary">
                    {idx + 1}. {s.title}
                  </h3>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
