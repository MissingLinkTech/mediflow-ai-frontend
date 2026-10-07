import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = "", ...props },
  ref,
) {
  const inputId = id || props.name;
  const descriptionId = `${inputId}-description`;
  return (
    <div className="grid gap-1.5">
      <label className="text-[13px] font-bold text-[#254e49]" htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-12 w-full rounded-[9px] border border-[#cededa] bg-white px-3.5 text-[#153b37] transition-[border-color,box-shadow] outline-none placeholder:text-[#9aacaa] focus:border-[#0c766b] focus:ring-3 focus:ring-[#0c766b]/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#c36060] aria-invalid:ring-[#c36060]/10",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        {...props}
      />
      {(error || hint) && (
        <p
          id={descriptionId}
          className={cn("text-xs leading-[1.45]", error ? "text-[#a43e3e]" : "text-[#65807c]")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
});
