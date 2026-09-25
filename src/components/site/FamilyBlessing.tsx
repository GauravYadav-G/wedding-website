import { LivingLamps } from "./LivingDecor";

export default function FamilyBlessing() {
  return (
    <section className="family-blessing" aria-labelledby="family-blessing-title">
      <picture className="family-blessing-art">
        <source media="(max-width: 700px)" srcSet="/artwork/family-blessings-mobile.webp" />
        <img
          src="/artwork/family-blessings-desktop.webp"
          alt="Deepak and Ayusha receive their families’ blessings beside the sacred wedding fire"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="family-blessing-wash" aria-hidden="true" />
      <header className="family-blessing-copy" data-story="">
        <span className="eyebrow">Held by love · Guided by tradition</span>
        <p className="script-accent">With every blessing</p>
        <h2 id="family-blessing-title">Two families become one.</h2>
      </header>
      <div className="family-havan" aria-hidden="true"><i /><i /><i /></div>
      <LivingLamps />
    </section>
  );
}
