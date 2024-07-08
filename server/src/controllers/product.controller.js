import { Product } from "../models/product.model.js";
import { uploadToFirebase } from "../utils/firebase_upload.js";
import products from "../utils/data.js";

// add product
export async function addProduct(req, res) {
  try {
    const checkPrivilege = req.user?.isAdmin;

    if (!checkPrivilege) {
      return res
        .status(400)
        .json({ message: "You are not a admin", success: false });
    }

    console.log(req.body);
    const { name, description, stock, price } = req.body;

    if ([name, description, stock, price].some((ele) => ele?.trim() === "")) {
      return res
        .status(400)
        .json({ message: "All fields are mandatory", success: false });
    }

    console.log(req.file);
    const { path, mimetype } = req.file;

    console.log(`Path ${path}`);
    console.log(`mime type ${mimetype}`);

    if (!path) {
      return res.status(400).json({
        message: "Kindly upload a cover image for this product",
        success: false,
      });
    }

    // console.log(process.env.CLOUDINARY_NAME)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    const coverImage = await uploadToFirebase(path, mimetype);

    if (!coverImage) {
      console.log(coverImage);
      return res.status(500).json({
        message: "cover image not uploaded",
        success: false,
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      stock,
      price,
      coverImage: coverImage,
    });

    const savedProduct = await Product.findById(newProduct._id).select(
      "-category -owner"
    );

    if (!savedProduct) {
      return res.status(500).json({
        message: "Product not added",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ message: "New Product added", success: true });
  } catch (error) {
    console.log("Error occured due to ", error);
  }
}

export async function setDefaultProduct(req, res) {
  try {
    await Product.deleteMany({})
      .then(() => console.log("Deleted old data"))
      .catch(function (err) {
        throw err;
      });

    await Product.insertMany(products)
      .then(() => console.log("Inserted new data"))
      .catch(function (err) {
        throw err;
      });

    return res
      .status(200)
      .json({ message: "Data inserted successfully", success: true });
      
  } catch (error) {
    console.log("Could not insert products ", error.message);
    return res
      .status(500)
      .json({ message: "Could not insert products", success: false });
  }
}
