import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleCheck,
  Ellipsis,
  FileChartColumn,
  FileHeart,
  Info,
  Library,
  MessageCircleHeart,
  Pill,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES } from "@/constants/routes";

const features = [
  {
    icon: MessageCircleHeart,
    title: "Health conversations",
    text: "Ask questions in plain language and get structured, easy-to-follow health information.",
  },
  {
    icon: Pill,
    title: "Prescription clarity",
    text: "Understand the purpose and common guidance around prescriptions—without the medical jargon.",
  },
  {
    icon: FileChartColumn,
    title: "Report insights",
    text: "Turn dense medical reports into clear summaries and useful questions for your care team.",
  },
  {
    icon: Library,
    title: "Your health library",
    text: "Build a private, searchable space for your documents and health context.",
  },
];

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header__inner container">
        <Brand />
        <nav className="public-nav" aria-label="Primary navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#safety">Safety</a>
        </nav>
        <div className="public-header__actions">
          <ThemeToggle />
          <Link href={ROUTES.login} className="text-link">
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href={ROUTES.signup}>
              Try MediFlow <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__grid container">
        <div className="hero__content">
          <div className="eyebrow">
            <span /> Thoughtful health information, made clearer
          </div>
          <h1>
            Feel more informed about <em>your health.</em>
          </h1>
          <p className="hero__lead">
            MediFlow AI helps you understand health information, prepare better questions, and keep
            your care journey organized—all in one calm, private place.
          </p>
          <div className="hero__actions">
            <Button asChild size="lg" className="max-sm:w-full">
              <Link href={ROUTES.signup}>
                Try MediFlow free <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="max-sm:w-full">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
          <p className="hero__note">
            <Check size={14} aria-hidden="true" /> No credit card required <span>•</span> Built with
            privacy in mind
          </p>
        </div>
        <div
          className="hero-visual"
          aria-label="Preview of a MediFlow health information conversation"
        >
          <div className="orb orb--one" />
          <div className="orb orb--two" />
          <div className="conversation-card">
            <div className="conversation-card__top">
              <span className="mini-mark">
                <Plus size={17} />
              </span>
              <div>
                <b>MediFlow Assistant</b>
                <small>
                  <i /> Ready to help
                </small>
              </div>
              <Ellipsis className="more" size={16} aria-hidden="true" />
            </div>
            <div className="chat-date">TODAY</div>
            <div className="message message--assistant">
              Hi there! I’m here to help you make sense of health information. What would you like
              to understand today?
            </div>
            <div className="message message--user">
              Can you help me understand what my blood test results mean?
            </div>
            <div className="message message--assistant message--rich">
              <Sparkles className="thinking" size={15} />
              <div>
                <b>Absolutely. I can help explain the common markers and what they may indicate.</b>
                <p>
                  You can share the values you’re curious about, and we’ll go through them together.
                </p>
                <div className="info-chip">
                  <span>
                    <Info size={9} />
                  </span>{" "}
                  I’ll explain, not diagnose—and help you prepare questions for your doctor.
                </div>
              </div>
            </div>
            <div className="fake-input">
              <span>Ask a health question…</span>
              <b>
                <Send size={12} />
              </b>
            </div>
          </div>
          <div className="privacy-float">
            <span>
              <ShieldCheck size={16} />
            </span>
            <div>
              <b>Your privacy matters</b>
              <small>Protected & confidential</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="section features">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">BUILT AROUND YOU</span>
          <h2>Clarity for every step of your health journey</h2>
          <p>
            From a quick question to a complex report, MediFlow makes health information easier to
            navigate.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <span className="feature-card__icon">
                  <Icon size={20} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <span className="feature-card__soon">Coming soon</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section how">
      <div className="how__grid container">
        <div>
          <span className="section-kicker">SIMPLE BY DESIGN</span>
          <h2>Answers that meet you where you are</h2>
          <p>
            Health information can be overwhelming. MediFlow turns it into a calmer, clearer
            conversation.
          </p>
          <div className="steps">
            <div>
              <b>01</b>
              <span>
                <strong>Ask in your own words</strong>
                <small>No jargon needed. Start with what’s on your mind.</small>
              </span>
            </div>
            <div>
              <b>02</b>
              <span>
                <strong>Get a clear explanation</strong>
                <small>Receive structured context designed to be understood.</small>
              </span>
            </div>
            <div>
              <b>03</b>
              <span>
                <strong>Take the next step informed</strong>
                <small>Prepare better questions and discuss them with a professional.</small>
              </span>
            </div>
          </div>
        </div>
        <div className="insight-card">
          <span className="insight-card__spark">
            <Sparkles size={25} />
          </span>
          <p className="insight-card__label">MEDIFLOW INSIGHT</p>
          <h3>Good questions lead to better conversations.</h3>
          <p>
            MediFlow helps you translate uncertainty into useful questions for your doctor or care
            team.
          </p>
          <div className="question-list">
            <span>
              <i>
                <Check size={10} />
              </i>{" "}
              What does this result measure?
            </span>
            <span>
              <i>
                <Check size={10} />
              </i>{" "}
              What context could affect the range?
            </span>
            <span>
              <i>
                <Check size={10} />
              </i>{" "}
              What should I ask at my next visit?
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section id="safety" className="section safety">
      <div className="safety__inner container">
        <div className="safety__icon">
          <Stethoscope size={28} />
        </div>
        <div>
          <span className="section-kicker">RESPONSIBLE BY DEFAULT</span>
          <h2>Supportive information—not a diagnosis</h2>
          <p>
            MediFlow is designed to help you understand health information and prepare for
            conversations with qualified professionals. It does not replace medical advice,
            diagnosis, or emergency care.
          </p>
        </div>
        <div className="safety__points">
          <span>
            <i>
              <CircleCheck size={14} />
            </i>{" "}
            Clear limitations
          </span>
          <span>
            <i>
              <CircleCheck size={14} />
            </i>{" "}
            Privacy-minded design
          </span>
          <span>
            <i>
              <CircleCheck size={14} />
            </i>{" "}
            Human care stays central
          </span>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="cta">
      <div className="cta__inner container">
        <span className="cta__mark">
          <FileHeart size={28} />
        </span>
        <h2>A clearer health journey starts here.</h2>
        <p>Get thoughtful, easy-to-understand health information when you need it.</p>
        <Button asChild variant="light" size="lg" className="my-[27px] max-sm:w-full">
          <Link href={ROUTES.signup}>
            Create your free account <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <small>
          Informational support only. Always consult a qualified healthcare professional.
        </small>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <Brand />
        <p>© 2026 MediFlow AI. Health information, thoughtfully explained.</p>
        <div>
          <a href="#safety">Safety</a>
          <a href="mailto:support@mediflow.example.com">Support</a>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SafetySection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
