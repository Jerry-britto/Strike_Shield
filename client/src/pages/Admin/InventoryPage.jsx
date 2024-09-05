import React, { useState } from "react";
import AddProduct from "../../components/Admin/AddProduct";
import UpdateProduct from "../../components/Admin/UpdateProduct";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import Axios from "axios";
import ViewProducts from "../../components/Admin/ViewProducts";

function InventoryPage() {
  const [activeContent, setActiveContent] = useState("All Products");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to change content
  const handleContentChange = (content) => {
    setActiveContent(content);
  };

  // methods to delete product
  const handleInputChange = (e) => {
    setProductId(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log("Product ID Submitted of deleted item:", productId);
    try {
      setLoading(true);
      
      const res = await Axios.delete(
        `http://localhost:8000/api/v1/product/removeproduct/${productId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setProductId("")
        console.log("product deleted");
        setLoading(false);
        toast.success("Product Deleted from inventory", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to delete product", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="h-screen">
      {/* Left Block */}
      <ToastContainer />
      <div className="w-full bg-gray-100 ">
        <div className="flex justify-center ">
          <div
            onClick={() => handleContentChange("All Products")}
            className="p-4 w-3/4 bg-blue-500 text-white text-xl text-center font-bold cursor-pointer hover:bg-blue-600 transition duration-300"
          >
            All Products
          </div>
          <div
            onClick={() => handleContentChange("Add Product")}
            className="p-4 w-3/4 bg-green-500 text-white text-center text-xl font-bold cursor-pointer hover:bg-green-600 transition duration-300"
          >
            Add Product
          </div>
          <div
            onClick={() => handleContentChange("Update Item")}
            className="p-4 w-3/4 bg-yellow-500 text-white text-center text-xl font-bold cursor-pointer hover:bg-yellow-600 transition duration-300"
          >
            Update Item
          </div>
          <div
            onClick={() => handleContentChange("Delete Item")}
            className="p-4 w-3/4 bg-red-500 text-white text-center text-xl font-bold cursor-pointer hover:bg-red-600 transition duration-300"
          >
            Delete Item
          </div>
        </div>
        <hr className="bg-red-300" />
      </div>

      {/* Right Block */}
      <div className="w-full h-screen p-6 bg-gray-50">
        {activeContent === "All Products" && (
          <div>
            <ViewProducts/>
          </div>
        )}
        {activeContent === "Add Product" && (
          <div>
            <AddProduct />
          </div>
        )}
        {activeContent === "Update Item" && (
          <div>
            <UpdateProduct />
          </div>
        )}
        {activeContent === "Delete Item" &&
          (loading ? (
            <Loader />
          ) : (
            <div>
              <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Delete Item
                </h2>
                <form onSubmit={handleDelete}>
                  {/* Product ID */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="productId"
                      value={productId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product ID"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      SUBMIT
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default InventoryPage;
