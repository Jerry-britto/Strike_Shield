import { Product } from "../models/product.model.js";
import products from "../utils/data.js";

// add product
export async function addProduct(req, res) {
  try {
    const {
      name,
      stock,
      price,
      description,
      category = "",
      owner = "",
      coverImage,
    } = req.body;
    console.log("adding product");

    console.log(req.body);

    if (
      [name, coverImage, stock, price].some(
        (ele) => ele.toString().trim() === ""
      ) &&
      !("shortDescription" in description && "longDescription" in obj)
    ) {
      throw Error("all fields are mandatory");
    }

    const newProduct = await Product.create({
      name,
      description,
      stock,
      price,
      coverImage,
      owner: owner === "" ? undefined : owner,
      category: category === "" ? undefined : category,
    });

    const savedProduct = await Product.findById(newProduct._id).select(
      "-owner"
    );

    if (!savedProduct) {
      return res.status(500).json({
        message: "Product not added",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ message: "New Product added", success: true, savedProduct });
  } catch (error) {
    console.log("Error occured due to ", error);
    return res.status(500).json({ message: error.message, success: false });
  }
}

// set default products
export async function setDefaultProduct(_, res) {
  try {
    await Product.deleteMany({})
      .then(() => console.log("Deleted old data"))
      .catch(function (err) {
        throw err;
      });

    const producsts = await Product.insertMany(products)
      .then(() => console.log("Inserted new data"))
      .catch(function (err) {
        throw err;
      });

    if (!products) {
      throw new Error("Products not inserted");
    }

    return res.status(200).json({
      message: "Data inserted successfully",
      success: true,
      producsts,
    });
  } catch (error) {
    console.log("Could not insert products ", error.message);
    return res
      .status(500)
      .json({ message: "Could not insert products", success: false });
  }
}

// get product by id
export async function getProductById(req, res) {
  try {
    const { pid } = req.params;

    if (!pid) {
      throw new Error("Product id is required");
    }

    const product = await Product.findById(pid).select("-owner");

    if (!product) {
      throw new Error("Product does not exist");
    }

    product.views += 1;

    await product.save();

    return res
      .status(200)
      .json({ message: "Product exists", product, success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
}

// get all products
export async function getAllProducts(_, res) {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      throw new Error("No Products found");
    }

    // Sort products by views in descending order (high to low)
    const higherViewProduct = [...products]
      .sort((a, b) => b.views - a.views)
      .splice(0, 4); // Take top 4 products with highest views

    // Sort products by views in ascending order (low to high) and pick top 4
    const lowerViewProduct = [...products]
      .sort((a, b) => a.views - b.views)
      .splice(0, 4).sort((a, b) => b.views - a.views)

    return res.status(200).json({
      message: "products data",
      success: true,
      allProducts: products,
      higherViewProduct,
      lowerViewProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

// search for product
export async function searchProduct(req, res) {
  try {
    const { searchInput } = req.query;

    if (!searchInput.trim()) {
      return res
        .status(406)
        .json({ message: "Kindly enter a valid search input", success: false });
    }
    const product = await Product.findOne({
      name: { $regex: new RegExp(searchInput, "i") },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: "Product exists",
      productId: product._id,
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Search failed", success: false });
  }
}

// update product details
export async function updateProduct(req, res) {
  try {
    const updatedProductData = req.body;
    const { pid } = req.params;

    // Check if any update data is provided
    if (!updatedProductData || !pid) {
      return res.status(400).json({
        message: "Updated details not found",
        success: false,
      });
    }

    const product = await Product.findById(pid);

    if (!product) {
      return res.status(400).json({
        message: "Product does not exist check product id",
        success: false,
      });
    }

    Object.keys(updatedProductData).forEach((key) => {
      if (key !== "shortDescription" && key !== "longDescription") {
        product[key] = updatedProductData[key];
      }
    });

    if (updatedProductData.shortDescription) {
      product.description = {
        ...product.description,
        shortDescription: updatedProductData.shortDescription,
      };
    }
    if (updatedProductData.longDescription) {
      product.description = {
        ...product.description,
        longDescription: updatedProductData.longDescription,
      };
    }

    await product.save();

    // Return success response
    return res.status(200).json({
      message: "Product updated successfully",
      product,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: "Could not update product",
      reason: error.message,
      success: false,
    });
  }
}

// remove product
export async function removeProduct(req, res) {
  try {
    const { pid } = req.params;
    if (!pid) {
      return res.status(400).json({
        message: "Kindly provide product id",
        success: false,
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(pid);

    if (!deletedProduct) {
      return res.status(500).json({
        message: "product not deleted",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Could not delete product",
      reason: error.message,
      success: false,
    });
  }
}

// get product data with sold quantity
export async function getProductDataAnalytic(_, res) {
  console.log("processing");

  const pipeline = [
    {
      $lookup: {
        from: "orderdetails",
        localField: "_id", 
        foreignField: "productId", 
        as: "orderDetails", 
      },
    },
    {
      $unwind: {
        path: "$orderDetails",
        preserveNullAndEmptyArrays: true, // Include products with no orders
      },
    },
    {
      $group: {
        _id: "$_id", // Product ID
        name: { $first: "$name" }, 
        price: { $first: "$price" }, 
        stock: { $first: "$stock" }, 
        totalQuantitySold: { $sum: "$orderDetails.quantity" }, 
      },
    },
    {
      $project: {
        _id: 1, 
        name: 1, 
        price: 1, 
        stock: 1, 
        totalQuantitySold: {
          $ifNull: ["$totalQuantitySold", 0], // If no sales, show 0
        },
      },
    },
    {
      $sort: { totalQuantitySold: -1 }, // Sort by quantity sold (optional)
    },
  ];

  try {
    // Run the aggregation pipeline
    const results = await Product.aggregate(pipeline);
    return res.json({ results });
  } catch (error) {
    console.error("Error during aggregation:", error);
    return res
      .status(500)
      .json({ message: "Aggregation failed", error: error.message });
  }
}
