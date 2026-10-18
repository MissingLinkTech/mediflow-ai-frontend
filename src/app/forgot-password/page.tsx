import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { AuthRouteGuard } from "@/features/auth/components/auth-route-guard";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="form-placeholder" />}>
      <AuthRouteGuard>
        <AuthLayout
          title="Forgot your password?"
          description="Enter the email on your account and we will send you a secure reset link."
        >
          <ForgotPasswordForm />
        </AuthLayout>
      </AuthRouteGuard>
    </Suspense>
  );
}
