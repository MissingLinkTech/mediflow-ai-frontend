import Link from "next/link";
import { ArrowLeft, Check, Quote, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES } from "@/constants/routes";

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-page">
      <div className="auth-page__brand">
        <Brand />
      </div>
      <ThemeToggle className="auth-page__theme" />
      <section className="auth-panel">
        <div className="auth-panel__inner">
          <div className="auth-heading">
            <span className="auth-heading__icon">
              <Sparkles size={20} />
            </span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
          <p className="auth-legal">
            By continuing, you agree to use MediFlow as an informational tool and not a substitute
            for professional medical care.
          </p>
        </div>
      </section>
      <aside className="auth-aside">
        <div className="auth-aside__content">
          <span className="quote-mark">
            <Quote size={52} />
          </span>
          <blockquote>Understanding your health shouldn’t feel overwhelming.</blockquote>
          <p>
            MediFlow turns complex information into calm, clear guidance—so you can feel more
            prepared for the conversations that matter.
          </p>
          <div className="trust-row">
            <span>
              <Check size={14} /> Privacy-minded
            </span>
            <span>
              <Check size={14} /> Responsible AI
            </span>
          </div>
        </div>
        <Link href={ROUTES.home} className="auth-back">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </aside>
    </main>
  );
}
