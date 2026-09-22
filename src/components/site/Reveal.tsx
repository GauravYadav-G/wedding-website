import type { ReactNode } from "react";
// Keep content in the first paint instead of hiding it until a scroll observer fires.
export default function Reveal({ children, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={className}>{children}</div>;
}
