import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Loader/Loader.jsx";
import Axios from "axios";

export default function UpdateProduct() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    stock: "",
    coverImage: "",
    shortDescription: "",
    longDescription: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    try {
      setLoading(true);
      let filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== "")
      );
      console.log("request body data", filteredFormData);
      const res = await Axios.patch(
        `http://localhost:8000/api/v1/product/updateproduct/${filteredFormData.id}`,
        filteredFormData,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setFormData({
          id: "",
          name: "",
          price: "",
          stock: "",
          coverImage: "",
          shortDescription: "",
          longDescription: "",
        });
        console.log("product updated");
        setLoading(false);
        toast.success("Product updated in inventory", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to update product", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-6">Update Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Id <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product id"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>

        {/* Price and Stock (Grouped in a Row) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min={100}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              min={1}
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter stock quantity"
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter cover image URL"
          />
        </div>

        {/* Short and Long Description (Grouped in a Row) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Short description"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Description
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Long description"
            ></textarea>
          </div>
        </div>

        {/* Owner and Category (Grouped in a Row) */}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
