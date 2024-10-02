import Home from "./pages/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Layout from "./layout/Layout.jsx";
import CartPage from "./pages/Product/CartPage.jsx";
import ViewProduct from "./pages/Product/ViewProduct.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Admin from "./pages/Home/Admin.jsx";
import NotFound from "./components/404/NotFound.jsx";
import Order from "./pages/Order/Order.jsx";
import InvoicePage from "./pages/Order/InvoicePage.jsx";
import PaymentHistory from "./pages/Order/PaymentHistory.jsx";
import TopLayout from "./layout/TopLayout.jsx";
import Contact from "./pages/Home/Contact.jsx";
import About from "./pages/Home/About.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route> 

      <Route path="/contact" element={<Layout />}>
        <Route index element={<Contact />} />
      </Route> 

      <Route path="/about" element={<Layout />}>
        <Route index element={<About   />} />
      </Route>

      <Route path="/admin" element={<Admin />} />

      <Route path="/carts" element={<TopLayout />}>
        <Route index element={<CartPage />} />
      </Route>

      <Route element={<TopLayout />}>
        <Route path="/receipt" element={<InvoicePage />} />
      </Route>

      <Route path="/product/:pid" element={<ViewProduct />} />

      <Route path="/paymenthistory" index element={<PaymentHistory />} />

      <Route element={<TopLayout/>}>
      <Route path="/orders" element={<Order />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
