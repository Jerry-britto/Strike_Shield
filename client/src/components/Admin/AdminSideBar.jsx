import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { removeUser } from "../../store/slice.js";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ changePage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    let name = user[0].first_name + " " + user[0].last_name;
    setAdminName(name);
  });

  const logout = async () => {
    console.log("logout");
    try {
      const res = await Axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      // console.log(res);

      if (res.status >= 200 && res.status <= 300) {
        dispatch(removeUser());

        toast.success("Logged out successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/");
      }
    } catch (error) {
      console.log("could not logout due to ", error.message);
      toast.error("Could not logout please try again", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-6 flex-1">
        <h1 className="text-3xl font-bold italic">Welcome</h1>
        <h2 className="mb-6 font-semibold text-lg">{adminName}</h2>
        <ul className="space-y-2">
          <li>
            <div
              onClick={() => changePage(1)}
              to="/admin/dashboard"
              className="cursor-pointer block py-2 px-4 rounded font-semibold hover:bg-gray-600"
            >
              Dashboard
            </div>
          </li>
          <li>
            <div
              onClick={() => changePage(2)}
              to="/admin/inventory"
              className="cursor-pointer block py-2 px-4 rounded font-semibold hover:bg-gray-600"
            >
              Inventory
            </div>
          </li>
           <li>
            <div
              onClick={() => changePage(3)}
              to="/admin/customer"
              className="cursor-pointer block py-2 px-4 rounded font-semibold hover:bg-gray-600"
            >
              User Management
            </div>
          </li>
          <li>
          <button
          onClick={logout}
          className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
        >
          Logout
        </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
