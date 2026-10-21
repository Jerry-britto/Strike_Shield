import { useEffect, useState } from "react";
import Banner from "../../components/Home/Banner/Banner.jsx";
import Slide from "../../components/Home/Slide/Slide.jsx";
import Latest from "../../components/Home/Multi/Latest.jsx";
import { useDispatch } from "react-redux";
import Axios from "axios";
import { setProductsData } from "../../store/slice.js";

export default function Home() {
  const [products, setProducts] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const productDetails = await Axios.get(
          "http://localhost:8000/api/v1/product"
        );
        if (!isActive) return;
        const records = productDetails?.data || {};
        setProducts(records);
        dispatch(
          setProductsData(
            (records.higherViewProduct || []).concat(
              records.lowerViewProduct || []
            )
          )
        );
      } catch (error) {
        console.log(error.message);
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  return  (
    <div className="w-full min-h-screen bg-slate-200">
      <Banner />
      <Slide higherViewProducts={products.higherViewProduct} />
      <Latest lowerViewProducts={products.lowerViewProduct} />
    </div>
  );
}
