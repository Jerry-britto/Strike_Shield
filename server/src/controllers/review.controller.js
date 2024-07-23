import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

// add a review
export async function addReview(req, res) {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      throw new Error("Product id is not provided or invalid");
    }

    if (!content) {
      throw new Error("Kindly provide your review");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product does not exist");
    }

    // create a new review
    const review = await Review.create({
      user: req.user?.first_name + " " + req.user.last_name,
      product: product._id,
      content,
    });

    const getReview = await Review.findById(review._id);

    if (!getReview) {
      throw Error("Review was not updated to db");
    }

    return res.status(200).json({
      message: "Added review",
      success: true,
      productReview: {
        user: req.user.first_name + " " + req.user.last_name,
        comment: review.content,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      message: "Could not add review",
      problem: error.message,
      success: false,
    });
  }
}

// get reviews
export async function getReviewsOfProduct(req, res) {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      throw new Error("Product id is not provided or invalid");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product does not exist");
    }

    const getReviews = await Review.find({ product: productId });

    if (!getReviews) {
      return res
        .status(201)
        .json({ message: "No reviews for the product are available" });
    }

    return res
      .status(200)
      .json({
        message: "Reviews retrieved",
        success: true,
        reviews: getReviews,
      });
      
  } catch (error) {
    return res.json({
      message: "Could not get reviews for the product",
      problem: error.message,
      success: false,
    });
  }
}
