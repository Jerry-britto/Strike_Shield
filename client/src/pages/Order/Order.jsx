import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../../api/axios.js";
import { modifyUserTokens, setCartCount } from "../../store/slice.js";
import OrderCard from "../../components/Card/OrderCard.jsx";
import FullPageLoader from "../../components/Loader/FullPageLoader.jsx";
import { formatINR } from "../../utils/format.js";

const STORAGE_KEY = "strikeship_order_draft";

const GST_RATE = 0.03;
const BULK_RATE = 0.1;
const BULK_THRESHOLD = 10;
const DELIVERY_FEE = 50;
const FREE_DELIVERY_MIN = 500;

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Prefer live router state; fall back to sessionStorage so a page refresh
  // doesn't silently throw the user back to the homepage.
  const [orderDetail] = useState(() => {
    const fromState = location.state?.orderDetail;
    if (fromState) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromState));
      return fromState;
    }
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [eligibleForTokens, setEligibleForTokens] = useState(true);
  const [retryDuration, setRetryDuration] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!orderDetail) {
      navigate("/carts", { replace: true });
    }
  }, [orderDetail, navigate]);

  useEffect(() => {
    if (showTokenDialog && dialogRef.current) dialogRef.current.focus();
  }, [showTokenDialog]);

  // Cost breakdown
  const { items, itemCount, subtotal } = React.useMemo(() => {
    if (!orderDetail) return { items: [], itemCount: 0, subtotal: 0 };
    const list = Array.isArray(orderDetail) ? orderDetail : [orderDetail];
    const count = list.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    const sub = list.reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0
    );
    return { items: list, itemCount: count, subtotal: sub };
  }, [orderDetail]);

  const gstAmount = subtotal * GST_RATE;
  const bulkDiscount = itemCount >= BULK_THRESHOLD ? subtotal * BULK_RATE : 0;
  const deliveryFee = subtotal < FREE_DELIVERY_MIN ? DELIVERY_FEE : 0;
  const finalTotal = subtotal + gstAmount - bulkDiscount + deliveryFee;

  const handleClose = () => {
    setShowTokenDialog(false);
    setEmail("");
    setPassword("");
  };

  const handleAdditionTokens = async () => {
    if (!email || !password) {
      toast.warn("Kindly fill in your credentials");
      return;
    }
    try {
      const res = await api.post("/user/gettokens", { email, password });
      if (res.status === 200) {
        toast.success("Additional tokens added to your account!");
        handleClose();
        dispatch(modifyUserTokens(-5000));
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Could not add tokens. Try again.";
      toast.warn(msg);
      if (error.response?.status === 406) {
        setEligibleForTokens(error.response?.data?.validUserDialog);
        setRetryDuration(error.response?.data?.duration || 0);
      }
    }
  };

  const performPayment = async () => {
    setIsProcessing(true);
    try {
      const paymentDetail = items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
      }));

      const orderRequest = await api.post("/orders/addorder", {
        products: paymentDetail,
      });

      if (orderRequest.status === 200) {
        try {
          const payment = await api.post(
            `/orders/payment/${orderRequest.data?.paymentId}`,
            {}
          );
          if (payment.status === 200) {
            dispatch(modifyUserTokens(payment.data.receipt.totalCost));
            // Server empties the cart on successful payment.
            dispatch(setCartCount(0));
            sessionStorage.removeItem(STORAGE_KEY);
            navigate("/receipt", { state: payment.data?.receipt });
          }
        } catch (paymentError) {
          if (paymentError.response?.status === 406) {
            await api.delete(
              `/orders/clearorder/${orderRequest.data?.orderId}`
            );
            setEligibleForTokens(paymentError.response?.data?.validUserDialog);
            setRetryDuration(paymentError.response?.data?.duration || 0);
            setShowTokenDialog(true);
          } else {
            toast.error("Payment could not be completed");
          }
        }
      }
    } catch (orderError) {
      if (orderError.response?.status === 409) {
        toast.error(
          `Not enough stock for ${orderError.response.data?.pname}.`
        );
      } else {
        toast.error("Could not place the order. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderDetail) return null;
  if (isProcessing) return <FullPageLoader label="Processing your order…" />;

  return (
    <div className="min-h-screen bg-navy-50 py-10">
      <div className="container-page">
        <h1 className="text-center font-display text-4xl tracking-wide text-navy-900 sm:text-5xl">
          Order Summary
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          {/* Items */}
          <div className="lg:col-span-3">
            <h2 className="mb-3 text-lg font-bold text-navy-900">
              Items in your order
            </h2>
            <OrderCard items={items} />
          </div>

          {/* Payment details */}
          <aside className="lg:col-span-2">
            <div className="card p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-navy-900">
                Payment Details
              </h2>

              <dl className="mt-4 space-y-3 text-navy-700">
                <div className="flex justify-between">
                  <dt>Subtotal ({itemCount} items)</dt>
                  <dd className="font-semibold">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>GST (3%)</dt>
                  <dd className="font-semibold">{formatINR(gstAmount)}</dd>
                </div>
                {bulkDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>Bulk discount (10%)</dt>
                    <dd className="font-semibold">−{formatINR(bulkDiscount)}</dd>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <dt>Delivery charge</dt>
                    <dd className="font-semibold">{formatINR(deliveryFee)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
                <span className="text-lg font-bold text-navy-900">
                  Final Amount
                </span>
                <span className="text-2xl font-extrabold text-navy-900">
                  {formatINR(finalTotal)}
                </span>
              </div>

              {deliveryFee > 0 && (
                <p className="mt-2 text-xs text-navy-500">
                  Spend {formatINR(FREE_DELIVERY_MIN - subtotal)} more for free
                  delivery.
                </p>
              )}

              <button
                onClick={performPayment}
                className="btn-primary mt-5 w-full !py-3.5 text-base"
              >
                Proceed to checkout
              </button>
              <button
                onClick={() => navigate("/carts")}
                className="mt-3 w-full text-center text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Back to cart
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Out-of-tokens dialog */}
      <Dialog
        open={showTokenDialog}
        onClose={handleClose}
        aria-labelledby="token-dialog-title"
      >
        <DialogTitle id="token-dialog-title" ref={dialogRef} tabIndex={-1}>
          {eligibleForTokens ? "Out of Tokens" : "Not Eligible Yet"}
        </DialogTitle>
        <DialogContent dividers>
          {eligibleForTokens ? (
            <div className="mx-auto max-w-sm">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-600">
                <CheckCircleIcon fontSize="small" />
                You can top up 5,000 tokens. Available once every 5 days.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="input-base mb-3"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-base"
              />
              <button
                onClick={handleAdditionTokens}
                className="btn-primary mt-4 w-full"
              >
                Add Tokens
              </button>
            </div>
          ) : (
            <DialogContentText>
              {`You are not eligible for additional tokens for another ${
                retryDuration || 1
              } day(s).`}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
