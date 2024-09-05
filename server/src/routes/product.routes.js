import { Router } from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  removeProduct,
  searchProduct,
  setDefaultProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { verifyJwt, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  addReview,
  getReviewsOfProduct,
} from "../controllers/review.controller.js";

const router = Router();

// add product
router.route("/addproduct").post(verifyJwt, verifyAdmin, addProduct);

// set products
router.route("/setdefaultproducts").post(setDefaultProduct);

// get product by id
router.route("/getproduct/:pid").get(getProductById);

// get all products
router.route("/").get(getAllProducts);

// add review
router
  .route("/review/:productId")
  .post(verifyJwt, addReview)
  .get(getReviewsOfProduct);

// search for product
router.route("/search").get(searchProduct);

// updating product
router
  .route("/updateproduct/:pid")
  .patch(verifyJwt, verifyAdmin, updateProduct);

// delete product
router
  .route("/removeproduct/:pid")
  .delete(verifyJwt, verifyAdmin, removeProduct);

export default router;
