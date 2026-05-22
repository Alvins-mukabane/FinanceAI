import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "Essential cookies and storage",
    body: "eva uses essential cookies and local storage to keep you signed in, remember product preferences, preserve onboarding progress, and secure sensitive flows.",
  },
  {
    title: "Performance and diagnostics",
    body: "We may use limited analytics or diagnostic technologies to understand app performance, reliability, and product quality so we can improve the workspace experience.",
  },
  {
    title: "Feature memory",
    body: "Browser storage may remember font scale, reduced motion, theme settings, recent workflow state, and other experience choices you make inside eva.",
  },
  {
    title: "Your choices",
    body: "You can manage cookies through your browser settings. Blocking all cookies or browser storage may prevent parts of eva from working correctly, especially sign-in and saved-progress flows.",
  },
];

export default function CookiePolicy() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-background px-6 py-8">
      <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back home
      </Link>
      <div className="rounded-[2rem] border border-border/80 bg-card/95 p-6 shadow-[0_28px_80px_-48px_rgba(110,73,75,0.28)] md:p-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Cookie Policy</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Last updated May 22, 2026. This page explains how eva uses cookies, local storage, and similar
          browser technologies.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="mt-2">{section.body}</p>
            </section>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Questions about cookies or browser storage in eva can be sent to help@useaima.com.
      </p>
    </div>
  );
}
