import React from "react";

export default function OrderCard({ items }) {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <tr>
              <th className="py-5 px-10 text-left text-2xl font-bold">
                Product Name
              </th>
              <th className="py-5 px-10 text-left text-2xl font-bold">Price</th>
              <th className="py-5 px-10 text-left text-2xl font-bold">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-xl">
            {Array.isArray(items) ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-300"
                >
                  <td className="py-5 px-10 font-semibold">
                    {item.pname || "Product name"}
                  </td>
                  <td className="py-5 px-10 font-semibold">
                    ₹{item.price || 0}
                  </td>
                  <td className="py-5 px-10 font-semibold">
                    {item.quantity || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr
                key={items.id}
                className="border-b border-gray-200 hover:bg-gray-100 transition duration-300"
              >
                <td className="py-5 px-10 font-semibold">
                  {items.pname || "Product name"}
                </td>
                <td className="py-5 px-10 font-semibold">
                ₹{items.price || 0}
                </td>
                <td className="py-5 px-10 font-semibold">
                  {items.quantity || 0}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
