import React, { useEffect, useState } from "react";
import OrderCard from "../../components/Card/OrderCard";
import { useLocation } from "react-router-dom";
import ReceiptCard from "../../components/Card/ReceiptCard";

export default function Order() {
  const location = useLocation();
  const orderDetail = location.state?.orderDetail;

  const [costOfProduct, setCostOfProduct] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isDeliveryCost, setIsDeliveryCost] = useState(false);
  const [discount, setIsDiscount] = useState(false);

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

    let gstCost = finalCost * 0.03
    let discountedCost = 0;

    // finalCost += finalCost * 0.03; // Adding 3% GST
    if (qty >= 10) {
      console.log('Discount applied');
      discountedCost = finalCost * 0.1; // 10% discount 
      setIsDiscount(true);
    } 

    finalCost += gstCost - discountedCost;

    if (finalCost < 500) {
      console.log('Delivery charges applied');
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

  return (
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
          <button className="mt-8 font-semibold text-xl w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300">
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* <ReceiptCard/> */}
    </div>
  );
}
