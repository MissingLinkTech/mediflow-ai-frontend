import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { AuthRouteGuard } from "@/features/auth/components/auth-route-guard";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="form-placeholder" />}>
      <AuthRouteGuard>
        <AuthLayout
          title="Set a new password"
          description="Choose a strong password to finish resetting your MediFlow account."
        >
          <ResetPasswordForm />
        </AuthLayout>
      </AuthRouteGuard>
    </Suspense>
  );
}
