"use client";
import { FileHeart, FileText, Info, Library, Plus, Sparkles } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
export function DashboardFoundation() {
  const { data: user } = useCurrentUser();
  const name = user?.settings.displayName || user?.name?.split(" ")[0] || "there";
  return (
    <div className="dashboard">
      <div className="dashboard__heading">
        <div>
          <span className="section-kicker">YOUR HEALTH WORKSPACE</span>
          <h1>Welcome, {name}</h1>
          <p>
            MediFlow’s foundation is ready. Your intelligent health tools will come together here.
          </p>
        </div>
        <span className="status-pill">
          <i /> Foundation active
        </span>
      </div>
      <section className="welcome-card">
        <div>
          <span className="welcome-card__icon">
            <FileHeart size={20} />
          </span>
          <h2>A calmer way to understand health information</h2>
          <p>
            We’re building a thoughtful assistant for conversations, documents, reports, and care
            preparation. The first tools will appear in this workspace soon.
          </p>
          <div className="welcome-card__note">
            <span>
              <Info size={13} />
            </span>
            <p>
              <b>Designed for informed conversations</b>MediFlow supports your understanding and
              never replaces advice from a qualified healthcare professional.
            </p>
          </div>
        </div>
        <div className="welcome-visual">
          <span className="pulse pulse--1" />
          <span className="pulse pulse--2" />
          <span className="pulse pulse--3" />
          <b>
            <Plus size={45} />
          </b>
        </div>
      </section>
      <div className="dashboard__section-title">
        <div>
          <h2>What’s coming to your workspace</h2>
          <p>Purpose-built tools, added with care.</p>
        </div>
      </div>
      <div className="module-grid">
        <article>
          <span>
            <Sparkles size={18} />
          </span>
          <div>
            <h3>AI health conversations</h3>
            <p>Clear, contextual explanations for your health questions.</p>
          </div>
          <small>Coming soon</small>
        </article>
        <article>
          <span>
            <FileText size={18} />
          </span>
          <div>
            <h3>Document understanding</h3>
            <p>Bring reports and prescriptions into one organized view.</p>
          </div>
          <small>Coming soon</small>
        </article>
        <article>
          <span>
            <Library size={18} />
          </span>
          <div>
            <h3>Personal health context</h3>
            <p>Build a useful library that stays centered on you.</p>
          </div>
          <small>Coming soon</small>
        </article>
      </div>
    </div>
  );
}
