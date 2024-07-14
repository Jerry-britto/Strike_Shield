import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";

export const getCart = async (userId) => {
  const cartAggregation = await Cart.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        product: { $first: "$product" },
        quantity: "$items.quantity",
      },
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$$ROOT",
        },
        cartTotal: {
          $sum: {
            $multiply: ["$product.price", "$quantity"],
          },
        },
      },
    },
  ]);

  // Handle potential empty carts here
  if (cartAggregation.length === 0) {
    return {
      _id: null,
      items: [],
      cartTotal: 0,
    };
  }

  return cartAggregation[0];
};

export async function getUserCart(req, res) {
  try {
    console.log("user id " + req.user._id);
    const cart = await getCart(req.user?._id);
    if (!cart) {
      throw new Error("No cart exist");
    }
    return res.status(200).json({ message: "User Cart", success: true, cart });
  } catch (error) {
    return res.json({ message: error.message });
  }
}

export async function addOrUpdateCart(req, res) {
  try {
    // checking whether id is valid or provided
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      throw new Error("Invalid Product id");
    }

    // check if the product exists or not
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product does not exist");
    }

    // check if the quantity is less than or equal to the product stock

    if (quantity > product.stock) {
      throw new Error("Out of stock");
    }

    // check if the cart exist for the user already exists in the cart

    let cart = await Cart.findOne({ owner: req.user._id });

    if (!cart) {
      cart = new Cart({ owner: req.user.id });
    }

    // check if the product is already added to cart or not
    const addedProduct = cart.items?.find(
      (item) => item.productId.toString() === productId
    );

    if (addedProduct) {
      addedProduct.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    // reduce the stock of the product
    product.stock -= quantity;
    await product.save();

    await cart.save({ validateBeforeSave: true }); // save the cart

    const newCart = await getCart(req.user?._id);

    return res
      .status(200)
      .json({ message: "Added to cart", success: true, newCart });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message, success: false });
  }
}

export async function deleteCartItem(req, res) {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      throw new Error("Invalid Product id");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product does not exist");
    }
    // get the user's cart
    const cart = await Cart.findOne({ owner: req.user._id });
    console.log("\n\nCart - " + cart);
    console.log("\n\nproduct before minimizing stock ", product);

    // increment the current stock of the product
    const item = cart.items?.find(
      (ele) => ele.productId.toString() === productId
    );
    console.log(item.quantity);
    product.stock += item.quantity;

    console.log("\n\nproduct after minimizing stock ", product);

    const updatedCart = await Cart.findOneAndUpdate(
      {
        owner: req.user._id,
      },
      {
        $pull: {
          items: {
            productId: productId,
          },
        },
      },
      { new: true }
    );

    await product.save(); // save the updated stock of the product

    return res
      .status(200)
      .json({ message: "Remove cart item", success: true, updatedCart });
  } catch (error) {
    return res.json({
      message: "Could not delete cart item",
      problem: error.message,
      success: false,
    });
  }
}
