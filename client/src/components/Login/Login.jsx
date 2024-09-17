import React, { useEffect, useState } from "react";
import logo from "../../assets/shopping.png";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Axios from "axios";
import { addUser } from "../../store/slice.js";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from '@mui/material/Checkbox';


export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const history = useNavigate();
  const dispath = useDispatch();
  const user = useSelector((state) => state.user);
  const [showPassword,setShowPassword] = useState(false);

  useEffect(()=>console.log(showPassword),[showPassword])

  useEffect(() => {
    if (user && user.length > 0) {
      history("/");
    }
  });

  const login = async (data) => {
    console.log(data);
    try {
      const res = await Axios.post(
        "http://localhost:8000/api/v1/user/login",
        data,
        { withCredentials: true }
      );
      console.log("response " + res);
      if (res.status === 200) {
        console.log("data received" + res);
        const { user } = res.data;
        console.log(user);
        dispath(addUser(user));
        history("/");
      }
    } catch (error) {
      console.log("Login failed due to " + error);
      toast.error("Login Fail, Please try again", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="grid grid-col-1 lg:grid-cols-2 min-h-screen">
      <div className="col-span-1 min-h-screen hidden lg:flex lg:flex-col lg:justify-center lg:my-2 lg:items-center">
        <img src={logo} alt="Logo" className="mix-blend-multiply" />
      </div>

      <div className="col-span-1 min-h-screen box-border flex flex-col justify-center items-center mb-10 bg-slate-100">
        <div className="shadow-2xl flex flex-col py-20 px-8 mx-5 lg:p-16 items-center justify-around bg-red-100 rounded-3xl">
          <h1 className="font-bold text-4xl mb-2 italic">
            {" "}
            <span className="text-orange-600">Welcome</span> Back
          </h1>
          <form method="POST" onSubmit={handleSubmit(login)}>
            <input
              type="email"
              className="p-2 rounded-lg w-full my-2"
              placeholder="Enter Email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-500 my-1 text-sm">
                Email is required
              </span>
            )}
            <input
              type={`${!showPassword?"password":"text"}`}
              className="p-2 rounded-lg w-full"
              placeholder="Enter Password"
              {...register("password", { required: true })}
            />
           
            {errors.password && (
              <span className="text-red-500 text-sm my-1">
                Password is required
              </span>
            )}
              <label htmlFor="passFor">
            <span>

            <Checkbox id="passFor" onChange={(e)=>setShowPassword(e.target.checked)} value={showPassword}/>
            Show Password
            </span>
              </label>

            <button className="bg-orange-600 text-white font-bold p-2 rounded-md w-full my-4 text-2xl">
              Login
            </button>
          </form>

          <p className="text-lg font-semibold mt-6">
            New User{" "}
            <NavLink
              to={"/register"}
              className="hover:underline hover:cursor-pointer text-blue-600"
            >
              Sign up
            </NavLink>
          </p>
          <p className="text-lg mt-4">
            Visit{" "}
            <NavLink to={"/"} className={"text-blue-600 hover:text-orange-500"}>
              Home
            </NavLink>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
