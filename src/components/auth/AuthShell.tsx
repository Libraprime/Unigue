"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { ArrowLeftIcon, ShieldIcon, SparklesIcon, TruckIcon } from "../icons";

// Rotating value props on the brand panel (replaces the old Sidebar, which
// pulled GIFs from an external CDN).
const PANELS = [
  { Icon: SparklesIcon, title: "Authentic quality", text: "Every pair is sourced from trusted suppliers." },
  { Icon: ShieldIcon, title: "Secure payments", text: "Your payment details are handled with care." },
  { Icon: TruckIcon, title: "Fast delivery", text: "Reliable delivery to your door across Nigeria." },
];

/**
 * Split-screen layout shared by login, register and forgot-password: dark
 * brand panel on the left (stacks under the form on mobile), form on the right.
 */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % PANELS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const { Icon, title: panelTitle, text } = PANELS[index];

  return (
    <div className="grid min-h-screen md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <aside className="order-2 flex flex-col items-center justify-between bg-neutral px-8 py-10 text-neutral-content md:order-1 md:py-16">
        <Link href="/" className="flex items-center gap-2" aria-label="Unigue Stores home">
          <Logo width={40} height={40} />
          <span className="text-2xl font-extrabold tracking-tight">Unigue.</span>
        </Link>

        <div className="mt-10 flex flex-col items-center text-center md:mt-0" aria-live="polite">
          <Icon className="size-10" />
          <p className="mt-4 text-xl font-semibold">{panelTitle}</p>
          <p className="mt-2 max-w-xs text-sm text-neutral-content/70">{text}</p>
          <div className="mt-6 flex gap-2" aria-hidden="true">
            {PANELS.map((_, i) => (
              <span key={i} className={`h-1 w-8 rounded-full transition-colors ${i === index ? "bg-accent" : "bg-neutral-content/20"}`} />
            ))}
          </div>
        </div>
      </aside>

      <main className="order-1 flex items-center justify-center px-5 py-10 md:order-2">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content">
            <ArrowLeftIcon className="size-4" /> Back to store
          </Link>
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mb-8 mt-2 text-base-content/70">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
