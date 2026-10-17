import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/features/auth/components/auth-form";
import { AuthRouteGuard } from "@/features/auth/components/auth-route-guard";
export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="form-placeholder" />}>
      <AuthRouteGuard>
        <AuthLayout
          title="Welcome back"
          description="Sign in to continue to your health workspace."
        >
          <LoginForm />
        </AuthLayout>
      </AuthRouteGuard>
    </Suspense>
  );
}
