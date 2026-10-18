"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { errorMessage } from "@/lib/api/error";
import { useResetPassword } from "../hooks/use-auth-mutations";
import { resetPasswordSchema, type ResetPasswordInput } from "../schemas/auth.schemas";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenValue = searchParams.get("token") ?? "";
  const missingToken = !tokenValue.trim();

  const mutation = useResetPassword();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenValue, password: "" },
  });

  const submit = form.handleSubmit((values) =>
    mutation.mutate(values, {
      onSuccess: () => {
        router.replace(ROUTES.login);
      },
    }),
  );

  return (
    <form onSubmit={submit} className="auth-form" noValidate>
      {mutation.error && <Alert>{errorMessage(mutation.error)}</Alert>}
      {missingToken && (
        <Alert tone="info">
          This page expects a reset token. Open the link from your reset email or request a new one.
        </Alert>
      )}
      <input type="hidden" {...form.register("token")} value={tokenValue} />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a strong password"
        hint="12+ characters with uppercase, lowercase, number and symbol"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <Button type="submit" loading={mutation.isPending} disabled={missingToken} className="w-full">
        Update password
      </Button>
      <p className="auth-form__switch">
        Need a new link? <Link href={ROUTES.forgotPassword}>Request again</Link>
      </p>
      <div className="auth-form__success-row" aria-hidden={mutation.isPending}>
        <CheckCircle2 size={14} className="text-[#0c766b] dark:text-[#49b8a6]" />
        <span>After updating, sign in with your new password.</span>
      </div>
    </form>
  );
}
