import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader.jsx";
import api from "../../api/axios.js";

const initialForm = {
  name: "",
  price: "",
  stock: "",
  coverImage: "",
  shortDescription: "",
  longDescription: "",
};

export default function AddProduct() {
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
      const reqBody = {
        name: formData.name,
        price: formData.price,
        stock: formData.stock,
        coverImage: formData.coverImage,
        description: {
          shortDescription: formData.shortDescription,
          longDescription: formData.longDescription,
        },
      };
      const res = await api.post("/product/addproduct", reqBody);
      if (res.status === 200) {
        toast.success("Product added to inventory");
        setFormData(initialForm);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="card mx-auto max-w-2xl p-6">
      <h2 className="text-xl font-bold text-navy-900">Add a New Product</h2>
      <p className="mt-1 text-sm text-navy-500">
        Fill in the details below to add an item to the catalog.
      </p>

      <form onSubmit={handleSubmit} className="mt-5">
        <label className="text-sm font-semibold text-navy-800">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="input-base mt-1.5"
          placeholder="e.g. ThunderStrike Pro Gloves"
        />

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-navy-800">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min={1}
              required
              className="input-base mt-1.5"
              placeholder="780"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy-800">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min={1}
              required
              className="input-base mt-1.5"
              placeholder="100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold text-navy-800">
            Cover Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleInputChange}
            required
            className="input-base mt-1.5"
            placeholder="https://…"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-navy-800">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              required
              rows={3}
              className="input-base mt-1.5 resize-none"
              placeholder="One-liner shown on cards"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-navy-800">
              Long Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              required
              rows={3}
              className="input-base mt-1.5 resize-none"
              placeholder="Full product description"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-6 w-full">
          Add Product
        </button>
      </form>
    </div>
  );
}
