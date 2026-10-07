import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-transparent px-[22px] text-sm font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] outline-none hover:-translate-y-px focus-visible:ring-3 focus-visible:ring-[#209a8b]/25 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0c766b] text-white shadow-[0_8px_22px_rgba(12,118,107,.17)] hover:bg-[#075e56]",
        secondary: "border-[#cddeda] bg-white text-[#153b37] hover:bg-[#f4faf8]",
        ghost: "text-[#0c766b] hover:bg-[#eaf6f2] dark:text-[#8bd5c7] dark:hover:bg-white/10",
        light: "bg-white text-[#075e56] hover:bg-[#eff8f5]",
      },
      size: {
        default: "h-11",
        sm: "h-10 min-h-10 px-[18px]",
        lg: "h-[52px] min-h-[52px] px-[26px]",
        icon: "size-10 min-h-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  asChild = false,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {children}
      </Slot>
    );
  }
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
      <span>{loading ? "Please wait…" : children}</span>
    </button>
  );
}

export { buttonVariants };
