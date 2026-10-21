import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { formatINR } from "../../utils/format.js";

const PLACEHOLDER = "https://placehold.co/300x300/0f172a/ea580c?text=StrikeShield";

export default function CartItem({
  name = "",
  price = 0,
  quantity = 1,
  coverImage = "",
  id = "",
  onQuantityChange,
  onDelete,
}) {
  const [removing, setRemoving] = useState(false);
  const navigate = useNavigate();

  const buyNow = () => {
    navigate("/orders", {
      state: {
        orderDetail: { id, pname: name, quantity, price: Number(price) },
      },
    });
  };

  const handleDelete = () => {
    setRemoving(true);
    onDelete?.(id);
  };

  return (
    <div
      className={`card flex flex-col gap-4 p-4 transition sm:flex-row sm:items-center ${
        removing ? "scale-95 opacity-50" : ""
      }`}
    >
      <Link
        to={`/product/${id}`}
        className="shrink-0 overflow-hidden rounded-xl bg-navy-50"
        aria-label={`View ${name}`}
      >
        <img
          className="h-24 w-24 object-cover"
          src={coverImage || PLACEHOLDER}
          alt={name}
          loading="lazy"
          width={96}
          height={96}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/product/${id}`}>
          <h2 className="line-clamp-2 text-lg font-bold text-navy-900 transition hover:text-brand-700">
            {name}
          </h2>
        </Link>
        <p className="mt-1 text-sm text-navy-500">Unit price {formatINR(price)}</p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* Quantity stepper */}
          {onQuantityChange ? (
            <div className="inline-flex items-center rounded-lg border border-navy-200">
              <button
                onClick={() => onQuantityChange(id, Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label={`Decrease quantity of ${name}`}
                className="px-3 py-1.5 font-semibold text-navy-700 transition hover:text-brand-600 disabled:opacity-40"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => onQuantityChange(id, quantity + 1)}
                aria-label={`Increase quantity of ${name}`}
                className="px-3 py-1.5 font-semibold text-navy-700 transition hover:text-brand-600"
              >
                +
              </button>
            </div>
          ) : (
            <span className="rounded-lg bg-navy-100 px-3 py-1.5 text-sm font-semibold text-navy-700">
              Qty: {quantity}
            </span>
          )}

          <span className="ml-auto text-xl font-bold text-navy-900">
            {formatINR(Number(price) * quantity)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 sm:flex-col">
        <button onClick={buyNow} className="btn-primary !py-2 text-sm">
          Buy Now
        </button>
        <button
          onClick={handleDelete}
          aria-label={`Remove ${name} from cart`}
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-navy-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
        >
          <DeleteOutlineIcon fontSize="small" />
          Remove
        </button>
      </div>
    </div>
  );
}
