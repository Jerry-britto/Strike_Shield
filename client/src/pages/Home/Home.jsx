import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Banner from "../../components/Home/Banner/Banner.jsx";
import Slide from "../../components/Home/Slide/Slide.jsx";
import Latest from "../../components/Home/Multi/Latest.jsx";
import api from "../../api/axios.js";
import { setProductsData } from "../../store/slice.js";

export default function Home() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const res = await api.get("/product");
        if (!isActive) return;
        const records = res.data || {};
        setProducts(records);
        dispatch(
          setProductsData(
            (records.higherViewProduct || []).concat(records.lowerViewProduct || [])
          )
        );
      } catch (error) {
        console.log(error.message);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  return (
    <div className="w-full">
      <Banner />
      <Slide products={products.higherViewProduct} loading={loading} />
      <Latest products={products.lowerViewProduct} loading={loading} />
    </div>
  );
}
