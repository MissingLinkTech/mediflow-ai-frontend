"use client";

import { Activity, ClipboardList, Pill, ShieldAlert, Sparkles, Stethoscope } from "lucide-react";

interface StarterPrompt {
  id: string;
  icon: typeof Sparkles;
  title: string;
  description: string;
  prompt: string;
}

const STARTER_PROMPTS: StarterPrompt[] = [
  {
    id: "labs",
    icon: Activity,
    title: "Understand lab results",
    description: "Clarify lipid panel, HbA1c, or complete blood count reference ranges.",
    prompt:
      "Can you help me understand what a standard Comprehensive Metabolic Panel (CMP) measures and what elevated BUN or creatinine might signify?",
  },
  {
    id: "doctor-visit",
    icon: Stethoscope,
    title: "Prepare for doctor consultation",
    description: "Generate targeted questions to ask your physician about persistent symptoms.",
    prompt:
      "I have an upcoming appointment for persistent lower back pain that radiates down my leg. What specific questions should I ask my doctor?",
  },
  {
    id: "medications",
    icon: Pill,
    title: "Medication guidance",
    description: "Learn about indications, potential interactions, and side effects.",
    prompt:
      "What are the common side effects and lifestyle precautions when starting an ACE inhibitor for hypertension?",
  },
  {
    id: "recovery",
    icon: ClipboardList,
    title: "Post-visit care & lifestyle",
    description: "Evidence-based wellness, nutrition, and exercise modifications.",
    prompt:
      "What dietary approaches (such as the DASH diet or Mediterranean diet) have strong clinical evidence for reducing cardiovascular risk?",
  },
];

interface EmptyChatStateProps {
  /** Called when the user picks a starter card and wants to edit before sending. */
  onSelectPrompt: (prompt: string) => void;
  /** Called when the user wants a fresh empty consultation. */
  onStartChat: () => void;
  /** Called when the user wants to launch straight into a starter prompt. */
  onStartWithPrompt: (prompt: string) => void;
}

export function EmptyChatState({
  onSelectPrompt,
  onStartChat,
  onStartWithPrompt,
}: EmptyChatStateProps) {
  return (
    <div className="empty-chat">
      <div className="empty-chat__hero">
        <div className="empty-chat__icon">
          <Sparkles className="size-6 sm:size-7" aria-hidden="true" />
          <span className="empty-chat__icon-dot" aria-hidden="true" />
        </div>

        <h2 className="empty-chat__title">How can MediFlow assist your health today?</h2>
        <p className="empty-chat__lede">
          Ask clinical education questions, summarize complex medical terminology, or prepare for
          your next healthcare consultation.
        </p>
      </div>

      <button
        type="button"
        onClick={onStartChat}
        className="chat-empty-cta"
        aria-label="Start a new empty consultation"
      >
        <span className="chat-empty-cta-icon" aria-hidden="true">
          <Sparkles className="size-4" />
        </span>
        Start a new consultation
      </button>

      <div className="empty-chat__starters">
        <span className="empty-chat__starters-label">Or pick a starter to begin instantly</span>
        <div className="empty-chat__starters-grid">
          {STARTER_PROMPTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group flex flex-col items-stretch overflow-hidden rounded-xl border border-[#dce9e5] bg-white text-left transition-all hover:-translate-y-0.5 hover:border-[#0c766b]/40 hover:shadow-md dark:border-[#26413d] dark:bg-[#142724] dark:hover:border-[#49b8a6]/40"
              >
                <button
                  type="button"
                  onClick={() => onStartWithPrompt(item.prompt)}
                  className="empty-chat__starter-main"
                  aria-label={`Start a consultation: ${item.title}`}
                >
                  <div className="empty-chat__starter-icon">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="empty-chat__starter-meta">
                    <h3 className="empty-chat__starter-title">{item.title}</h3>
                    <p className="empty-chat__starter-desc">{item.description}</p>
                  </div>
                </button>
                <div className="empty-chat__starter-footer">
                  <span className="empty-chat__starter-tag">One-click start</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectPrompt(item.prompt);
                    }}
                    className="empty-chat__starter-edit"
                  >
                    Edit before sending
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="empty-chat__disclaimer">
        <ShieldAlert className="size-3.5 shrink-0" aria-hidden="true" />
        <span>
          Educational information only. Always consult a licensed clinician for medical diagnosis.
        </span>
      </div>
    </div>
  );
}
