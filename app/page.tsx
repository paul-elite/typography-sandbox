'use client';

import { motion } from 'framer-motion';
import {
  ArrowRightUpLine,
  CalendarLine,
  CheckCircleLine,
  ClockLine,
  GlobeLine,
  MapPinLine,
} from '@mingcute/react';

const event = {
  name: 'Borderless',
  venue: 'Landmark Event Center, Lagos',
  date: 'August 21, 2026',
  time: '10:00 AM',
  format: 'One-day experience',
};

const benefits = [
  {
    title: 'Curated, not crowded',
    copy: 'A deliberately filtered room of founders, operators, investors, and ecosystem leaders moving with intent.',
  },
  {
    title: 'Capital meets execution',
    copy: 'Practical access to investors, growth partners, and the operator knowledge needed to scale beyond local markets.',
  },
  {
    title: 'Global lens',
    copy: 'Conversations shaped around cross-border capital, mobility, and the next generation of African category leaders.',
  },
  {
    title: 'High-signal network',
    copy: 'No passive attendance. Borderless is built for introductions, insight, and deals that can keep moving afterward.',
  },
];

const audiences = ['Founders', 'Investors', 'Operators', 'Ecosystem leaders'];

const themes = [
  'Cross-border capital',
  'African startups',
  'Global mobility',
  'Investor access',
  'Scaling beyond local markets',
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

function LogoMark() {
  return (
    <a href="#top" className="group inline-flex items-center gap-2" aria-label="Borderless home">
      <span className="grid size-7 place-items-center rounded-[7px] border-2 border-black bg-white shadow-[3px_3px_0_#19c884]">
        <span className="size-3 rounded-[3px] border-2 border-black" />
      </span>
      <span className="text-[1.55rem] font-black tracking-[-0.04em] text-black">borderless</span>
    </a>
  );
}

function Button({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <a
      href={href}
      className={
        variant === 'primary'
          ? 'inline-flex items-center justify-center gap-2 rounded-full bg-[#18bf7b] px-6 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(24,191,123,0.32)] hover:-translate-y-0.5 hover:bg-[#0fab6b] focus-visible:ring-2 focus-visible:ring-black'
          : 'inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black text-black shadow-[0_12px_28px_rgba(12,18,16,0.08)] hover:-translate-y-0.5 hover:border-black/25 focus-visible:ring-2 focus-visible:ring-black'
      }
    >
      {children}
      {variant === 'primary' ? <ArrowRightUpLine className="size-4" /> : null}
    </a>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
  className = '',
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28 ${className}`}>
      <motion.div {...fadeUp} className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0a9f66]">{eyebrow}</p>
        ) : null}
        <h2 className="max-w-3xl text-4xl font-black tracking-[-0.06em] text-black sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {children}
      </motion.div>
    </section>
  );
}

function HeroTicket() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-[2.25rem] bg-[#0db77a] p-8 text-white shadow-[0_30px_90px_rgba(11,149,99,0.28)] sm:p-10 lg:p-12"
    >
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(#08704c_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="absolute -right-14 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full border border-black/35 sm:block" />
      <div className="absolute -right-7 top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-black/35 sm:block" />
      <div className="absolute right-9 top-1/2 hidden h-20 w-20 -translate-y-1/2 rounded-full border border-black/35 sm:block" />

      <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="mb-8 inline-flex items-center rounded-full bg-black px-4 py-2 text-3xl font-black italic tracking-[-0.06em] text-[#f4ec58] shadow-[6px_6px_0_rgba(0,0,0,0.18)] sm:text-5xl">
            #TBE2026
          </div>
          <p className="max-w-sm text-lg font-bold leading-tight text-white/85">
            Lagos becomes the meeting point for African ambition and global capital.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[
            [CalendarLine, event.date],
            [ClockLine, event.time],
            [MapPinLine, event.venue],
          ].map(([Icon, label]) => {
            const EventIcon = Icon as typeof CalendarLine;
            return (
              <div key={label as string} className="flex items-center gap-3 rounded-2xl bg-white/14 px-4 py-4 backdrop-blur">
                <EventIcon className="size-5 shrink-0" />
                <span className="text-sm font-black">{label as string}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#eff0f2] text-black">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#eff0f2]/82 px-5 py-4 backdrop-blur-xl sm:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6" aria-label="Main navigation">
          <LogoMark />
          <div className="hidden items-center gap-8 text-sm font-bold md:flex">
            <a href="#about" className="hover:text-[#0a9f66]">About</a>
            <a href="#why" className="hover:text-[#0a9f66]">Why attend</a>
            <a href="#details" className="hover:text-[#0a9f66]">Details</a>
            <a href="#themes" className="hover:text-[#0a9f66]">Themes</a>
          </div>
          <a
            href="#register"
            className="rounded-full bg-[#18bf7b] px-5 py-2.5 text-sm font-black text-white shadow-[0_10px_22px_rgba(24,191,123,0.28)] hover:-translate-y-0.5 hover:bg-[#0fab6b]"
          >
            Register Interest
          </a>
        </nav>
      </header>

      <section className="relative px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-28 h-[26rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ffffff_0%,rgba(255,255,255,0.74)_36%,rgba(255,255,255,0)_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-5xl text-center"
        >
          <p className="mb-7 inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0a9f66] shadow-sm">
            Investor-facing summit in Lagos
          </p>
          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.075em] text-black sm:text-7xl lg:text-8xl">
            Where Africa&apos;s smartest founders meet global capital.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base font-bold leading-relaxed text-black/68 sm:text-lg">
            Borderless brings smart founders, operators, and global investors into one high-signal room built for access, capital, and scale.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#register">Register Interest</Button>
            <Button href="#details" variant="secondary">View Details</Button>
          </div>
        </motion.div>
        <HeroTicket />
      </section>

      <Section id="about" eyebrow="About Borderless" title="A curated room for the next African companies with global intent." className="bg-white">
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <p className="max-w-3xl text-xl font-bold leading-relaxed tracking-[-0.02em] text-black/70">
            Borderless is a premium one-day gathering connecting African founders with global investors, operating leaders, and ecosystem builders. It is designed for focused conversations about capital, expansion, mobility, and the infrastructure needed to build category-defining companies from Lagos to the world.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Private access', 'Investor-grade room', 'Lagos hosted', 'Global ambition'].map((item) => (
              <div key={item} className="rounded-2xl border border-black/8 bg-[#eff0f2] p-5">
                <CheckCircleLine className="mb-4 size-6 text-[#0a9f66]" />
                <p className="text-lg font-black tracking-[-0.04em]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="why" eyebrow="Why Attend" title="Built for access, capital, networks, and sharper operating knowledge.">
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              {...fadeUp}
              transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-72 rounded-[1.35rem] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)]"
            >
              <div className="mb-12 flex size-10 items-center justify-center rounded-full bg-[#d6f56b] text-sm font-black text-black">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-black tracking-[-0.055em]">{benefit.title}</h3>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-black/58">{benefit.copy}</p>
            </motion.article>
          ))}
        </div>
      </Section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div {...fadeUp}>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0a9f66]">Who it&apos;s for</p>
            <h2 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              The room is intentionally narrow.
            </h2>
            <p className="mt-7 text-lg font-bold leading-relaxed text-black/64">
              Borderless is for people actively building, backing, operating, or shaping companies that can compete across borders.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-2">
            {audiences.map((audience) => (
              <div key={audience} className="group rounded-[1.35rem] bg-[#18bf7b] p-7 text-white shadow-[0_18px_45px_rgba(24,191,123,0.2)] hover:-translate-y-1">
                <GlobeLine className="mb-16 size-8 text-white/82" />
                <h3 className="text-3xl font-black tracking-[-0.06em]">{audience}</h3>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Section id="details" eyebrow="Event Details" title="One day in Lagos, designed around high-signal connection.">
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Venue', event.venue],
            ['Date', event.date],
            ['Time', event.time],
            ['Format', event.format],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.35rem] border border-black/8 bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/38">{label}</p>
              <p className="mt-8 text-2xl font-black leading-tight tracking-[-0.055em]">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="themes" eyebrow="Featured Themes" title="The conversations that move beyond the local market.">
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme, index) => (
            <div
              key={theme}
              className={`flex min-h-44 items-end rounded-[1.35rem] p-6 text-2xl font-black tracking-[-0.055em] ${
                index === 0
                  ? 'bg-black text-white'
                  : index === 1
                    ? 'bg-[#d6f56b] text-black'
                    : 'bg-[#18bf7b] text-white'
              }`}
            >
              {theme}
            </div>
          ))}
        </div>
      </Section>

      <section id="register" className="px-5 py-20 sm:px-8 lg:py-28">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.25rem] bg-[#08aa73] px-6 py-16 text-center text-white shadow-[0_30px_90px_rgba(8,170,115,0.26)] sm:px-10 lg:py-20"
        >
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#06452f_1px,transparent_1px)] [background-size:13px_13px]" />
          <div className="relative">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-white/70">Limited room, deliberate access</p>
            <h2 className="mx-auto max-w-3xl text-4xl font-black leading-none tracking-[-0.065em] sm:text-6xl">
              Register interest for an invite to Borderless.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base font-bold leading-relaxed text-white/76">
              Attendance is curated to keep the room useful, ambitious, and commercially meaningful.
            </p>
            <div className="mt-8">
              <a
                href="mailto:hello@borderless.example?subject=Register%20Interest%20for%20Borderless"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#111]"
              >
                Register Interest
                <ArrowRightUpLine className="size-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="px-5 pb-12 pt-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-black/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <LogoMark />
            <p className="mt-3 text-sm font-bold text-black/52">{event.venue} / {event.date}</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-black text-black/64">
            <a href="#about" className="hover:text-[#0a9f66]">About</a>
            <a href="#why" className="hover:text-[#0a9f66]">Why attend</a>
            <a href="#details" className="hover:text-[#0a9f66]">Details</a>
            <a href="#register" className="hover:text-[#0a9f66]">Register</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
