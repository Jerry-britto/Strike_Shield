import React, { useEffect, useState } from "react";
import OrderCard from "../../components/Card/OrderCard";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import Loader from "../../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetail = location.state?.orderDetail;

  const [costOfProduct, setCostOfProduct] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isDeliveryCost, setIsDeliveryCost] = useState(false);
  const [discount, setIsDiscount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateSum = () => {
    let cost = 0,
      qty = 0;

    if (!Array.isArray(orderDetail)) {
      qty = orderDetail.quantity;
      cost = orderDetail.price * orderDetail.quantity;
      console.log("one product");
    } else {
      for (let item of orderDetail) {
        cost += item.price * item.quantity;
        qty += item.quantity;
      }
    }

    let finalCost = cost;

    let gstCost = finalCost * 0.03;
    let discountedCost = 0;

    // finalCost += finalCost * 0.03; // Adding 3% GST
    if (qty >= 10) {
      console.log("Discount applied");
      discountedCost = finalCost * 0.1; // 10% discount
      setIsDiscount(true);
    }

    finalCost += gstCost - discountedCost;

    if (finalCost < 500) {
      console.log("Delivery charges applied");
      finalCost += 50; // Add delivery charge
      setIsDeliveryCost(true);
    }

    // Update states
    setCostOfProduct(cost);
    setTotalCost(finalCost);
  };

  useEffect(() => {
    if (orderDetail) console.log(orderDetail);
    calculateSum();
  }, [orderDetail]); // Depend on orderDetail to re-calculate when it changes

  // to process order and place payment
  const performPayment = async () => {
    setIsProcessing(true);

    try {
      let paymentDetail;
      if (!Array.isArray(orderDetail)) {
        paymentDetail = [
          {
            id: orderDetail.id,
            quantity: orderDetail.quantity,
          },
        ];
      } else {
        paymentDetail = orderDetail;
      }

      // First API call to add order
      try {
        const orderRequest = await Axios.post(
          "http://localhost:8000/api/v1/orders/addorder",
          { products: paymentDetail },
          { withCredentials: true } // Ensure cookies are sent
        );

        if (orderRequest.status === 200) {
          console.log("Order created successfully");
          console.log("Payment ID:", orderRequest.data.paymentId);

          // Second API call to process payment
          try {
            const payment = await Axios.post(
              `http://localhost:8000/api/v1/orders/payment/${orderRequest.data?.paymentId}`,
              {}, // Empty request body if not needed
              { withCredentials: true } // Ensure cookies are sent
            );

            if (payment.status === 200) {
              console.log("Payment processed successfully");
              navigate("/receipt", { state: payment.data?.receipt });
              console.log(payment.data?.receipt);
            } else {
              console.log("Payment failed");
            }
          } catch (paymentError) {
            console.error(
              "Error during payment:",
              paymentError.response?.data.message
            );

            if (paymentError.response?.status === 406) {
              toast.error("Insufficient tokens", {
                position: "top-center",
                autoClose: 3000,
              });
              console.log("Payment rejected, clearing the order");
              await Axios.delete(
                `http://localhost:8000/api/v1/orders/clearorder/${orderRequest.data?.orderId}`,
                { withCredentials: true } // Ensure cookies are sent
              );
              console.log("Order cleared in backend");
              console.log("catch block");
            } else {
              console.log("Unhandled payment error");
            }
          }
        } else {
          console.log(
            "Order creation failed with status:",
            orderRequest.status
          );
        }
      } catch (orderError) {
        console.error(
          "Error during order creation:",
          orderError.response?.data.message
        );
        if (orderError.response?.status === 409) {
          console.log(
            `Product ${orderError.response.data.pname} is less in terms of quantity`
          );
          toast.error(
            `Product ${orderError.response.data.pname} is less in terms of quantity`,
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
        } else {
          console.log("Unhandled order error");
        }
        console.error("Error reason:", orderError.response?.data.reason);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return isProcessing ? (
    <Loader />
  ) : (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen p-8">
      <h1 className="text-5xl font-extrabold text-center text-blue-900 mb-12 shadow-md py-4 bg-white rounded-lg">
        Order Summary
      </h1>

      <div className="flex flex-wrap justify-center items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Order Details */}
        <div className="flex flex-col w-full md:w-auto">
          <OrderCard items={orderDetail} />
        </div>

        {/* Cost Summary Card */}
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full md:w-80">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-4">
              Payment Details
            </h2>
          </div>
          <div className="flex justify-between text-gray-700 mb-6">
            <span className="text-xl">Cost:</span>
            <span className="text-xl">₹{costOfProduct || 0}</span>
          </div>
          {isDeliveryCost ? (
            <div className="flex justify-between text-gray-700 mb-6">
              <span className="text-xl">Delivery Charge:</span>
              <span className="text-xl">₹50</span>
            </div>
          ) : (
            ""
          )}
          <div className="flex justify-between text-gray-700 mb-6">
            <span className="text-xl">GST:</span>
            <span className="text-xl">3%</span>
          </div>
          {discount ? (
            <div className="flex justify-between text-gray-700 mb-6">
              <span className="text-xl">Discount:</span>
              <span className="text-xl">10%</span>
            </div>
          ) : (
            ""
          )}
          <div className="flex justify-between text-gray-900 font-bold border-t-2 pt-6">
            <span className="text-2xl">Final Amount:</span>
            <span className="text-2xl">₹{totalCost || 0}</span>
          </div>
          <button
            onClick={performPayment}
            className="mt-8 font-semibold text-xl w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
