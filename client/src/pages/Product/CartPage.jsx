import React, { useState, useEffect } from "react";
import CartItem from "../../components/Card/CartItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";

export default function CartPage() {
  const [data, setData] = useState([]);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [totalAmnt, setTotalAmt] = useState(50);

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
    }
  });

  const deleteCartItem = async (_id) => {
    try {
      // const updatedItems = data.filter(item=>item._id!=_id)
      const res = await Axios.delete(
        `http://localhost:8000/api/v1/cart/item/${_id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("item is removed");
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  return (
    <div className="my-10">
      <h1 className="text-4xl font-bold text-center">Your Cart</h1>
      <h2 className="text-3xl font-semibold text-center mt-2">{`Total Items : ${data.length}`}</h2>
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
      <div className="text-3xl  text-center font-semibold">
        {`Total Amount: ₹${totalAmnt}`}
      </div>
    </div>
  );
}

//   imageLink:
//     "https://t3.ftcdn.net/jpg/05/40/14/74/360_F_540147475_OcIoB8xl5mHXSglIwncqumokZ19hkmLp.jpg",
//   price: 200,
//   name: "Elite Boxing Gloves",
//   qty: 1,
// },
// {
//   imageLink:
//     "https://media.istockphoto.com/id/1250685727/vector/realistic-pairs-of-red-boxing-gloves.jpg?s=612x612&w=0&k=20&c=8_bpUgjGLFEy5WKkRMEaKmdpW9MRQFt6Z7wZ-Fq0MSY=",
//   price: 300,
//   name: "Champion Boxing Gloves",
//   qty: 200,
// },
// {
//   imageLink:
//     "https://anthonyjoshua.com/cdn/shop/articles/AJ_Fight_Insta_1.png?v=1662478898",
//   price: 500,
//   name: "Ultra Boxing Gloves",
//   qty: 5,
// },
// {
//   imageLink:
//     "https://c8.alamy.com/comp/E03GP9/red-boxing-gloves-isolated-on-white-background-E03GP9.jpg",
//   price: 450,
//   name: "Golden Boxing Gloves",
//   qty: 2,
// },
