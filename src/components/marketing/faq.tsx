'use client';

import * as React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: 'How do customers access the feedback form?',
      a: 'Customers simply point their smartphone camera at your printed QR code (on a table tent, receipt, or door sticker). The camera opens your branded, mobile-optimized feedback page instantly in their browser.',
    },
    {
      q: 'Do customers need to download an app or sign in?',
      a: 'No app download or account creation is required for customers. The entire feedback flow runs in modern mobile web browsers with zero friction, allowing customers to complete feedback in under 30 seconds.',
    },
    {
      q: 'Can customers leave private feedback for management?',
      a: 'Yes. Customers can submit constructive criticism, private comments, and contact details directly to your owner dashboard. Negative feedback routes privately to your inbox so you can resolve issues before they escalate.',
    },
    {
      q: 'Does ReviewFlow publish reviews to Google automatically on behalf of customers?',
      a: 'No. In strict adherence to Google’s terms of service, only the customer can publish a review under their personal Google account. ReviewFlow guides satisfied customers to your official Google review link with a single tap, making the review process as seamless as possible.',
    },
    {
      q: 'Can I customize my QR campaigns with our business branding?',
      a: 'Yes. You can customize the campaign title, upload your business logo, choose custom brand colors, and export in crisp high-resolution PNG, SVG, or vector PDF formats ready for professional commercial printers.',
    },
    {
      q: 'Are online subscription payments active right now?',
      a: 'The subscription models and plan foundation are fully established in the platform architecture. Self-serve online payment processing with live gateways will be activated in an upcoming release.',
    },
  ];

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-brand-background border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-brand-text-secondary border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text-primary">
            Clear Answers to Common Questions
          </h2>
          <p className="text-sm text-brand-text-secondary leading-relaxed max-w-xl mx-auto">
            Everything you need to know about QR campaigns, review policies, and customer privacy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-content-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <Card
                key={faq.q}
                className={cn(
                  'border transition-colors duration-200 overflow-hidden',
                  isOpen ? 'border-indigo-200 shadow-subtle' : 'border-brand-border',
                )}
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus-ring rounded-2xl bg-brand-surface hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-brand-text-primary">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-brand-text-secondary shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-brand-primary',
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-text-secondary leading-relaxed border-t border-brand-border/60 bg-brand-surface animate-in fade-in-0 duration-150"
                  >
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
