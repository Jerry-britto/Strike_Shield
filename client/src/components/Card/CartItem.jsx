import React from "react";
import { Link } from "react-router-dom";

export default function CartItem({
  name = "",
  price = 0,
  quantity = 1,
  coverImage = "",
  id = "",
  onDelete = function () {},
}) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex my-8 p-4">
      <Link
        to={`/product/${id}`}
        className="flex-shrink-0 hover:border-2 hover:border-orange-300 hover:rounded-lg p-2 cursor-pointer"
      >
        <img className="h-24 w-24 object-cover" src={coverImage} alt={name} />
      </Link>
      <div className="ml-4 flex-grow">
        <h2 className="text-2xl font-bold text-gray-700">{name}</h2>
        <div className="flex items-center mt-2">
          <span className="text-gray-600 text-2xl font-semibold ">
            ₹{price.toFixed(2)}
          </span>
          <div className="text-xl mx-2 font-semibold">Quantity: {quantity}</div>
          <button className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
            Buy Now
          </button>
          <button
            className="bg-red-500 text-white p-2 ml-2 rounded-md"
            onClick={()=>onDelete(id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
