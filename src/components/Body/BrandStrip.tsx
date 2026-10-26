const BRANDS = ["Nike", "Adidas", "Puma", "Reebok", "Gucci", "Prada"];

/** Scrolling brand names. The list is rendered twice so the -50% marquee loops seamlessly. */
export default function BrandStrip() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-16 pr-16 md:gap-28 md:pr-28" aria-hidden={hidden || undefined}>
      {BRANDS.map((b) => (
        <li key={b} className="text-2xl font-bold uppercase tracking-widest text-base-content/30">{b}</li>
      ))}
    </ul>
  );
  return (
    <section className="overflow-hidden border-b border-base-300 py-8" aria-label="Brands we stock">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
