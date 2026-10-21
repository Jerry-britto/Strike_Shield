import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReplayIcon from "@mui/icons-material/Replay";
import HomeIcon from "@mui/icons-material/Home";
import api from "../../api/axios.js";
import { setCartCount } from "../../store/slice.js";
import { formatINR, formatDate } from "../../utils/format.js";
import FullPageLoader from "../../components/Loader/FullPageLoader.jsx";

const PLACEHOLDER = "https://placehold.co/800x800/0f172a/ea580c?text=StrikeShield";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const perks = [
  { Icon: LocalShippingIcon, label: "Free shipping over ₹999" },
  { Icon: VerifiedIcon, label: "Authentic quality gear" },
  { Icon: ReplayIcon, label: "30-day easy returns" },
];

export default function ViewProduct() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoggedIn = user && user.length > 0;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const [productRes, reviewRes] = await Promise.all([
          api.get(`/product/getproduct/${pid}`),
          api.get(`/product/review/${pid}`),
        ]);
        if (!isActive) return;
        setProduct(productRes.data?.product || null);
        setReviews(reviewRes.data?.reviews || []);
      } catch (error) {
        console.log(error.message);
        if (isActive) toast.error("Could not load product details");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, [pid]);

  const outOfStock = product?.stock === 0;
  const maxQty = Math.max(1, Number(product?.stock) || 1);

  const refreshCartCount = async () => {
    try {
      const res = await api.get("/cart");
      const items = res.data?.cart?.items || [];
      dispatch(
        setCartCount(items.reduce((sum, i) => sum + (i?.quantity || 0), 0))
      );
    } catch {
      /* ignore */
    }
  };

  const changeQty = (delta) => {
    setQty((prev) => Math.min(maxQty, Math.max(1, prev + delta)));
  };

  const addToCart = async () => {
    if (!isLoggedIn) {
      toast.info("Please log in to add items to your cart");
      navigate("/login");
      return;
    }
    if (outOfStock) {
      toast.warn("This product is out of stock");
      return;
    }
    try {
      await api.post(`/cart/item/${product._id}`, { quantity: qty });
      toast.success(`Added ${qty} × ${product.name} to cart`);
      // Refresh the badge in the background — no need to block the toast on it.
      refreshCartCount();
    } catch {
      toast.error("Could not add to cart. Please try again.");
    }
  };

  const buyNow = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to continue");
      navigate("/login");
      return;
    }
    navigate("/orders", {
      state: {
        orderDetail: {
          id: product._id,
          pname: product.name,
          quantity: parseInt(qty, 10),
          price: Number(product.price),
        },
      },
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.warn("Please write a review before submitting");
      return;
    }
    if (!isLoggedIn) {
      toast.info("Please log in to leave a review");
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/product/review/${product._id}`, {
        content: reviewText.trim(),
      });
      const newReview = res.data?.productReview;
      setReviews((prev) => [
        ...prev,
        {
          _id: newReview?._id || Date.now().toString(),
          content: newReview?.comment || reviewText.trim(),
          user: newReview?.user || "You",
          createdAt: new Date().toISOString(),
        },
      ]);
      setReviewText("");
      toast.success("Review submitted. Thank you!");
    } catch {
      toast.error("Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const longDescription = product?.description?.longDescription || "";
  const shortDescription = product?.description?.shortDescription || "";
  const isLong = longDescription.length > 220;
  const visibleDesc = descExpanded ? longDescription : longDescription.slice(0, 220);

  const reviewSummary = useMemo(() => reviews.length, [reviews]);

  if (loading) return <FullPageLoader label="Loading product…" />;

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-bold text-navy-900">Product not found</h1>
        <p className="text-navy-500">
          This product may have been removed or the link is incorrect.
        </p>
        <Link to="/" className="btn-primary mt-2">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li className="flex items-center gap-1">
            <HomeIcon sx={{ fontSize: 16 }} />
            <Link to="/" className="transition hover:text-brand-600">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="flex items-center gap-1">
            <Link to="/" className="transition hover:text-brand-600">
              {product.category || "Boxing Gear"}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-navy-800">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-navy-50">
            <img
              src={product.coverImage || PLACEHOLDER}
              alt={product.name}
              width={800}
              height={800}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER;
              }}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        {/* Purchase panel */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {product.category || "Boxing Gear"}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-navy-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-4 text-sm text-navy-500">
            <span>{reviewSummary} reviews</span>
            <span aria-hidden>•</span>
            <span>{Number(product.views) || 0} views</span>
          </div>

          <p className="mt-4 leading-relaxed text-navy-600">{shortDescription}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-navy-900">
              {formatINR(product.price)}
            </span>
            {outOfStock ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                Out of stock
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                In stock ({product.stock})
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <span className="text-sm font-semibold text-navy-800">Quantity</span>
            <div className="mt-2 inline-flex items-center rounded-xl border border-navy-200">
              <button
                onClick={() => changeQty(-1)}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="px-4 py-2 text-lg font-semibold text-navy-700 transition hover:text-brand-600 disabled:opacity-40"
              >
                −
              </button>
              <input
                type="number"
                value={qty}
                min={1}
                max={maxQty}
                onChange={(e) =>
                  setQty(Math.min(maxQty, Math.max(1, Number(e.target.value) || 1)))
                }
                aria-label="Quantity"
                className="w-16 border-x border-navy-200 bg-transparent py-2 text-center font-semibold focus:outline-none"
              />
              <button
                onClick={() => changeQty(1)}
                disabled={qty >= maxQty}
                aria-label="Increase quantity"
                className="px-4 py-2 text-lg font-semibold text-navy-700 transition hover:text-brand-600 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addToCart}
              disabled={outOfStock}
              className="btn-primary flex-1 !py-3.5 text-base"
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={outOfStock}
              className="btn-secondary flex-1 !border-brand-600 !py-3.5 text-base !text-brand-700 hover:!bg-brand-50"
            >
              Buy Now
            </button>
          </div>

          {/* Perks */}
          <ul className="mt-8 grid gap-3 border-t border-navy-100 pt-6 sm:grid-cols-3">
            {perks.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-navy-600">
                <Icon sx={{ fontSize: 20, color: "#ea580c" }} />
                {label}
              </li>
            ))}
          </ul>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-navy-900">Description</h2>
            <p className="mt-2 leading-relaxed whitespace-pre-line text-navy-600">
              {visibleDesc}
              {isLong && !descExpanded ? "…" : ""}
            </p>
            {isLong && (
              <button
                onClick={() => setDescExpanded((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {descExpanded ? "Show less" : "Read more"}
                {descExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-navy-100 pt-10">
        <h2 className="font-display text-3xl tracking-wide text-navy-900">
          Customer Reviews
        </h2>

        {/* Review form */}
        <form onSubmit={submitReview} className="card mt-6 max-w-2xl p-6">
          <label htmlFor="review" className="text-sm font-semibold text-navy-800">
            Write a review
          </label>
          <textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            placeholder="Share your experience with this product…"
            className="input-base mt-2 resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-3"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>

        {/* Review list */}
        {reviews.length > 0 ? (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <li key={review._id} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {getInitials(review.user)}
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{review.user}</p>
                    <p className="text-xs text-navy-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 leading-relaxed text-navy-600">{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-navy-500">
            No reviews yet. Be the first to review this product.
          </p>
        )}
      </section>
    </div>
  );
}
