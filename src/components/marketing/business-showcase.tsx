'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Utensils,
  Coffee,
  Sparkles,
  ShoppingBag,
  Stethoscope,
  Dumbbell,
  Hotel,
  ArrowRight,
  CheckCircle2,
  X,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BusinessCategory {
  id: string;
  name: string;
  shortTag: string;
  badge: string;
  tagline: string;
  description: string;
  imageUrl: string;
  fallbackGradient: string;
  icon: React.ReactNode;
  qrPlacement: string;
  benefit: string;
}

const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'restro',
    name: 'Restaurants & Bistros',
    shortTag: 'Restro',
    badge: 'Dining & Bars',
    tagline: 'Turn dining guests into 5-star Google promoters',
    description:
      'Place durable acrylic QR table tents at dining tables and bar counters. Guests scan while waiting for dessert, routing happy diners directly to Google with zero review gating.',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-amber-800 via-orange-900 to-amber-950',
    icon: <Utensils className="w-4 h-4 text-amber-300" />,
    qrPlacement: 'Table tents, bill folders & bar coasters',
    benefit: '+140% Verified Google Reviews in 60 days',
  },
  {
    id: 'cafe',
    name: 'Cafes & Bakeries',
    shortTag: 'Cafe',
    badge: 'Roasteries & Bakeries',
    tagline: 'Instant counter review routing with zero friction',
    description:
      'Print high-res QR stickers on coffee sleeves, counter stands, and pastry takeout boxes. Zero app downloads—patrons complete feedback in under 20 seconds.',
    imageUrl:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-stone-700 via-amber-900 to-stone-900',
    icon: <Coffee className="w-4 h-4 text-amber-200" />,
    qrPlacement: 'Cup sleeves, counter stands & takeout boxes',
    benefit: '4.9 ★ Rating with 3x review velocity',
  },
  {
    id: 'salon',
    name: 'Beauty Salons & Spas',
    shortTag: 'Beauty Salon',
    badge: 'Salons & Wellness',
    tagline: 'Capture praise when clients feel their absolute best',
    description:
      'Discreet styling mirror stickers and reception QR stands let clients review their stylists, massage therapists, or nail artists right after their session.',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-rose-700 via-pink-800 to-rose-950',
    icon: <Sparkles className="w-4 h-4 text-pink-300" />,
    qrPlacement: 'Styling station mirrors & checkout desk',
    benefit: '99% Client Satisfaction & high re-booking',
  },
  {
    id: 'mart',
    name: 'Marts & Retail Shops',
    shortTag: 'Mart & Retail',
    badge: 'Retail & Supermarts',
    tagline: 'Transform everyday receipts into local foot traffic drivers',
    description:
      'Export vector PDF barcodes for thermal receipt rolls or shelf markers. Shoppers scan at checkout, driving local neighborhood discovery on Google Maps.',
    imageUrl:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-emerald-700 via-teal-800 to-emerald-950',
    icon: <ShoppingBag className="w-4 h-4 text-emerald-300" />,
    qrPlacement: 'Checkout receipts, counter mats & exit doors',
    benefit: '+220% Organic local map searches',
  },
  {
    id: 'clinic',
    name: 'Clinics & Healthcare',
    shortTag: 'Clinics',
    badge: 'Dental & Medical',
    tagline: 'Private feedback first to protect healthcare trust',
    description:
      'Strictly compliant with medical privacy standards. Patients provide direct private feedback to practice managers, keeping patient care concerns handled professionally.',
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-sky-700 via-blue-800 to-indigo-950',
    icon: <Stethoscope className="w-4 h-4 text-sky-300" />,
    qrPlacement: 'Discharge folders, waiting room stands & cards',
    benefit: 'Zero policy infractions & verified patient trust',
  },
  {
    id: 'fitness',
    name: 'Fitness & Gym Studios',
    shortTag: 'Fitness Club',
    badge: 'Gyms & Studios',
    tagline: 'Empower member loyalty and community feedback',
    description:
      'Locker room and equipment QR stickers invite members to leave suggestions for workout gear and praise their personal trainers with one simple tap.',
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-purple-700 via-violet-800 to-purple-950',
    icon: <Dumbbell className="w-4 h-4 text-purple-300" />,
    qrPlacement: 'Locker mirrors, smoothie bar & key fobs',
    benefit: 'Top ranked local fitness studio on Google',
  },
  {
    id: 'hotel',
    name: 'Hotels & Boutique Stays',
    shortTag: 'Hotels & Stays',
    badge: 'Hotels & Hospitality',
    tagline: 'Multi-touchpoint reviews by room and concierge',
    description:
      'Separate campaign tracking for reception, poolside, dining rooms, and guest suites. Protect your hotel star rating with tenant-isolated analytics.',
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    fallbackGradient: 'from-indigo-700 via-slate-800 to-indigo-950',
    icon: <Hotel className="w-4 h-4 text-indigo-300" />,
    qrPlacement: 'Keycard sleeves, nightstands & concierge desk',
    benefit: 'Leader in city traveler satisfaction index',
  },
];

