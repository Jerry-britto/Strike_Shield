import React, { useEffect, useState } from "react";
import Axios from "axios";
export default function ViewProducts() {
  const [data, setData] = useState([
    { id: "1", name: "Product A", price: 29.99, stock: 120, quantitySold: 75 },
    { id: "2", name: "Product B", price: 39.99, stock: 80, quantitySold: 45 },
    { id: "3", name: "Product C", price: 19.99, stock: 200, quantitySold: 120 },
    { id: "4", name: "Product D", price: 49.99, stock: 60, quantitySold: 30 },
  ]);

  const getData = async () => {
    try {
      const res = await Axios.get(
        "http://localhost:8000/api/v1/admin/productanalytics/",
        { withCredentials: true }
      );
      if (res.status === 200) {
        setData(res.data.results);
        console.log("received data ", data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="overflow-x-auto mt-6 p-4 bg-gradient-to-r from-orange-200 via-red-300 to-pink-300 rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200 text-left">
            <th className="px-6 py-3 text-gray-700 font-semibold text-sm uppercase tracking-wider">
              Product ID
            </th>
            <th className="px-6 py-3 text-gray-700 font-semibold text-sm uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-gray-700 font-semibold text-sm uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-gray-700 font-semibold text-sm uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-gray-700 font-semibold text-sm uppercase tracking-wider">
              Quantity Sold
            </th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item, index) => (
            <tr
              key={item?._id || index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-gray-700">
                {item?._id || index + 1}
              </td>
              <td className="px-6 py-4 text-gray-700">
                {item?.name || "item name"}
              </td>
              <td className="px-6 py-4 text-gray-700">
                {item?.price.toFixed(2) || 555}
              </td>
              <td className="px-6 py-4 text-gray-700">{item?.stock || 55}</td>
              <td className="px-6 py-4 text-gray-700">
                {item?.totalQuantitySold || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
