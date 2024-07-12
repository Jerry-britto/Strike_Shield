import React, { useEffect, useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useSelector } from "react-redux";


export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    password: "",
    cpassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const user = useSelector(state=>state.user);
  const redirect = useNavigate()

  useEffect(()=>{
    if(user && user.length >0){
      redirect("/")
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true);
    setIsButtonDisabled(true);
    const {password,cpassword} = data;
    if (password !== cpassword) {
      console.log("dfd");
      toast.error("Your passwords are not matching", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsLoading(false);
      setIsButtonDisabled(false);
      return;
    }
    console.log("submission data" + data);
    let values = getValues();
    try {
      console.log("values before submitting", values);
      const res = await Axios.post(
        `http://localhost:8000/api/v1/user/register`,
        data
      );
      if (res.status === 200) {
        toast.success("User Registered succesfully", {
          position: "top-center",
          autoClose: 3000,
        });
        reset();
      }
      console.log("data sent after registration " + data);
      console.log("values after submitting", values);
      
      setIsLoading(false);
      setIsButtonDisabled(false);
    } catch (error) {
      console.log("Error occured due to " + error.message);
      toast.error("Signup failed, Please try again", {
        position: "top-center",
        autoClose: 3000,
      });
      reset();
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="bg-[url('https://img.freepik.com/free-photo/paper-shopping-bags-dark-background-top-view_169016-43743.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center">
      <div className=" relative flex flex-col items-center mx-auto backdrop-blur-sm bg-white/70 py-8 sm:p-12 rounded-2xl shadow-2xl">
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <CircularProgress size={"250px"} />
          </Box>
        )}

        <h1 className="text-3xl font-bold italic">
          {" "}
          <span className="text-orange-500">Create</span> an account
        </h1>
        <form method="POST" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <TextField
              type="text"
              {...register("first_name", {
                required: "First name is required",
              })}
              label="First Name"
              variant="outlined"
              helperText="Enter First Name"
              style={{ marginTop: 20, marginRight: 5 }}
            />
            <TextField
              type="text"
              {...register("last_name", { required: "Last name is required" })}
              label="Last Name"
              variant="outlined"
              helperText="Enter Last Name"
              style={{ marginTop: 20 }}
            />
          </div>
          <div>
            <div className="flex justify-between">
              {errors.first_name && (
                <span className="text-red-600">
                  {errors.first_name.message}
                </span>
              )}
              {errors.last_name && (
                <span className="text-red-600">{errors.last_name.message}</span>
              )}
            </div>
          </div>
          <div className="mt-4">
            <TextField
              {...register("email", {
                required: "Email is required",
                minLength: 3,
              })}
              type="email"
              label="Email"
              helperText="Enter Email"
              className="w-full"
              variant="outlined"
            />
            {errors.email && errors.email.type === "required" && (
              <p className="text-red-500 my-1">Email is required</p>
            )}
            {errors.email && errors.email.type === "minLength" && (
              <p className="text-red-500 my-1">
                Email must be at least 3 characters long
              </p>
            )}
          </div>
          <div className="mt-4">
            <TextField
              type="text"
              {...register("address", { required: "Address is required" })}
              label="Address"
              helperText="Enter Address"
              className="w-full"
              variant="outlined"
            />
            {errors.address && (
              <span className="text-red-600">{errors.address.message}</span>
            )}
          </div>
          <div>
            <TextField
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              label="Password"
              variant="outlined"
              helperText="Enter Password"
              style={{ marginTop: 20, marginRight: 5 }}
            />
            <TextField
              type="password"
              {...register("cpassword")}
              label="Confirm Password"
              variant="outlined"
              helperText="Confirm your password"
              style={{ marginTop: 20 }}
            />
          </div>
          {errors.password && errors.password.type === "required" && (
            <p className="text-red-500 my-1">Password is required</p>
          )}
          {errors.password && errors.password.type === "minLength" && (
            <p className="text-red-500 my-1">
              Password must be at least 6 characters long
            </p>
          )}
          <input
            type="submit"
            value="Register"
            disabled={isButtonDisabled}
            className="w-full bg-orange-500 p-4 rounded-xl text-black font-bold hover:text-white my-4 text-xl cursor-pointer shadow-lg"
          />
        </form>

        <p className="mt-4 text-lg">
          Already Registered -{" "}
          <NavLink
            to={"/login"}
            className="text-orange-600 underline cursor-pointer hover:text-blue-600"
          >
            Login
          </NavLink>
        </p>
        <p className="text-lg mt-4">
          Visit{" "}
          <NavLink to={"/"} className={"text-blue-600 hover:text-orange-500"}>
            Home
          </NavLink>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
