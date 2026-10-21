import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader.jsx";
import api from "../../api/axios.js";

const initialForm = {
  id: "",
  name: "",
  price: "",
  stock: "",
  coverImage: "",
  shortDescription: "",
  longDescription: "",
};

export default function UpdateProduct() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Only send the fields the user actually filled in.
      const filtered = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== "")
      );
      const res = await api.patch(
        `/product/updateproduct/${filtered.id}`,
        filtered
      );
      if (res.status === 200) {
        toast.success("Product updated");
        setFormData(initialForm);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="card mx-auto max-w-2xl p-6">
      <h2 className="text-xl font-bold text-navy-900">Update Product</h2>
      <p className="mt-1 text-sm text-navy-500">
        Enter the product ID and only the fields you want to change.
      </p>

      <form onSubmit={handleSubmit} className="mt-5">
        <label className="text-sm font-semibold text-navy-800">
          Product ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleInputChange}
          required
          className="input-base mt-1.5 font-mono"
          placeholder="Enter product id"
        />

        <div className="mt-4">
          <label className="text-sm font-semibold text-navy-800">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-base mt-1.5"
            placeholder="New name"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-navy-800">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min={1}
              className="input-base mt-1.5"
              placeholder="780"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy-800">Stock</label>
            <input
              type="number"
              name="stock"
              min={1}
              value={formData.stock}
              onChange={handleInputChange}
              className="input-base mt-1.5"
              placeholder="100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold text-navy-800">
            Cover Image URL
          </label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleInputChange}
            className="input-base mt-1.5"
            placeholder="https://…"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-navy-800">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={3}
              className="input-base mt-1.5 resize-none"
              placeholder="One-liner"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy-800">
              Long Description
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              rows={3}
              className="input-base mt-1.5 resize-none"
              placeholder="Full description"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-6 w-full">
          Update Product
        </button>
      </form>
    </div>
  );
}
