"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="not-found">
      <span>WE HIT A SNAG</span>
      <h1>That didn’t flow as expected.</h1>
      <p>Your information is safe. Please try loading this view again.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
