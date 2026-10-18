"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { errorMessage } from "@/lib/api/error";
import { useForgotPassword } from "../hooks/use-auth-mutations";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas/auth.schemas";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const mutation = useForgotPassword();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const submit = form.handleSubmit((values) =>
    mutation.mutate(values, {
      onSuccess: () => {
        setSubmittedEmail(values.email);
        setSubmitted(true);
      },
    }),
  );

  if (submitted) {
    return (
      <div className="auth-form auth-form--success">
        <div className="auth-form__success-icon" aria-hidden="true">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="auth-form__success-title">Check your inbox</h2>
        <p className="auth-form__success-text">
          If an account exists for{" "}
          <strong className="font-semibold text-[#153b37] dark:text-[#e4f2ef]">
            {submittedEmail}
          </strong>
          , we just sent password reset instructions. The link expires in 30 minutes.
        </p>
        <p className="auth-form__success-text">
          For your security, you will see this confirmation even when the email is not registered.
        </p>
        <Button asChild variant="secondary" className="w-full">
          <Link href={ROUTES.login}>
            <ArrowLeft size={14} aria-hidden="true" /> Back to sign in
          </Link>
        </Button>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            form.reset();
          }}
          className="auth-form__resend"
        >
          <Mail size={13} aria-hidden="true" /> Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="auth-form" noValidate>
      {mutation.error && <Alert>{errorMessage(mutation.error)}</Alert>}
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Send reset link
      </Button>
      <p className="auth-form__switch">
        Remembered your password? <Link href={ROUTES.login}>Sign in</Link>
      </p>
    </form>
  );
}
