import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Home/Header/Navbar.jsx";
import FullPageLoader from "../components/Loader/FullPageLoader.jsx";

export default function TopLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<FullPageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
