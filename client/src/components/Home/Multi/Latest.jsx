import { Link } from "react-router-dom";
import { formatINR } from "../../../utils/format.js";
import { ProductCardSkeleton } from "../../Loader/Skeletons.jsx";

const PLACEHOLDER = "https://placehold.co/600x600/0f172a/ea580c?text=StrikeShield";

export default function Latest({ products = [], loading = false }) {
  return (
    <section className="bg-navy-900 py-14 lg:py-20">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
            The Collection
          </span>
          <h2 className="mt-2 font-display text-4xl tracking-wide text-white sm:text-5xl">
            Have A Look At What We Provide
          </h2>
          <div className="mt-3 h-1 w-16 rounded bg-brand-600" />
          <p className="mt-4 text-navy-300">
            Hand-picked gear for every level — from your first spar to fight night.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((ele) => (
              <Link
                key={ele._id}
                to={`/product/${ele._id}`}
                className="group overflow-hidden rounded-2xl bg-navy-800 transition hover:ring-2 hover:ring-brand-500"
              >
                <div className="aspect-square overflow-hidden bg-white">
                  <img
                    src={ele.coverImage || PLACEHOLDER}
                    alt={ele.name}
                    loading="lazy"
                    width={400}
                    height={400}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                    {ele.category || "Boxing Gear"}
                  </p>
                  <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] font-semibold text-white">
                    {ele.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-navy-400">
                    {ele.description?.shortDescription}
                  </p>
                  <p className="mt-3 text-lg font-bold text-brand-500">
                    {formatINR(ele.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-navy-800 p-10 text-center text-navy-300">
            No products to show yet.
          </div>
        )}
      </div>
    </section>
  );
}
