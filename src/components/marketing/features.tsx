import {
  QrCode,
  Smartphone,
  ExternalLink,
  MessageSquareLock,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BorderGlow from './BorderGlow';

export function Features() {
  const featureList = [
    {
      icon: <QrCode className="w-5 h-5 text-indigo-600" />,
      title: 'Dynamic QR Campaigns',
      description:
        'Create customized QR codes for tables, counters, or receipts. Export in high-resolution PNG, SVG, or vector PDF formats ready for professional printing.',

      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      iconBg: 'bg-indigo-50/90 text-indigo-600 border-indigo-100',
      glowColors: ['#6366f1', '#a855f7', '#38bdf8'],
    },
    {
      icon: <Smartphone className="w-5 h-5 text-sky-600" />,
      title: 'Mobile-First Feedback Flow',
      description:
        'Customers scan with their phone camera and immediately see a lightweight, branded feedback page. No login, no app downloads, and zero friction.',
  
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/80',
      iconBg: 'bg-sky-50/90 text-sky-600 border-sky-100',
      glowColors: ['#0284c7', '#38bdf8', '#818cf8'],
    },
    {
      icon: <ExternalLink className="w-5 h-5 text-emerald-600" />,
      title: 'Direct Google Review Access',
      description:
        'Help happy patrons reach your official Google business review link with a single tap. Strictly non-gated to protect your reputation and adhere to review guidelines.',
     
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-emerald-50/90 text-emerald-600 border-emerald-100',
      glowColors: ['#059669', '#10b981', '#34d399'],
    },
    {
      icon: <MessageSquareLock className="w-5 h-5 text-amber-600" />,
      title: 'Private Owner Feedback Channel',
      description:
        'Give customers a safe, direct line to communicate criticism, food quality issues, or service bottlenecks directly to your management team.',
  
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
      iconBg: 'bg-amber-50/90 text-amber-600 border-amber-100',
      glowColors: ['#d97706', '#f59e0b', '#fbbf24'],
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      title: 'AI-Assisted Feedback Polish',
      description:
        'Built-in AI assistance helps customers and owners improve phrasing and clarity while preserving the original author’s genuine meaning and sentiment.',
    
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80',
      iconBg: 'bg-purple-50/90 text-purple-600 border-purple-100',
      glowColors: ['#9333ea', '#c084fc', '#f472b6'],
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-rose-600" />,
      title: 'Owner Dashboard & Trends',
      description:
        'Inspect daily scan volumes, average customer satisfaction, rating distributions, and historical timeline trends in a clean, tenant-isolated dashboard.',
    
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
      iconBg: 'bg-rose-50/90 text-rose-600 border-rose-100',
      glowColors: ['#e11d48', '#f43f5e', '#fb7185'],
    },
  ];

  return (
    <section
      id="features"
      className="relative py-24 bg-[#FAF9F6] text-slate-900 border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle ambient light glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 50% 15%, rgba(99, 102, 241, 0.08), transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge
            variant="secondary"
            size="md"
            className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs"
          >
            Product Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Everything You Need to Collect Feedback & Grow 5-Star Reviews
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Engineered specifically for hospitality, retail, healthcare, and service businesses that want transparent feedback without policy-violating review gating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f) => (
            <BorderGlow
              key={f.title}
              edgeSensitivity={30}
              glowColor="240 80 60"
              backgroundColor="#FFFFFF"
              borderRadius={28}
              glowRadius={35}
              glowIntensity={0.8}
              coneSpread={30}
              animated={false}
              colors={f.glowColors || ['#6366f1', '#a855f7', '#38bdf8']}
              className="h-full border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-7 flex flex-col justify-between h-full space-y-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${f.iconBg}`}
                  >
                    {f.icon}
                  </div>
               
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
