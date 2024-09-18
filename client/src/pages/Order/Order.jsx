import React, { useEffect, useState } from "react";
import OrderCard from "../../components/Card/OrderCard";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import Loader from "../../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { modifyUserTokens } from "../../store/slice.js";

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderDetail = location.state?.orderDetail;

  const [costOfProduct, setCostOfProduct] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isDeliveryCost, setIsDeliveryCost] = useState(false);
  const [discount, setIsDiscount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [isValid, setIsValid] = useState(true); // For determining token dialog visibility
  const [open, setOpen] = useState(false); // Controls scroll dialog visibility
  const descriptionElementRef = React.useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [duration,setDuration] = useState(0);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setShowDialog(false);
  };

  const handleAdditionTokens = async () => {
    try {
      if (email === "" || password === "") {
        toast.warn("kindly fill in your credentials", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }
      const res = await Axios.post(
        "http://localhost:8000/api/v1/user/gettokens",
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log(res.data.message);
        toast.success("congratulations for getting additional tokens", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          toast.dismiss(); // Dismiss all open toasts
        }, 2000);
        handleClose();
        dispatch(modifyUserTokens(-5000));
      }
    } catch (error) {
      console.log(error);
      if (error.response.status !== 200) {
        toast.warn(error.response.data.message || error.message, {
          autoClose: 3000,
          position: "top-center",
        });
        return;
      }
    }
  };

  const calculateSum = () => {
    let cost = 0,
      qty = 0;

    if (!Array.isArray(orderDetail)) {
      qty = orderDetail.quantity;
      cost = orderDetail.price * orderDetail.quantity;
    } else {
      for (let item of orderDetail) {
        cost += item.price * item.quantity;
        qty += item.quantity;
      }
    }

    let finalCost = cost;
    let gstCost = finalCost * 0.03;
    let discountedCost = 0;

    if (qty >= 10) {
      discountedCost = finalCost * 0.1; // 10% discount
      setIsDiscount(true);
    }

    finalCost += gstCost - discountedCost;

    if (finalCost < 500) {
      finalCost += 50; // Add delivery charge
      setIsDeliveryCost(true);
    }

    setCostOfProduct(cost);
    setTotalCost(finalCost);
  };

  useEffect(() => {
    if (orderDetail) calculateSum();
  }, [orderDetail]);

  const performPayment = async () => {
    setIsProcessing(true);

    try {
      let paymentDetail = !Array.isArray(orderDetail)
        ? [{ id: orderDetail.id, quantity: orderDetail.quantity }]
        : orderDetail;

      const orderRequest = await Axios.post(
        "http://localhost:8000/api/v1/orders/addorder",
        { products: paymentDetail },
        { withCredentials: true }
      );

      if (orderRequest.status === 200) {
        try {
          const payment = await Axios.post(
            `http://localhost:8000/api/v1/orders/payment/${orderRequest.data?.paymentId}`,
            {},
            { withCredentials: true }
          );

          if (payment.status === 200) {
            dispatch(modifyUserTokens(payment.data.receipt.totalCost));
            navigate("/receipt", { state: payment.data?.receipt });
          } else {
            console.log("Payment failed");
          }
        } catch (paymentError) {
          if (paymentError.response?.status === 406) {
            await Axios.delete(
              `http://localhost:8000/api/v1/orders/clearorder/${orderRequest.data?.orderId}`,
              { withCredentials: true }
            );
            console.log(paymentError.response?.data);

            setShowDialog(true);

            setIsValid(paymentError.response?.data.validUserDialog); // Indicates insufficient tokens
            setDuration(paymentError.response?.data.duration)
          }
        }
      }
    } catch (orderError) {
      if (orderError.response?.status === 409) {
        toast.error(
          `Product ${orderError.response.data.pname} is less in terms of quantity`,
          { position: "top-center", autoClose: 3000 }
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return isProcessing ? (
    <Loader />
  ) : (
    <>
      <ToastContainer />
      {/* Dialog for insufficient tokens, valid state */}
      {showDialog && isValid ? (
        <Dialog
          open={showDialog}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title" style={{ fontWeight: "bold" }}>
            Out of Tokens - Get Additional Tokens
          </DialogTitle>
          <DialogContent dividers ref={descriptionElementRef} tabIndex={-1}>
            <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
              <h5 className="text-red-500 text-sm font-semibold mb-4">
                Note: You won't be eligible for extra tokens for another five
                days after submission.
              </h5>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 ease-in-out"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full mb-6 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 ease-in-out"
              />
              <button
                onClick={handleAdditionTokens}
                className="w-full bg-orange-500 text-white font-semibold p-3 rounded-lg shadow hover:bg-orange-600 transition-all duration-200 ease-in-out"
              >
                Submit
              </button>
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {/* Dialog for insufficient tokens, invalid state */}
      {showDialog && !isValid ? (
        <Dialog
          open={showDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{ fontWeight: "bold" }}>
            Out of Tokens
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`You are not eligible for additional tokens for ${duration || 1} days`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {/* Main content */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen p-8">
        <h1 className="text-5xl font-extrabold text-center text-blue-900 mb-12 shadow-md py-4 bg-white rounded-lg">
          Order Summary
        </h1>
        <div className="flex flex-wrap justify-center items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Order Details */}
          <div className="flex flex-col w-full md:w-auto">
            <OrderCard items={orderDetail} />
          </div>

          {/* Cost Summary */}
          <div className="bg-white shadow-2xl rounded-xl p-8 w-full md:w-80">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-4">
              Payment Details
            </h2>
            <div className="flex justify-between text-gray-700 my-6">
              <span className="text-xl">Cost:</span>
              <span className="text-xl">₹{costOfProduct || 0}</span>
            </div>
            {isDeliveryCost && (
              <div className="flex justify-between text-gray-700 mb-6">
                <span className="text-xl">Delivery Charge:</span>
                <span className="text-xl">₹50</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700 mb-6">
              <span className="text-xl">GST:</span>
              <span className="text-xl">3%</span>
            </div>
            {discount && (
              <div className="flex justify-between text-gray-700 mb-6">
                <span className="text-xl">Discount:</span>
                <span className="text-xl">10%</span>
              </div>
            )}
            <div className="flex justify-between text-gray-900 font-bold border-t-2 pt-6">
              <span className="text-2xl">Final Amount:</span>
              <span className="text-2xl">₹{totalCost || 0}</span>
            </div>

            {/* Payment Button */}
            <button
              onClick={performPayment}
              className="mt-8 font-semibold text-xl w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300"
            >
              Procced to checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
