import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import api from "../../api/axios.js";
import { setCartCount } from "../../store/slice.js";
import CartItem from "../../components/Card/CartItem.jsx";
import { ListSkeleton } from "../../components/Loader/Skeletons.jsx";
import { formatINR } from "../../utils/format.js";

const BULK_THRESHOLD = 10;
const BULK_DISCOUNT = 0.1;

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = user && user.length > 0;

  const applyServerTotal = (cart) => {
    setTotal(Number(cart?.cartTotal) || 0);
  };

  const syncBadge = useCallback(
    (list) => {
      const count = list.reduce((sum, i) => sum + (i?.quantity || 0), 0);
      dispatch(setCartCount(count));
    },
    [dispatch]
  );

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      const rawItems = res.data?.cart?.items || [];
      // The aggregation returns product: null for products deleted from the
      // catalog; filter those out so they don't crash the page.
      const validItems = rawItems.filter((item) => item?.product);
      setItems(validItems);
      applyServerTotal(res.data?.cart);
      syncBadge(validItems);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, [syncBadge]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    fetchCart();
  }, [isLoggedIn, navigate, fetchCart]);

  const updateQuantity = async (id, newQty) => {
    const item = items.find((i) => i.product._id === id);
    if (!item) return;
    const current = item.quantity;
    const delta = newQty - current;
    if (delta === 0) return;

    // Optimistic update for a snappy feel.
    const prevItems = items;
    setItems((prev) =>
      prev.map((i) => (i.product._id === id ? { ...i, quantity: newQty } : i))
    );
    setUpdating(true);
    try {
      // Positive delta adds, negative delta removes (desc flag).
      await api.post(`/cart/item/${id}`, {
        quantity: Math.abs(delta),
        desc: delta < 0,
      });
      // Re-fetch to get the authoritative total.
      await fetchCart();
    } catch {
      setItems(prevItems); // roll back
      toast.error("Could not update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const deleteItem = async (id) => {
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.product._id !== id));
    try {
      const res = await api.delete(`/cart/item/${id}`);
      if (res.status === 200 && res.data?.success !== false) {
        const next = items.filter((i) => i.product._id !== id);
        setTotal(next.reduce((sum, i) => sum + i.product.price * i.quantity, 0));
        syncBadge(next);
        toast.success("Removed from cart");
      } else {
        throw new Error("Delete failed");
      }
    } catch {
      setItems(prevItems); // roll back
      toast.error("Could not remove item");
    }
  };

  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  const qualifiesBulk = totalUnits >= BULK_THRESHOLD;
  const bulkSavings = qualifiesBulk ? total * BULK_DISCOUNT : 0;
  const remainingForBulk = Math.max(0, BULK_THRESHOLD - totalUnits);

  const buyNow = () => {
    if (items.length === 0) return;
    navigate("/orders", {
      state: {
        orderDetail: items.map((item) => ({
          id: item.product._id,
          pname: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    });
  };

  if (loading) {
    return (
      <div className="container-page py-10">
        <h1 className="mb-6 font-display text-4xl tracking-wide text-navy-900">
          Your Cart
        </h1>
        <ListSkeleton rows={4} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-navy-100">
          <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
        </span>
        <h1 className="text-3xl font-bold text-navy-900">Your cart is empty</h1>
        <p className="max-w-sm text-navy-500">
          Looks like you haven&apos;t added anything yet. Explore our gear and
          start building your kit.
        </p>
        <Link to="/" className="btn-primary mt-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-2 font-display text-4xl tracking-wide text-navy-900">
        Your Cart
      </h1>
      <p className="mb-8 text-navy-500">
        {items.length} {items.length === 1 ? "item" : "items"} · {totalUnits} units
      </p>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.product._id}
              id={item.product._id}
              name={item.product.name}
              price={item.product.price}
              quantity={item.quantity}
              coverImage={item.product.coverImage}
              onQuantityChange={updateQuantity}
              onDelete={deleteItem}
            />
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-navy-900">Order Summary</h2>

            <dl className="mt-4 space-y-3 text-navy-700">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-semibold">{formatINR(total)}</dd>
              </div>
              <div className="flex justify-between text-sm text-navy-500">
                <dt>Shipping</dt>
                <dd>{total >= 500 ? "Free" : "Calculated at checkout"}</dd>
              </div>
              {qualifiesBulk && (
                <div className="flex justify-between text-green-600">
                  <dt className="flex items-center gap-1">
                    <LocalOfferIcon sx={{ fontSize: 16 }} /> Bulk discount (10%)
                  </dt>
                  <dd className="font-semibold">−{formatINR(bulkSavings)}</dd>
                </div>
              )}
            </dl>

            {/* Bulk discount nudge */}
            {!qualifiesBulk && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-800">
                <LocalOfferIcon sx={{ fontSize: 18, color: "#ea580c" }} />
                <p>
                  Add <span className="font-bold">{remainingForBulk} more</span>{" "}
                  {remainingForBulk === 1 ? "item" : "items"} to unlock a{" "}
                  <span className="font-bold">10% bulk discount</span>.
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
              <span className="text-lg font-bold text-navy-900">Total</span>
              <span className="text-2xl font-extrabold text-navy-900">
                {formatINR(total)}
              </span>
            </div>

            <button
              onClick={buyNow}
              disabled={updating || items.length === 0}
              className="btn-primary mt-5 w-full !py-3.5 text-base"
            >
              {updating ? "Updating…" : "Proceed to Checkout"}
            </button>

            <Link
              to="/"
              className="mt-3 block text-center text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
