"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES, safeRedirectPath } from "@/constants/routes";
import { errorMessage } from "@/lib/api/error";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "../schemas/auth.schemas";
import { useLogin, useSignup } from "../hooks/use-auth-mutations";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mutation = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const submit = form.handleSubmit((values) =>
    mutation.mutate(values, {
      onSuccess: () => router.replace(safeRedirectPath(searchParams.get("redirect"))),
    }),
  );
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
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Sign in securely
      </Button>
      <p className="auth-form__switch">
        New to MediFlow? <Link href={ROUTES.signup}>Create an account</Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  const mutation = useSignup();
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const submit = form.handleSubmit((values) =>
    mutation.mutate(values, { onSuccess: () => router.replace(ROUTES.app) }),
  );
  return (
    <form onSubmit={submit} className="auth-form" noValidate>
      {mutation.error && <Alert>{errorMessage(mutation.error)}</Alert>}
      <Input
        label="Full name (optional)"
        autoComplete="name"
        placeholder="Ava Patel"
        error={form.formState.errors.name?.message}
        {...form.register("name")}
      />
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a strong password"
        hint="12+ characters with uppercase, lowercase, number and symbol"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Create my account
      </Button>
      <p className="auth-form__switch">
        Already have an account? <Link href={ROUTES.login}>Sign in</Link>
      </p>
    </form>
  );
}
