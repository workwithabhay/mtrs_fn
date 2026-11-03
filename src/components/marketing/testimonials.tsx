'use client';

import * as React from 'react';
import { Star, ShieldCheck, Sparkles, Quote, X, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface TestimonialItem {
  id: string;
  company: string;
  name?: string;
  role?: string;
  category: string;
  avatarUrl?: string;
  avatarPlaceholderColor?: string;
  rating: number;
  quote: string;
  metrics?: string;
}

export type RowItem =
  | { type: 'chip'; data: TestimonialItem }
  | { type: 'accent'; label: string; bg?: string };

// Row 1 Testimonials Data (Moving Left Side)
const ROW_1: RowItem[] = [
  {
    type: 'chip',
    data: {
      id: 't-1',
      company: 'Champaran Fish & Mutton',
      category: 'Dining & Restaurant',
      avatarUrl:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-amber-100 text-amber-800',
      rating: 5,
      quote:
        'Our Google rating surged from 4.2 to 4.9 within 60 days. Foodies love scanning the acrylic table tents while enjoying their meal—zero app downloads meant an 85% completion rate.',
      metrics: '+142 Google Reviews',
    },
  },
  {
    type: 'chip',
    data: {
      id: 't-2',
      company: 'Pixelbloommedia',
      category: 'Media & Marketing Agency',
      avatarUrl:
        'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-purple-100 text-purple-800',
      rating: 5,
      quote:
        'We implement ReviewFlow across all our client retail and hospitality campaigns. The QR export resolution is pristine and the non-gated direct Google link protects client reputation flawlessly.',
      metrics: '3x Review Velocity',
    },
  },
  { type: 'accent', label: '5.0 ★', bg: 'bg-indigo-600 text-white' },
  {
    type: 'chip',
    data: {
      id: 't-3',
      company: 'Tycum Solar',
      category: 'Clean Energy & Solar',
      avatarUrl:
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-sky-100 text-sky-800',
      rating: 5,
      quote:
        'Solar installation is built on trust and homeowner recommendations. ReviewFlow cards handed over after commissioning helped us gather verified 5-star Google ratings on autopilot.',
      metrics: '4.9 ★ Rating Maintained',
    },
  },
  {
    type: 'chip',
    data: {
      id: 't-4',
      company: 'DMS Solar',
      category: 'Commercial & Rooftop Solar',
      avatarUrl:
        'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-emerald-100 text-emerald-800',
      rating: 5,
      quote:
        'Our field technicians leave branded QR review cards with warranties after rooftop installations. The private feedback channel lets us resolve client service questions immediately.',
      metrics: '+96 Verified Reviews',
    },
  },
  { type: 'accent', label: 'GOOGLE', bg: 'bg-blue-600 text-white' },
  {
    type: 'chip',
    data: {
      id: 't-5',
      company: 'Ventex Inn',
      category: 'Hospitality & Suites',
      avatarUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-rose-100 text-rose-800',
      rating: 5,
      quote:
        'Multi-campaign support lets us track reviews by reception desk, dining hall, and suite keycards separately. Our TripAdvisor and Google presence has never been stronger.',
      metrics: 'Top Rated Inn Index',
    },
  },
  {
    type: 'chip',
    data: {
      id: 't-6',
      company: 'Champaran Fish & Mutton',
      category: 'Dining & Restaurant',
      avatarUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-orange-100 text-orange-800',
      rating: 5,
      quote:
        'Private feedback helped our kitchen identify service bottlenecks during weekend rushes before anyone posted criticism online. It protects our restaurant brand daily.',
      metrics: '4.9 Rating Maintained',
    },
  },
  { type: 'accent', label: 'VERIFIED', bg: 'bg-emerald-600 text-white' },
  {
    type: 'chip',
    data: {
      id: 't-7',
      company: 'Pixelbloommedia',
      category: 'Digital Strategy',
      avatarUrl:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-indigo-100 text-indigo-800',
      rating: 5,
      quote:
        'The dual-routing concept is genius: satisfied diners tap directly to Google, while anyone with questions reaches our client managers directly.',
      metrics: '99% Client Satisfaction',
    },
  },
];

// Row 2 Testimonials Data (Moving Right Side)
const ROW_2: RowItem[] = [
  {
    type: 'chip',
    data: {
      id: 't-8',
      company: 'Tycum Solar',
      category: 'Residential Solar',
      avatarUrl:
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-blue-100 text-blue-800',
      rating: 5,
      quote:
        'Our rooftop installers hand homeowners a branded QR card during the system handover. It doubled our referral inquiries in just one quarter.',
      metrics: 'Leader in Solar Reviews',
    },
  },
  { type: 'accent', label: 'TOP RATED', bg: 'bg-purple-600 text-white' },
  {
    type: 'chip',
    data: {
      id: 't-9',
      company: 'DMS Solar',
      category: 'Solar Power Systems',
      avatarUrl:
        'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-teal-100 text-teal-800',
      rating: 5,
      quote:
        'Commercial solar buyers check Google reviews before signing high-value contracts. ReviewFlow helped us showcase genuine engineering craftsmanship with complete transparency.',
      metrics: '+84 Google Reviews',
    },
  },
  {
    type: 'chip',
    data: {
      id: 't-10',
      company: 'Ventex Inn',
      category: 'Hotels & Resorts',
      avatarUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-pink-100 text-pink-800',
      rating: 5,
      quote:
        'The mobile feedback experience is blazing fast. Guests tap through rating stars on their phone at checkout in under 15 seconds with zero app installs.',
      metrics: '+110 Reviews',
    },
  },
  { type: 'accent', label: '4.9 ★', bg: 'bg-amber-500 text-white' },
  {
    type: 'chip',
    data: {
      id: 't-11',
      company: 'Champaran Fish & Mutton',
      category: 'Hospitality',
      avatarUrl:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-red-100 text-red-800',
      rating: 5,
      quote:
        'When wait times get busy during dinner service, having private direct feedback allows us to address guest feedback promptly before they leave.',
      metrics: 'Zero Review Gating',
    },
  },
  {
    type: 'chip',
    data: {
      id: 't-12',
      company: 'Pixelbloommedia',
      category: 'Media Production',
      avatarUrl:
        'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-violet-100 text-violet-800',
      rating: 5,
      quote:
        'The AI polish suggestion tool helps customers articulate their thoughts clearly while preserving genuine sentiment. Our clients are thrilled with the review quality.',
      metrics: 'Organic Reach +45%',
    },
  },
  { type: 'accent', label: 'JOIN 500+', bg: 'bg-indigo-600 text-white' },
  {
    type: 'chip',
    data: {
      id: 't-13',
      company: 'Tycum Solar',
      category: 'Green Energy',
      avatarUrl:
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-cyan-100 text-cyan-800',
      rating: 5,
      quote:
        'Setting up our QR review campaigns took under 5 minutes. The aesthetic fits our clean energy brand and looks premium and bespoke.',
      metrics: '100% Policy Compliant',
    },
  },
  {
    type: 'chip',
    data: {
      id: 't-14',
      company: 'DMS Solar',
      category: 'Energy Solutions',
      avatarUrl:
        'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-yellow-100 text-yellow-800',
      rating: 5,
      quote:
        'Direct non-gated review links strictly adhere to Google policies while giving our happy customers the easiest way to leave 5-star praise.',
      metrics: 'Top Regional Installer',
    },
  },
  {
    type: 'chip',
    data: {
      id: 't-15',
      company: 'Ventex Inn',
      category: 'Guest Experience',
      avatarUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=160&h=160&q=80',
      avatarPlaceholderColor: 'bg-emerald-100 text-emerald-800',
      rating: 5,
      quote:
        'Guests love scanning the QR display at check-out. ReviewFlow is the cleanest, highest-ROI hospitality tool we have ever used.',
      metrics: '5.0 ★ Guest Score',
    },
  },
];

export function Testimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<TestimonialItem | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Scroll reveal IntersectionObserver with reduced motion fallback
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Helper for rendering a business logo/photo or initials
  const renderAvatar = (item: TestimonialItem) => {
    const initials = item.company
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');

    return (
      <div
        className={cn(
          'w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 border border-white shadow-2xs relative flex items-center justify-center font-bold text-xs select-none',
          item.avatarPlaceholderColor || 'bg-indigo-100 text-indigo-700'
        )}
      >
        {item.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.avatarUrl}
            alt={item.company}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  };

  const renderRow = (items: RowItem[], trackClass: string) => {
    // Duplicate array to achieve a seamless, continuous infinite loop marquee
    const repeated = [...items, ...items];

    return (
      <div className="relative overflow-hidden w-full py-2">
        <div className={cn(trackClass, 'gap-3.5 sm:gap-4.5 items-center')}>
          {repeated.map((item, index) => {
            if (item.type === 'accent') {
              return (
                <div
                  key={`accent-${index}-${item.label}`}
                  className={cn(
                    'w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 flex items-center justify-center font-extrabold text-[10px] sm:text-xs tracking-wider uppercase shadow-xs transition-transform duration-200 hover:scale-110 cursor-default select-none ring-2 ring-white',
                    item.bg || 'bg-indigo-600 text-white'
                  )}
                >
                  <span>{item.label}</span>
                </div>
              );
            }

            const { data } = item;
            return (
              <button
                type="button"
                key={`chip-${index}-${data.id}`}
                onClick={() => setSelectedTestimonial(data)}
                className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 hover:bg-white border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-card hover:border-indigo-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200 select-none cursor-pointer group/chip shrink-0 text-left focus-ring"
                aria-label={`View testimonial from ${data.company}`}
              >
                {renderAvatar(data)}

                <span className="font-semibold text-xs sm:text-sm text-brand-text-primary group-hover/chip:text-indigo-950 transition-colors whitespace-nowrap pr-1">
                  {data.company}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-24 bg-brand-surface border-b border-brand-border relative overflow-hidden select-none"
    >
      {/* Self-contained CSS animations for smooth marquee movement */}
      <style>{`
        @keyframes marquee-scroll-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes marquee-scroll-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .testimonials-moving-left {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marquee-scroll-left 32s linear infinite;
        }

        .testimonials-moving-right {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marquee-scroll-right 32s linear infinite;
        }

        .testimonials-moving-left:hover,
        .testimonials-moving-right:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonials-moving-left,
          .testimonials-moving-right {
            animation: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with smooth scroll reveal */}
        <div
          className={cn(
            'text-center max-w-3xl mx-auto space-y-4 transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <Badge variant="default" size="md" className="gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Customer Testimonials</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-text-primary">
            Loved by 500+ Growing Businesses
          </h2>
          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed max-w-2xl mx-auto">
            From neighborhood coffee roasters to boutique dental clinics, discover how local businesses capture authentic feedback and multiply 5-star Google reviews.
          </p>
        </div>

        {/* Sliding Chips Cluster: Exactly 2 Rows (One Moving Left, One Moving Right) with Smooth Fog Dissolve */}
        <div
          className={cn(
            'relative w-full space-y-4 transition-all duration-700 delay-150 ease-out',
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.98]'
          )}
        >
          {/* Smooth Left Fog Mist Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-28 sm:w-56 bg-gradient-to-r from-brand-surface via-brand-surface/90 to-transparent z-10"
          />

          {/* Smooth Right Fog Mist Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-28 sm:w-56 bg-gradient-to-l from-brand-surface via-brand-surface/90 to-transparent z-10"
          />

          {/* Row 1: Moving to the Left Side */}
          {renderRow(ROW_1, 'testimonials-moving-left')}

          {/* Row 2: Moving to the Right Side */}
          {renderRow(ROW_2, 'testimonials-moving-right')}
        </div>

       
      </div>

      {/* Interactive Testimonial Detail Modal for Smooth UX */}
      {selectedTestimonial && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 border border-slate-200 shadow-modal space-y-5 animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {renderAvatar(selectedTestimonial)}
                <div>
                  <h3 id="testimonial-modal-title" className="font-bold text-base text-brand-text-primary">
                    {selectedTestimonial.company}
                  </h3>
                  <p className="text-xs text-brand-text-secondary">
                    {selectedTestimonial.category}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTestimonial(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-ring"
                aria-label="Close testimonial details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stars & Category Tag */}
            <div className="flex items-center justify-between border-y border-slate-100 py-2.5">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(selectedTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-700 ml-1.5">5.0 Star Verified Review</span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span>{selectedTestimonial.category}</span>
              </div>
            </div>

            {/* Quote Body */}
            <div className="relative text-sm text-slate-700 leading-relaxed italic bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              <Quote className="w-5 h-5 text-indigo-400/40 mb-1" />
              <p className="relative z-10">&ldquo;{selectedTestimonial.quote}&rdquo;</p>
            </div>

            {/* Metric Callout */}
            {selectedTestimonial.metrics && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-brand-text-secondary">Measured Business Impact:</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {selectedTestimonial.metrics}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Testimonials;
