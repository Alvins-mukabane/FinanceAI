import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-background px-6 py-8">
      <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back home
      </Link>
      <div className="rounded-[2rem] border border-border/80 bg-card/95 p-6 shadow-[0_28px_80px_-48px_rgba(110,73,75,0.28)] md:p-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Last updated May 22, 2026. This policy explains how eva handles account data, financial workspace
          information, support interactions, cookies, and AI-assisted processing.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information we collect</h2>
            <p className="mt-2">eva may collect account details, onboarding information, financial baseline inputs, budgets, goals, subscriptions, approved spending data, support messages, device information, security logs, and cookie or local storage identifiers needed to operate the product.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How we use information</h2>
            <p className="mt-2">We use information to authenticate users, personalize the workspace, save progress, generate grounded insights, protect the service, respond to support requests, and improve reliability. When you intentionally use AI-powered features, relevant inputs may be processed to generate summaries, recommendations, or assistant responses.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Cookies and browser storage</h2>
            <p className="mt-2">eva uses essential cookies and local browser storage to keep sessions active, remember preferences, preserve onboarding drafts, and maintain the product experience. Additional details appear in the separate Cookie Policy.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Sharing and providers</h2>
            <p className="mt-2">We may share data with infrastructure, hosting, authentication, analytics, and support providers acting on our behalf when needed to deliver the service. We do not sell your personal information.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Security, retention, and rights</h2>
            <p className="mt-2">We use reasonable safeguards intended to protect user information and retain data only as long as needed for product operation, legal compliance, support history, and fraud prevention. You may request access, correction, or deletion of applicable personal information by contacting help@useaima.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
