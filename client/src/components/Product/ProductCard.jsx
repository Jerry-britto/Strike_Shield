import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import { formatINR } from "../../utils/format.js";

const PLACEHOLDER = "https://placehold.co/600x600/0f172a/ea580c?text=StrikeShield";

/**
 * Shared product card used by the home carousels and grids. Shows the image,
 * category, name, price and an optional hover "Add to Cart" affordance.
 */
export default function ProductCard({ product, onAddToCart, showAddToCart = false }) {
  if (!product) return null;

  const { _id, name, price, coverImage, category, rating } = product;

  return (
    <div className="group card overflow-hidden">
      <Link
        to={`/product/${_id}`}
        className="relative block aspect-square overflow-hidden bg-navy-50"
        aria-label={`View ${name}`}
      >
        <img
          src={coverImage || PLACEHOLDER}
          alt={name}
          loading="lazy"
          width={400}
          height={400}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
        />
        {showAddToCart && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product);
            }}
            className="absolute inset-x-3 bottom-3 translate-y-16 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
          >
            Add to Cart
          </button>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          {category || "Boxing Gear"}
        </p>
        <Link to={`/product/${_id}`}>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-navy-900 transition hover:text-brand-700">
            {name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-navy-900">{formatINR(price)}</span>
          {typeof rating === "number" && rating > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-navy-500">
              <StarIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
