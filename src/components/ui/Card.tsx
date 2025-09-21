// [AI]
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`rounded border bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--foreground)] ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
// [/AI]
