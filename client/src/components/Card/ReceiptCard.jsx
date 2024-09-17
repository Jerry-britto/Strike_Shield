import React from "react";

export default function ReceiptCard({
  paymentId,
  orderDetails = [{}, {}],
  discountApplied,
  deliveryCost,
  finalAmount,
}) {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-red-600 to-orange-400 text-white p-6">
        <h2 className="text-2xl font-bold">Payment Receipt</h2>
        <p className="text-lg mt-2">
          Reference Number: {paymentId || "djfkdljfldjf"}
        </p>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Order Details</h3>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Product Name</th>
              <th className="border p-3 text-left">Price</th>
              <th className="border p-3 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item) => (
              <tr key={item.productData.id} className="border-t">
                <td className="border p-3">
                  {item.productData.name || "product name"}
                </td>
                <td className="border p-3">₹{item.productData.price || 3}</td>
                <td className="border p-3">{item.quantity || 55555553}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {discountApplied ? (
          <div className="flex justify-between text-gray-700 my-3">
            <span className="text-lg">Discount Applied:</span>
            <span className="text-lg">10%</span>
          </div>
        ) : (
          ""
        )}
        {deliveryCost ? (
          <div className="flex justify-between text-gray-700 mb-3">
            <span className="text-lg">Delivery Cost:</span>
            <span className="text-lg">₹50</span>
          </div>
        ) : (
          ""
        )}
        <div className="mt-6">
          <div className="flex justify-between text-gray-700 mb-3">
            <span className="text-lg">GST Applied:</span>
            <span className="text-lg">3%</span>
          </div>

          <div className="flex justify-between text-gray-900 font-bold text-xl mt-4">
            <span>Final Amount:</span>
            <span>₹{finalAmount || 5555550}</span>
          </div>
        </div>
      </div>

      <div className="bg-red-100  p-4 text-center">
        <p className="text-md font-bold text-green-900">Thank you for your purchase!</p>
      </div>
    </div>
  );
}
