import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Alert({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "info";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3.5 py-3 text-[13px] leading-[1.45]",
        tone === "error"
          ? "border-[#f2cccc] bg-[#fff1f1] text-[#813434] dark:border-[#5a2b2b] dark:bg-[#2a1515] dark:text-[#f0a8a8]"
          : "border-[#dcece7] bg-[#f1faf7] text-[#254e49] dark:border-[#26413d] dark:bg-[#142724] dark:text-[#c4ded9]",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
