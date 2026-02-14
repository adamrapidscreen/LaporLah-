'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Camera,
  BarChart3,
  ShieldCheck,
  Trophy,
  Radio,
  Smartphone,
  ArrowRight,
  ChevronDown,
  Globe,
  Star,
} from 'lucide-react';

import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { LANG, type Lang } from '@/lib/constants/landing-i18n';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en');
  const t = LANG[lang];

  const toggleLang = () => setLang(lang === 'en' ? 'bm' : 'en');

  // Stats count-up animation
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statCounts, setStatCounts] = useState({ reports: 0, resolved: 0, citizens: 0, areas: 0 });

  useEffect(() => {
    if (!statsRef.current) return;

    const targets = { reports: 247, resolved: 89, citizens: 156, areas: 12 };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          const duration = 1500;
          const steps = 60;
          const interval = duration / steps;

          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setStatCounts({
              reports: Math.floor(targets.reports * easeOut),
              resolved: Math.floor(targets.resolved * easeOut),
              citizens: Math.floor(targets.citizens * easeOut),
              areas: Math.floor(targets.areas * easeOut),
            });

            if (step >= steps) {
              clearInterval(timer);
              setStatCounts(targets);
            }
          }, interval);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsAnimated]);

  const features = [
    { icon: Camera, title: t.feature_1_title, desc: t.feature_1_desc },
    { icon: BarChart3, title: t.feature_2_title, desc: t.feature_2_desc },
    { icon: ShieldCheck, title: t.feature_3_title, desc: t.feature_3_desc },
    { icon: Trophy, title: t.feature_4_title, desc: t.feature_4_desc },
    { icon: Radio, title: t.feature_5_title, desc: t.feature_5_desc },
    { icon: Smartphone, title: t.feature_6_title, desc: t.feature_6_desc },
  ];

  const steps = [
    { title: t.how_step_1_title, desc: t.how_step_1_desc },
    { title: t.how_step_2_title, desc: t.how_step_2_desc },
    { title: t.how_step_3_title, desc: t.how_step_3_desc },
    { title: t.how_step_4_title, desc: t.how_step_4_desc },
  ];

  const testimonials = [
    { quote: t.proof_quote_1, author: t.proof_author_1 },
    { quote: t.proof_quote_2, author: t.proof_author_2 },
    { quote: t.proof_quote_3, author: t.proof_author_3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== SECTION 1: Floating Nav Bar ===== */}
      <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo href="/" size="md" />

          {/* Nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {t.nav_features}
            </a>
            <a
              href="#how"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {t.nav_how}
            </a>
            <a
              href="#community"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {t.nav_community}
            </a>
          </div>

          {/* Theme toggle + Language toggle + CTA */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition"
            >
              <Globe className="w-3 h-3" />
              <span className={cn(lang === 'en' ? 'text-primary' : 'text-muted-foreground')}>
                EN
              </span>
              <span className="text-border">|</span>
              <span className={cn(lang === 'bm' ? 'text-primary' : 'text-muted-foreground')}>
                BM
              </span>
            </button>
            <Button asChild size="sm">
              <Link href="/login">{t.nav_cta}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ===== SECTION 2: Hero Section ===== */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
  
  {/* Background image */}
  <Image
    src="/images/hero-bg.png"
    alt="Malaysian road with infrastructure issues"
    fill
    priority
    quality={85}
    className="object-cover object-center"
    sizes="100vw"
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIBAAAgEEAgMAAAAAAAAAAAAAAQIAAwQRMQUSIUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQADAQEAAAAAAAAAAAAAAAAAAQIhA//aAAwDAQACEQMRAD8Aw62tXuGKopJHuWLfiq1NQ1Mhh9jUIitYdHTP/9k="
  />

  {/* Dark overlay for text readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background z-40" />

  {/* All hero content - centered and stacked */}
  <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-4xl mx-auto flex-1">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
          {t.hero_badge}
        </div>

        {/* Title lines */}
        <h1 className="space-y-2 text-center">
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground animate-fade-in-up">
            {t.hero_title_1}
          </div>
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-primary animate-fade-in-up animate-delay-150">
            {t.hero_title_2}
          </div>
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground animate-fade-in-up animate-delay-300">
            {t.hero_title_3}
          </div>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mt-6 leading-relaxed animate-fade-in-up animate-delay-450">
          {t.hero_subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-medium">
            <Link href="/login">
              {t.hero_cta_primary}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full border border-border px-8 py-6 text-lg"
          >
            <a href="#how">{t.hero_cta_secondary}</a>
          </Button>
        </div>

        {/* Live pulse */}
        <div className="mt-8 flex items-center gap-2 justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-sm text-muted-foreground">
            47 {t.hero_live_badge}
          </span>
        </div>
      </div>

      {/* Scroll indicator - fixed at bottom of hero section */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
      </section>

      {/* ===== SECTION 3: Social Proof Stats Bar ===== */}
      <section
        ref={statsRef}
        className="border-y border-border bg-card/50 py-12"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
              {statCounts.reports}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{t.stats_reports}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
              {statCounts.resolved}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{t.stats_resolved}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
              {statCounts.citizens}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{t.stats_citizens}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
              {statCounts.areas}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{t.stats_areas}</div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: Features Grid ===== */}
      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-center">{t.features_title}</h2>
          <p className="text-lg text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
            {t.features_subtitle}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: How It Works ===== */}
      <section id="how" className="py-20 sm:py-28 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">{t.how_title}</h2>
          <p className="text-lg text-muted-foreground text-center mt-4">{t.how_subtitle}</p>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shrink-0">
                    {index + 1}
                  </div>
                  {/* Connecting line - desktop only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-12 w-full h-0 border-t-2 border-dashed border-primary/30 -z-10" />
                  )}
                  <div className="flex-1 lg:mt-4">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: Testimonials / Social Proof ===== */}
      <section id="community" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">{t.proof_title}</h2>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((testimonial, index) => {
              const [name, location] = testimonial.author.split(', ');
              return (
                <div key={index} className="bg-card border border-border rounded-2xl p-6">
                  {/* Stars */}
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative">
                    <span className="absolute -top-2 -left-1 text-4xl text-primary/20 leading-none">
                      &ldquo;
                    </span>
                    <p className="text-sm text-foreground leading-relaxed italic pl-4">
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{location}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: Final CTA ===== */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 px-6 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold">{t.cta_title}</h2>
          <p className="text-lg text-muted-foreground mt-4">{t.cta_subtitle}</p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full px-10 py-6 text-lg font-medium"
          >
            <Link href="/login">
              {t.cta_button}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">{t.cta_pwa}</p>
        </div>
      </section>

      {/* ===== SECTION 8: Footer ===== */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <Logo href="/" size="sm" />
            <div className="text-sm text-muted-foreground italic mt-1">{t.footer_tagline}</div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="text-xs text-muted-foreground">{t.footer_built}</div>
            <div className="text-xs text-muted-foreground">{t.footer_copy}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
