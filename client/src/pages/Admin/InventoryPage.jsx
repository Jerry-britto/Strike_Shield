import { useState } from "react";
import { toast } from "react-toastify";
import AddProduct from "../../components/Admin/AddProduct.jsx";
import UpdateProduct from "../../components/Admin/UpdateProduct.jsx";
import ViewProducts from "../../components/Admin/ViewProducts.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import api from "../../api/axios.js";

const TABS = ["All Products", "Add Product", "Update Item", "Delete Item"];

function InventoryPage() {
  const [activeContent, setActiveContent] = useState("All Products");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.delete(`/product/removeproduct/${productId}`);
      if (res.status === 200) {
        setProductId("");
        toast.success("Product deleted from inventory");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Inventory</h1>

      {/* Themed tabs */}
      <div
        role="tablist"
        aria-label="Inventory sections"
        className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-card"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeContent === tab}
            onClick={() => setActiveContent(tab)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeContent === tab
                ? "bg-brand-600 text-white shadow"
                : "text-navy-600 hover:bg-navy-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeContent === "All Products" && <ViewProducts />}
        {activeContent === "Add Product" && <AddProduct />}
        {activeContent === "Update Item" && <UpdateProduct />}
        {activeContent === "Delete Item" &&
          (loading ? (
            <Loader />
          ) : (
            <div className="card mx-auto max-w-md p-6">
              <h2 className="text-xl font-bold text-navy-900">Delete Item</h2>
              <p className="mt-1 text-sm text-navy-500">
                This permanently removes the product from the catalog.
              </p>
              <form onSubmit={handleDelete} className="mt-5">
                <label
                  htmlFor="deleteId"
                  className="text-sm font-semibold text-navy-800"
                >
                  Product ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="deleteId"
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="input-base mt-1.5"
                  placeholder="Enter product ID"
                />
                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Delete Product
                </button>
              </form>
            </div>
          ))}
      </div>
    </div>
  );
}

export default InventoryPage;
