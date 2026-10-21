import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Home/Header/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import FullPageLoader from "../components/Loader/FullPageLoader.jsx";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Keeps the navbar/footer mounted while the route chunk loads. */}
        <Suspense fallback={<FullPageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
