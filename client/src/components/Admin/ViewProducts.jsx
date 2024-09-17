import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function ViewProducts() {
  const [data, setData] = useState([
    { id: "1", name: "Product A", price: 29.99, stock: 120, totalQuantitySold: 75 },
    { id: "2", name: "Product B", price: 39.99, stock: 80, totalQuantitySold: 45 },
    { id: "3", name: "Product C", price: 19.99, stock: 200, totalQuantitySold: 120 },
    { id: "4", name: "Product D", price: 49.99, stock: 60, totalQuantitySold: 30 },
  ]);
  const [searchInput, setSearchInput] = useState("");
  const [searchedProduct, setSearchedProduct] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() === "") {
      setSearchedProduct([]);
      return;
    }
    // Find the searched product
    const searchProduct = data.filter((item) =>
      item.name.toLowerCase().includes(searchInput.toLowerCase().trim())
    );

    setSearchedProduct(searchProduct);
  };

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
    <div>
      <form className="relative w-full" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-white w-full rounded-lg p-3 pr-20 border border-gray-300 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 ease-in-out"
          placeholder="Enter Product Name"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 bg-orange-400 text-white rounded-lg px-5 py-2 shadow hover:bg-orange-500 transition-all duration-200 ease-in-out font-bold"
        >
          Search
        </button>
      </form>

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
            {/* Display searched products */}
            {searchedProduct.length > 0
              ? searchedProduct.map((item) => (
                  <tr key={item.id} className="bg-orange-500 text-white">
                    <td className="px-6 py-4">{item._id}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{item.stock}</td>
                    <td className="px-6 py-4">{item.totalQuantitySold}</td>
                  </tr>
                ))
              : null}

            {/* Render the rest of the products */}
            {data
              .filter((item) => !searchedProduct.find((p) => p.id === item.id)) // Filter out the searched products
              .map((item, index) => (
                <tr
                  key={item?._id || index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{item?._id || index + 1}</td>
                  <td className="px-6 py-4">{item?.name || "item name"}</td>
                  <td className="px-6 py-4">${item?.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{item?.stock}</td>
                  <td className="px-6 py-4">{item?.totalQuantitySold}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
