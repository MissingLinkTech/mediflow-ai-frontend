import type { Metadata } from "next";
import { AuthLayout } from "@/components/layout/auth-layout";
import { SignupForm } from "@/features/auth/components/auth-form";
import { AuthRouteGuard } from "@/features/auth/components/auth-route-guard";
export const metadata: Metadata = { title: "Create account" };
export default function SignupPage() {
  return (
    <AuthRouteGuard>
      <AuthLayout
        title="Start with clarity"
        description="Create your private MediFlow workspace in a moment."
      >
        <SignupForm />
      </AuthLayout>
    </AuthRouteGuard>
  );
}
