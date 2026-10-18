"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/api/error";
import { useChangePassword } from "@/features/auth/hooks/use-auth-mutations";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/features/auth/schemas/auth.schemas";

export function ChangePasswordForm() {
  const [success, setSuccess] = useState(false);
  const mutation = useChangePassword();
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const submit = form.handleSubmit((values) =>
    mutation.mutate(values, {
      onSuccess: () => {
        setSuccess(true);
        form.reset({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      },
    }),
  );

  return (
    <section className="settings-card">
      <div className="settings-card__head">
        <span className="settings-card__icon" aria-hidden="true">
          <KeyRound size={18} />
        </span>
        <div>
          <h2>Password</h2>
          <p>Use a long, unique passphrase to keep your account safe.</p>
        </div>
      </div>
      <form onSubmit={submit} className="settings-card__body" noValidate>
        {success && !mutation.isPending && (
          <Alert tone="info">
            <CheckCircle2 size={14} aria-hidden="true" /> Password updated. You will stay signed in
            on this device.
          </Alert>
        )}
        {mutation.error && <Alert>{errorMessage(mutation.error)}</Alert>}
        <Input
          label="Current password"
          type="password"
          autoComplete="current-password"
          error={form.formState.errors.currentPassword?.message}
          {...form.register("currentPassword")}
        />
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          hint="12+ characters with uppercase, lowercase, number and symbol"
          error={form.formState.errors.newPassword?.message}
          {...form.register("newPassword")}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={form.formState.errors.confirmNewPassword?.message}
          {...form.register("confirmNewPassword")}
        />
        <div className="settings-card__note">
          <ShieldAlert size={14} aria-hidden="true" />
          <p>
            Changing your password signs you out everywhere else. Use a password manager to keep
            track of strong credentials.
          </p>
        </div>
        <div className="settings-actions settings-actions--inline">
          <Button type="submit" loading={mutation.isPending}>
            Update password
          </Button>
        </div>
      </form>
    </section>
  );
}
