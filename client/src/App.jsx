import Home from "./pages/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Layout from "./Outlet/Layout.jsx";
import CartPage from "./pages/Product/CartPage.jsx";
import ViewProduct from "./pages/Product/ViewProduct.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="/carts" element={<Layout />}>
        <Route index element={<CartPage />} />
      </Route>

      <Route path="/product" element={<Layout />}>
        <Route index element={<ViewProduct />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
  // return <>
  // <CartPage/>
  // </>
}
