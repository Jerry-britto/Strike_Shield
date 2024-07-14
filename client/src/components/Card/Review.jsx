import React from "react";

export default function Review({ message = "Good Product", user = "jabba" }) {
  return (
    <div className="max-w-lg mx-auto bg-red-100 rounded-xl shadow-md overflow-hidden md:max-w-5xl my-4">
      <div className="p-6">
        <div className="uppercase tracking-wide text-lg text-indigo-500 font-semibold">
          {user}
        </div>
        <p className="mt-2 text-2xl text-center  text-gray-500">{message}</p>
      </div>
    </div>
  );
}
