import React from "react";

export default function CartItem({
  name = "A Wonderful product",
  qty = 1,
  price = 20.23,
  onChange = function(){},
  coverImage = "https://anthonyjoshua.com/cdn/shop/articles/AJ_Fight_Insta_1.png?v=1662478898",
}) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex my-8 p-4">
      <div className="flex-shrink-0">
        <img className="h-24 w-24 object-cover" src={coverImage} alt={name} />
      </div>
      <div className="ml-4 flex-grow">
        <h2 className="text-2xl font-bold text-gray-700">{name}</h2>
        <div className="flex items-center mt-2">
          <span className="text-gray-600 text-xl font-semibold">
            ${price.toFixed(2)}
          </span>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={onChange}
            className="ml-4 w-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
