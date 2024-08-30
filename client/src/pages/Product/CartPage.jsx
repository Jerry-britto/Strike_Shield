import React, { useState, useEffect } from "react";
import CartItem from "../../components/Card/CartItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";
import Loader from "../../components/Loader/Loader.jsx";

export default function CartPage() {
  const [data, setData] = useState([]);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [totalAmnt, setTotalAmt] = useState(50);
  const [loading, setIsLoading] = useState(true);

  const getCartDetails = async () => {
    try {
      const res = await Axios.get("http://localhost:8000/api/v1/cart/", {
        withCredentials: true,
      });
      const cartItems = res.data?.cart.items;

      setData(cartItems);
      setTotalAmt(Number(res.data?.cart.cartTotal));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user && user.length === 0) {
      navigate("/");
    } else {
      getCartDetails();

      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const deleteCartItem = async (_id) => {
    try {
      const res = await Axios.delete(
        `http://localhost:8000/api/v1/cart/item/${_id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("item is removed");
        setData((prev) => prev.filter((item) => item.product._id != _id));
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  const buyBulk = () => {
    let orders = [];
    data.forEach((item) =>
      orders.push({
        id: item.product._id,
        pname: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })
    );

    navigate("/orders", {
      state: {
        orderDetail: orders
      },
    });
    
  };

  return loading ? (
    <Loader className="min-h-screen" />
  ) : data.length > 0 ? (
    <div className="my-10 min-h-screen ">
      <div className="flex flex-wrap justify-center gap-8">
        <div>
          {data.map((ele) => (
            <CartItem
              key={ele.product._id}
              id={ele.product._id}
              name={ele.product.name}
              price={ele.product.price}
              quantity={ele.quantity}
              coverImage={ele.product.coverImage}
              onDelete={deleteCartItem}
            />
          ))}
        </div>
        <div>
          <div className="bg-white shadow-2xl rounded-xl p-8 w-full md:w-80">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-4">
                Cart Details
              </h2>
            </div>
            <div className="flex justify-between text-gray-700 mb-6">
              <span className="text-xl font-semibold">Total items:</span>
              <span className="text-xl font-semibold">{data.length}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="text-xl font-semibold">Total Cost</span>
              <span className="text-xl font-semibold">{totalAmnt}</span>
            </div>
            <button
              onClick={buyBulk}
              className="mt-8 text-2xl w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <h1 className="text-5xl flex justify-center items-center font-semibold min-h-screen">
      Empty Cart
    </h1>
  );
}
