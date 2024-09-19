import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Axios from "axios";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messsage, setMessage] = useState("");

  const submitResponse = async () => {
    try {
      if ([name, email, messsage].some((ele) => ele.trim() === "")) {
        toast.warn("Kindly fill in all the information", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const res = await Axios.post(
        "http://localhost:8000/api/v1/user/sendfeedback/",
        { name, email, message:messsage },
        { withCredentials: true }
      );

      if (res.status === 200) {
        console.log(res.data);
        toast.success("Thank you for sharing your feedback", {
          position: "top-center",
          autoClose: 3000,
        });
        setName("")
        setEmail("")
        setMessage("")
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Response has not been submitted please try again",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <ToastContainer />
      <section className="text-gray-600 body-font relative w-full">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-white">
              Contact Us
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
              We'd love to hear from you! Kindly provide your feedback.
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto bg-white rounded-lg p-8 shadow-lg">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    name="name"
                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out shadow-sm"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out shadow-sm"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={messsage}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out shadow-sm"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  onClick={submitResponse}
                  className="flex mx-auto text-white bg-orange-500 border-0 py-3 px-10 focus:outline-none hover:bg-orange-600 rounded-lg text-lg transition-transform duration-200 transform hover:scale-105 shadow-md"
                >
                  Submit Response
                </button>
              </div>
              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-300 text-center">
                <a
                  href="mailto:contact@yourwebsite.com"
                  className="text-indigo-500"
                >
                  contact@yourwebsite.com
                </a>
                <p className="leading-normal my-5">
                  123 Main St.
                  <br />
                  City, State, 12345
                </p>
                <span className="inline-flex">
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.36 3.64a9 9 0 11-12.73 12.72 9 9 0 0112.73-12.72zm0 0L21 6"></path>
                    </svg>
                  </a>
                  <a className="ml-4 text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 8a6 6 0 00-12 0 6 6 0 0012 0zm0 0v12"></path>
                    </svg>
                  </a>
                  <a className="ml-4 text-gray-500">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4v16h16V4H4z"></path>
                    </svg>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
