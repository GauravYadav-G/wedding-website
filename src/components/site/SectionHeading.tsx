import { DiyaDivider } from "./Ornaments";

export default function SectionHeading({
  hindi,
  title,
  index,
  tone = "dark",
  align = "center",
}: {
  hindi: string;
  title: string;
  index?: string;
  tone?: "dark" | "light";
  align?: "center" | "left";
}) {
  const hindiColor = tone === "dark" ? "text-saffron-2" : "text-gold-2";
  const titleColor = tone === "dark" ? "text-maroon" : "text-cream";
  const subColor = tone === "dark" ? "text-ink/60" : "text-cream/60";

  return (
    <div
      className={`flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {typeof index === "string" ? (
        <span
          className={`font-body text-[11px] font-medium uppercase tracking-[0.45em] ${subColor}`}
        >
          {index}
        </span>
      ) : null}
      <span className={`font-hindi text-lg md:text-xl ${hindiColor}`}>
        {hindi}
      </span>
      <h2
        className={`font-display text-4xl leading-tight font-semibold md:text-5xl ${titleColor}`}
      >
        {title}
      </h2>
      <DiyaDivider
        className="h-10 w-56 md:w-72"
        tone={tone === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