export function BusinessShowcase() {
  const [selectedCategory, setSelectedCategory] =
    React.useState<BusinessCategory | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  // Scroll reveal with reduced motion fallback
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Triple array for smooth continuous infinite loop
  const marqueeItems = [
    ...BUSINESS_CATEGORIES,
    ...BUSINESS_CATEGORIES,
    ...BUSINESS_CATEGORIES,
  ];

  return (
    <section
      id="industries"
      ref={sectionRef}
      className="py-24 bg-[#FAF8F5] border-b border-brand-border/70 relative overflow-hidden select-none"
    >
      {/* Smooth Horizontal Marquee Animation Styles */}
      <style>{`
        @keyframes ribbon-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }

        .marquee-viewport {
          overflow: hidden;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          position: relative;
          -webkit-mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.05) 2%,
            rgba(0, 0, 0, 0.25) 5%,
            rgba(0, 0, 0, 0.65) 9%,
            rgba(0, 0, 0, 0.95) 14%,
            rgba(0, 0, 0, 1) 18%,
            rgba(0, 0, 0, 1) 82%,
            rgba(0, 0, 0, 0.95) 86%,
            rgba(0, 0, 0, 0.65) 91%,
            rgba(0, 0, 0, 0.25) 95%,
            rgba(0, 0, 0, 0.05) 98%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.05) 2%,
            rgba(0, 0, 0, 0.25) 5%,
            rgba(0, 0, 0, 0.65) 9%,
            rgba(0, 0, 0, 0.95) 14%,
            rgba(0, 0, 0, 1) 18%,
            rgba(0, 0, 0, 1) 82%,
            rgba(0, 0, 0, 0.95) 86%,
            rgba(0, 0, 0, 0.65) 91%,
            rgba(0, 0, 0, 0.25) 95%,
            rgba(0, 0, 0, 0.05) 98%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ribbon-marquee 40s linear infinite;
        }

        .marquee-track.is-paused {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle warm ambient radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 50% 15%, rgba(245, 158, 11, 0.07), transparent 75%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header Block with Playful Hand-Drawn Doodle Annotations */}
        <div
          className={cn(
            'text-center max-w-3xl mx-auto space-y-4 relative transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F5E6D3] text-[#784315] shadow-2xs hover:scale-105 transition-transform duration-200">
            <span>Loved by 10,000+ local businesses</span>
          </div>

          {/* Authentic Hand-Drawn Doodle Accent Marks on left */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute left-2 lg:left-6 top-12 text-slate-800 select-none pointer-events-none"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-slate-800 opacity-80"
            >
              <path
                d="M4 20L11 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M13 20L20 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text-primary leading-[1.12]">
            Made for Every Business to Win 5-Star Reviews
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Whether you run a bustling restaurant, artisan cafe, beauty salon, or neighborhood mart — ReviewFlow effortlessly turns everyday in-person customer visits into verified Google reviews.
          </p>

          {/* Hand-Drawn Arrow SVG: "Skyrocket your reviews" */}
          <div
            aria-hidden="true"
            className="hidden md:flex flex-col items-center absolute -top-5 right-2 lg:right-8 text-slate-800 select-none pointer-events-none rotate-3"
          >
            <span className="font-handwritten text-2xl sm:text-3xl font-bold tracking-wide text-slate-800">
              Skyrocket your reviews
            </span>
            <svg
              width="64"
              height="44"
              viewBox="0 0 64 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-slate-800 stroke-current -mt-1 ml-5"
            >
              <path
                d="M 6 6 C 26 2, 52 8, 52 32"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 40 26 L 52 32 L 55 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Normal Sliding Cards Marquee */}
        <div
          className={cn(
            'marquee-viewport relative w-full py-4 transition-all duration-700 delay-150 ease-out',
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          )}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Normal Sliding Cards Track */}
          <div
            className={cn(
              'marquee-track gap-4 sm:gap-5 items-center py-4',
              isPaused && 'is-paused'
            )}
          >
            {marqueeItems.map((cat, index) => {
              return (
                <div
                  key={`marquee-card-${cat.id}-${index}`}
                  onClick={() => setSelectedCategory(cat)}
                  className="group relative shrink-0 w-[200px] sm:w-[230px] lg:w-[245px] h-[300px] sm:h-[340px] lg:h-[360px] rounded-[22px] sm:rounded-[26px] overflow-hidden cursor-pointer select-none bg-slate-900 border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCategory(cat);
                    }
                  }}
                  aria-label={`View ${cat.name} details`}
                >
                  {/* Background Fallback Gradient */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-b',
                      cat.fallbackGradient
                    )}
                  />

                  {/* Card Photography Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Soft Dark Vignette Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/30 pointer-events-none" />

                  {/* Top Glass Pill with Category Icon */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-slate-900 shadow-xs border border-white/50">
                      {cat.icon}
                      <span>{cat.shortTag}</span>
                    </span>

                    <span className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-amber-400 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </span>
                  </div>

                  {/* Default Bottom Information */}
                  <div className="absolute bottom-3.5 left-4 right-4 z-10 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
                    <p className="font-extrabold text-base text-white leading-tight drop-shadow-sm">
                      {cat.name}
                    </p>
                    <p className="text-xs text-slate-200 font-medium truncate mt-0.5">
                      {cat.badge}
                    </p>
                  </div>

                  {/* Hover "View Larger" Overlay with Diagonal Expand Icon (Exact Look from Screenshot) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="text-white text-base sm:text-lg font-bold tracking-tight">
                      View larger
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Block with Hand-Drawn "It's free" Doodle and Normal CTA with Icon */}
        <div
          className={cn(
            'flex flex-col items-center justify-center pt-6 space-y-4 transition-all duration-700 delay-300 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {/* Centered CTA with Authentic "It's free" Curved Arrow Doodle (Exact Match to Screenshot) */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Hand-Drawn "It's free" text with curved swooping arrow above it pointing to button */}
            <div
              aria-hidden="true"
              className="flex flex-col items-center select-none pointer-events-none -mr-1"
            >
              <svg
                width="46"
                height="30"
                viewBox="0 0 46 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-800 ml-4 stroke-current"
              >
                {/* Smooth curve dipping down and rising up-right into button */}
                <path
                  d="M 6 6 C 12 24, 26 28, 42 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 31 14 L 42 16 L 36 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-handwritten text-2xl sm:text-3xl font-bold text-slate-800 tracking-wide -rotate-[25deg] -mt-1 select-none">
                It&apos;s free
              </span>
            </div>

            {/* Coral Pill Button with Faint Dashed Stadium Border (Exact Match to Reference) */}
            <div className="p-1 rounded-full border-2 border-dashed border-[#ff5a5f]/60">
              <Button
                size="lg"
                className="px-8 py-3.5 rounded-full text-base font-bold bg-[#ff5a5f] hover:bg-[#e8484d] text-white shadow-md shadow-[#ff5a5f]/25 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 h-auto"
                asChild
              >
                <Link href="/signup">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center font-medium">
            Try 7 days free • No credit card required • Cancel anytime in 1 click
          </p>
        </div>
      </div>

      {/* Interactive Detail Modal for Business Category */}
      {selectedCategory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 border border-slate-200 shadow-modal space-y-5 animate-in zoom-in-95 duration-200 text-left overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header Banner */}
            <div className="relative -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 h-48 overflow-hidden bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCategory.imageUrl}
                alt={selectedCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/25" />

              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors focus-ring"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3.5 left-6 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 shadow-sm">
                  {selectedCategory.icon}
                  <span>{selectedCategory.shortTag}</span>
                </span>
                <span className="text-xs text-white/90 font-medium">
                  {selectedCategory.badge}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div>
                <h3
                  id="category-modal-title"
                  className="font-bold text-xl text-brand-text-primary"
                >
                  {selectedCategory.name}
                </h3>
                <p className="text-xs sm:text-sm text-indigo-700 font-semibold mt-0.5">
                  {selectedCategory.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
                {selectedCategory.description}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-text-primary">
                      Recommended QR Placements:
                    </strong>{' '}
                    {selectedCategory.qrPlacement}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-text-primary">
                      Business Outcome:
                    </strong>{' '}
                    {selectedCategory.benefit}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Action CTA */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                <span>Close</span>
              </Button>

              <Button
                size="sm"
                className="bg-[#ff5a5f] hover:bg-[#e8484d] text-white font-bold rounded-xl"
                asChild
              >
                <Link href="/signup">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default BusinessShowcase;
