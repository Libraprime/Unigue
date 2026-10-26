import Hero from "@/components/Hero";
import Main_body from "@/components/Body/Main_body";

// Public storefront home. No login required (docs/adr/0001).
export default function Home() {
  return (
    <>
      <Hero />
      <Main_body />
    </>
  );
}
