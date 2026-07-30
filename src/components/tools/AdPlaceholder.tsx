interface AdPlaceholderProps {
  type: "banner-top" | "sidebar-sticky" | "footer-banner";
  className?: string;
}

export function AdPlaceholder({ type, className = "" }: AdPlaceholderProps) {
  // Clean reusable ad area placeholder (Hidden visually by default unless enabled or debugged)
  return (
    <div
      aria-hidden="true"
      data-ad-type={type}
      className={`ad-slot-placeholder transition-opacity duration-300 ${
        type === "banner-top"
          ? "mx-auto hidden w-full max-w-[728px] min-h-[90px] rounded-2xl border border-dashed border-border/40 bg-secondary/20 lg:block"
          : type === "sidebar-sticky"
          ? "sticky top-28 hidden w-full max-w-[300px] min-h-[600px] rounded-3xl border border-dashed border-border/40 bg-secondary/20 xl:block"
          : "mx-auto hidden w-full max-w-[728px] min-h-[90px] rounded-2xl border border-dashed border-border/40 bg-secondary/20 md:block"
      } ${className}`}
    />
  );
}
