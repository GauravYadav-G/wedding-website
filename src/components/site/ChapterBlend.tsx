export default function ChapterBlend({ tone = "light" }: { tone?: "light" | "warm" | "dark" }) {
  return <div className={`chapter-blend chapter-blend-${tone}`} aria-hidden="true"><i /><i /><i /></div>;
}
