import { lazy, Suspense } from "react";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./layout/Layout.jsx";
import TopLayout from "./layout/TopLayout.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import FullPageLoader from "./components/Loader/FullPageLoader.jsx";

// Route-level code splitting: each page (and its heavy deps such as the admin
// charts or the PDF libs) is only downloaded when its route is visited. This
// keeps the initial bundle small and speeds up first paint.
//
// Suspense boundaries live INSIDE the router (wrapping the Outlet in the
// layouts, and around each standalone route) so the persistent chrome (navbar)
// stays mounted and only the changing content shows the loading state.
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Contact = lazy(() => import("./pages/Home/Contact.jsx"));
const About = lazy(() => import("./pages/Home/About.jsx"));
const Admin = lazy(() => import("./pages/Home/Admin.jsx"));
const CartPage = lazy(() => import("./pages/Product/CartPage.jsx"));
const ViewProduct = lazy(() => import("./pages/Product/ViewProduct.jsx"));
const InvoicePage = lazy(() => import("./pages/Order/InvoicePage.jsx"));
const PaymentHistory = lazy(() => import("./pages/Order/PaymentHistory.jsx"));
const Order = lazy(() => import("./pages/Order/Order.jsx"));
const Login = lazy(() => import("./components/Login/Login.jsx"));
const Register = lazy(() => import("./components/Register/Register.jsx"));
const NotFound = lazy(() => import("./components/404/NotFound.jsx"));

// Small helper to give standalone routes their own Suspense boundary.
function Standalone({ children }) {
  return <Suspense fallback={<FullPageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="product/:pid" element={<ViewProduct />} />
      </Route>

      <Route
        path="/admin"
        element={
          <Standalone>
            <Admin />
          </Standalone>
        }
      />

      <Route element={<TopLayout />}>
        <Route path="/carts" element={<CartPage />} />
        <Route path="/receipt" element={<InvoicePage />} />
        <Route path="/paymenthistory" element={<PaymentHistory />} />
        <Route path="/orders" element={<Order />} />
      </Route>

      <Route
        path="/login"
        element={
          <Standalone>
            <Login />
          </Standalone>
        }
      />
      <Route
        path="/register"
        element={
          <Standalone>
            <Register />
          </Standalone>
        }
      />

      <Route
        path="*"
        element={
          <Standalone>
            <NotFound />
          </Standalone>
        }
      />
    </>
  )
);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </ErrorBoundary>
  );
}
