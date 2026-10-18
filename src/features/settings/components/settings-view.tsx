"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Save, User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage } from "@/lib/api/error";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUpdateSettings } from "@/features/auth/hooks/use-auth-mutations";
import {
  updateSettingsSchema,
  type UpdateSettingsInput,
} from "@/features/auth/schemas/auth.schemas";
import {
  SUPPORTED_LOCALES,
  SUPPORTED_TIMEZONES,
  detectBrowserLocale,
  detectBrowserTimezone,
} from "../settings-options";
import "../styles/settings.scss";

export function SettingsView() {
  const { data: user, isLoading } = useCurrentUser();
  const mutation = useUpdateSettings();

  const form = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      name: "",
      locale: "en-US",
      timezone: "UTC",
      notificationEmails: true,
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      name: user.name ?? "",
      locale: user.settings.locale ?? detectBrowserLocale(),
      timezone: user.settings.timezone ?? detectBrowserTimezone(),
      notificationEmails: user.settings.notificationEmails ?? true,
    });
  }, [user, form]);

  if (isLoading || !user) {
    return (
      <div className="settings-page">
        <header className="settings-page__header">
          <Skeleton className="settings-page__title" />
          <Skeleton className="settings-page__lead" />
        </header>
        <Skeleton className="settings-card" />
        <Skeleton className="settings-card" />
      </div>
    );
  }

  const submit = form.handleSubmit((values) =>
    mutation.mutate(
      {
        name: values.name?.trim() ? values.name.trim() : "",
        locale: values.locale,
        timezone: values.timezone,
        notificationEmails: values.notificationEmails,
      },
      {
        onSuccess: () => {
          form.reset({
            name: values.name?.trim() ?? "",
            locale: values.locale ?? "en-US",
            timezone: values.timezone ?? "UTC",
            notificationEmails: values.notificationEmails ?? true,
          });
        },
      },
    ),
  );

  return (
    <div className="settings-page">
      <header className="settings-page__header">
        <span className="settings-page__kicker">ACCOUNT</span>
        <h1>Settings</h1>
        <p>Update your profile and how MediFlow communicates with you.</p>
      </header>

      <form onSubmit={submit} className="settings-stack" noValidate>
        {mutation.isSuccess && !mutation.isPending && (
          <Alert tone="info">Your changes have been saved.</Alert>
        )}
        {mutation.error && <Alert>{errorMessage(mutation.error)}</Alert>}

        <section className="settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon" aria-hidden="true">
              <UserIcon size={18} />
            </span>
            <div>
              <h2>Profile</h2>
              <p>The name shown across your MediFlow workspace.</p>
            </div>
          </div>
          <div className="settings-card__body">
            <Input
              label="Display name"
              autoComplete="name"
              placeholder="Ava Patel"
              hint="Leave blank to use your account email."
              error={form.formState.errors.name?.message}
              {...form.register("name")}
            />
            <Input
              label="Email"
              value={user.email}
              readOnly
              hint="Contact support to change the email on your account."
            />
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon" aria-hidden="true">
              <Globe size={18} />
            </span>
            <div>
              <h2>Preferences</h2>
              <p>Set how dates and notifications appear.</p>
            </div>
          </div>
          <div className="settings-card__body">
            <label className="settings-field">
              <span>Locale</span>
              <select
                className="settings-field__select"
                {...form.register("locale")}
                aria-invalid={Boolean(form.formState.errors.locale)}
              >
                {SUPPORTED_LOCALES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {form.formState.errors.locale && (
                <small className="settings-field__error">
                  {form.formState.errors.locale.message}
                </small>
              )}
            </label>

            <label className="settings-field">
              <span>Timezone</span>
              <select
                className="settings-field__select"
                {...form.register("timezone")}
                aria-invalid={Boolean(form.formState.errors.timezone)}
              >
                {SUPPORTED_TIMEZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {form.formState.errors.timezone && (
                <small className="settings-field__error">
                  {form.formState.errors.timezone.message}
                </small>
              )}
            </label>

            <label className="settings-toggle">
              <input type="checkbox" {...form.register("notificationEmails")} />
              <span>
                <b>Email notifications</b>
                <small>Receive updates about new AI features and health insights.</small>
              </span>
            </label>
          </div>
        </section>

        <div className="settings-actions">
          <Button type="submit" loading={mutation.isPending}>
            <Save size={16} aria-hidden="true" /> Save changes
          </Button>
          <button
            type="button"
            className="settings-actions__reset"
            onClick={() => form.reset()}
            disabled={mutation.isPending || !form.formState.isDirty}
          >
            Discard changes
          </button>
        </div>
      </form>
    </div>
  );
}
