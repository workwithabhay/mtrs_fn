import {
  QrCode,
  Smartphone,
  MessageSquareLock,
  ExternalLink,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Features() {
  const featureList = [
    {
      icon: <QrCode className="w-5 h-5 text-brand-primary" />,
      title: 'Dynamic QR Campaigns',
      description:
        'Create customized QR codes for tables, counters, or receipts. Export in high-resolution PNG, SVG, or vector PDF formats ready for professional printing.',
      badge: 'Core Feature',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-brand-info" />,
      title: 'Mobile-First Feedback Flow',
      description:
        'Customers scan with their phone camera and immediately see a lightweight, branded feedback page. No login, no app downloads, and zero friction.',
      badge: 'Instant Access',
    },
    {
      icon: <ExternalLink className="w-5 h-5 text-brand-success" />,
      title: 'Direct Google Review Access',
      description:
        'Help happy patrons reach your official Google business review link with a single tap. Strictly non-gated to protect your reputation and adhere to review guidelines.',
      badge: 'Policy Compliant',
    },
    {
      icon: <MessageSquareLock className="w-5 h-5 text-brand-warning" />,
      title: 'Private Owner Feedback Channel',
      description:
        'Give customers a safe, direct line to communicate criticism, food quality issues, or service bottlenecks directly to your management team.',
      badge: 'Service Recovery',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
      title: 'AI-Assisted Feedback Polish',
      description:
        'Built-in AI assistance helps customers and owners improve phrasing and clarity while preserving the original author’s genuine meaning and sentiment.',
      badge: 'AI Powered',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-slate-700" />,
      title: 'Owner Dashboard & Trends',
      description:
        'Inspect daily scan volumes, average customer satisfaction, rating distributions, and historical timeline trends in a clean, tenant-isolated dashboard.',
      badge: 'Real-Time Data',
    },
  ];

  return (
    <section id="features" className="py-24 bg-brand-surface border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="default" size="md">
            Product Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text-primary">
            Everything You Need to Collect Feedback & Grow 5-Star Reviews
          </h2>
          <p className="text-base text-brand-text-secondary leading-relaxed">
            Engineered specifically for hospitality, retail, healthcare, and service businesses that want transparent feedback without policy-violating review gating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f) => (
            <Card
              key={f.title}
              className="p-6 bg-brand-surface border-brand-border shadow-card hover:border-indigo-200 hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-brand-border flex items-center justify-center">
                    {f.icon}
                  </div>
                  <Badge variant="secondary" size="sm">
                    {f.badge}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-brand-text-primary">{f.title}</h3>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
