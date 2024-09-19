import { Outlet } from "react-router-dom";
import Header from "../components/Home/Header/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}


