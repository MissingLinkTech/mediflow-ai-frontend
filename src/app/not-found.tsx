import Link from "next/link";
import { Brand } from "@/components/shared/brand";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="not-found">
      <Brand />
      <span>404</span>
      <h1>This page wandered off.</h1>
      <p>Let’s get you back to a healthier starting point.</p>
      <Button asChild>
        <Link href={ROUTES.home}>Return home</Link>
      </Button>
    </main>
  );
}
