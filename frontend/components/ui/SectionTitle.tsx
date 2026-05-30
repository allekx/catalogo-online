import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="font-display text-2xl font-semibold text-maia-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 font-body text-sm text-maia-muted">{subtitle}</p>
      )}
    </div>
  );
}
