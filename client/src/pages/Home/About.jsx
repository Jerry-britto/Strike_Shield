import QualityCheckIcon from "@mui/icons-material/WorkspacePremium";
import GridIcon from "@mui/icons-material/GridView";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Link } from "react-router-dom";

const perks = [
  {
    Icon: QualityCheckIcon,
    title: "High Quality",
    body: "Crafted for maximum comfort and durability, so you get the best performance and protection every session.",
  },
  {
    Icon: GridIcon,
    title: "Wide Range",
    body: "A diverse range of styles and sizes to fit every need — from your first training session to professional matches.",
  },
  {
    Icon: SupportAgentIcon,
    title: "Dedicated Support",
    body: "A team that's passionate about boxing and ready to support your journey, whether you're a pro or just starting out.",
  },
  {
    Icon: LocalShippingIcon,
    title: "Fast Delivery",
    body: "Quick, reliable shipping with free delivery on orders over ₹999 and easy 30-day returns.",
  },
];

const stats = [
  { value: "10K+", label: "Happy customers" },
  { value: "240+", label: "Products sold" },
  { value: "50+", label: "Premium gear items" },
  { value: "4.8★", label: "Average rating" },
];

export default function About() {
  return (
    <div className="bg-navy-50">
      {/* Hero */}
      <section className="bg-navy-900 py-16 text-white lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
              Our Story
            </span>
            <h1 className="mt-2 font-display text-5xl leading-tight tracking-wide sm:text-6xl">
              Built for fighters,
              <br />
              by fighters.
            </h1>
            <p className="mt-5 max-w-lg leading-relaxed text-navy-300">
              Welcome to{" "}
              <span className="font-semibold text-brand-500">StrikeShield</span> —
              your destination for premium boxing gloves and accessories. We
              deliver top-quality gear that helps athletes of every level perform
              at their best.
            </p>
            <Link to="/" className="btn-primary mt-7 inline-flex">
              Shop the collection
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-navy-800 p-6 text-center"
              >
                <p className="font-display text-4xl tracking-wide text-brand-500">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-navy-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Why StrikeShield
          </span>
          <h2 className="mt-2 font-display text-4xl tracking-wide text-navy-900">
            Why choose us?
          </h2>
          <p className="mt-3 text-navy-500">
            Everything we do is aimed at helping you train harder and stay
            protected.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ Icon, title, body }) => (
            <div key={title} className="card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <Icon sx={{ fontSize: 26, color: "#ea580c" }} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Rewards
            </span>
            <h2 className="mt-2 font-display text-4xl tracking-wide text-navy-900">
              Earn as you shop
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Sign up & get 10,000 tokens",
                body: "Every new member is welcomed with 10,000 tokens to spend across the store.",
              },
              {
                step: "02",
                title: "Top up when you run low",
                body: "Need more? Grab an extra 5,000 tokens with your email and password (once every 5 days).",
              },
              {
                step: "03",
                title: "Unlock automatic discounts",
                body: "Orders of 10+ items get 10% off instantly. A 3% GST applies to every order.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative rounded-2xl bg-navy-50 p-6">
                <span className="font-display text-5xl leading-none text-brand-600/30">
                  {step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-3xl text-center leading-relaxed text-navy-600">
            Thank you for choosing StrikeShield. We look forward to serving you
            and helping you achieve your boxing goals.
          </p>
        </div>
      </section>
    </div>
  );
}
