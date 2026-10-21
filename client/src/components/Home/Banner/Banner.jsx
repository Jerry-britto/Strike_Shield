import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Self-contained hero slides — no external image dependencies (the previous
// hotlinked banners were unreliable and one returned a 404). Each slide is a
// designed gradient panel with headline copy and a CTA.
const slides = [
  {
    id: 1,
    eyebrow: "New Season",
    title: "Train Harder.\nHit Harder.",
    subtitle:
      "Premium boxing gloves engineered for power, comfort and protection.",
    cta: "Shop Gloves",
    to: "/",
    from: "#7c2d12",
    via: "#c2410c",
    to2: "#ea580c",
  },
  {
    id: 2,
    eyebrow: "Pro Collection",
    title: "Built For\nThe Ring.",
    subtitle:
      "Competition-grade gear trusted by fighters who never back down.",
    cta: "Explore Collection",
    to: "/",
    from: "#0f172a",
    via: "#1e293b",
    to2: "#334155",
  },
  {
    id: 3,
    eyebrow: "Limited Drop",
    title: "Power Meets\nPrecision.",
    subtitle:
      "Get 10% off when you bundle 10 or more items. Limited time only.",
    cta: "Grab The Deal",
    to: "/",
    from: "#9a3412",
    via: "#ea580c",
    to2: "#f97316",
  },
];

const AUTO_DELAY = 5500;

export default function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % slides.length),
      AUTO_DELAY
    );
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => setIndex(i);

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      <div
        className="relative h-[420px] w-full transition-transform duration-700 ease-out sm:h-[380px] lg:h-[460px]"
        style={{ backgroundImage: "" }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{
              background: `linear-gradient(120deg, ${slide.from} 0%, ${slide.via} 55%, ${slide.to2} 100%)`,
            }}
          >
            <div className="container-page flex h-full items-center">
              <div className="max-w-xl text-white">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-4 whitespace-pre-line font-display text-5xl leading-[0.95] tracking-wide sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.to}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-navy-900 shadow-lg transition hover:bg-navy-50 active:scale-[0.98]"
                >
                  {slide.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
