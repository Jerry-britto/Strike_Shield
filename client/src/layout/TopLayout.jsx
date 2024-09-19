import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Home/Header/Navbar.jsx";

export default function TopLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}


