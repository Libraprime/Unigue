import { ShieldIcon, SparklesIcon, TruckIcon } from "../icons";

const FEATURES = [
  { Icon: TruckIcon, title: "Fast delivery", text: "Reliable delivery to your door across Nigeria." },
  { Icon: ShieldIcon, title: "Secure payments", text: "Your payment details are handled with care." },
  { Icon: SparklesIcon, title: "Authentic quality", text: "Every pair is sourced from trusted suppliers." },
];

export default function Features() {
  return (
    <section className="border-y border-base-300 bg-base-200/50" aria-label="Why shop with us">
      <ul className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        {FEATURES.map(({ Icon, title, text }) => (
          <li key={title} className="flex flex-col items-center gap-2 text-center">
            <Icon className="size-8" />
            <p className="font-semibold">{title}</p>
            <p className="max-w-xs text-sm text-base-content/70">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
