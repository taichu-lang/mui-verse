import { type CSSProperties, type ReactNode } from "react";

interface AnimatedBorderProps {
  children: ReactNode;
  bgcolor?: [string, string];
  colors?: [string, string];
  borderWidth?: number;
  duration?: number;
  className?: string;
}

export function AnimatedBorder({
  children,
  bgcolor = [
    "var(--color-background-default)",
    "var(--color-background-default)",
  ],
  colors = ["var(--color-primary-500)", "var(--color-secondary-500)"],
  borderWidth = 2,
  duration = 3,
  className,
}: AnimatedBorderProps) {
  const style: CSSProperties = {
    border: `${borderWidth}px solid transparent`,
    background: `
      linear-gradient(${bgcolor[0]}, ${bgcolor[1]}) padding-box,
      conic-gradient(from var(--border-angle), transparent 60%, ${colors[0]}, ${colors[1]}, transparent 90%) border-box
    `,
    animation: `rotate-border ${duration}s linear infinite`,
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
