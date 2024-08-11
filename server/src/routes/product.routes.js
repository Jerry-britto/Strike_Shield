import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  searchProduct,
  setDefaultProduct,
} from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addReview,
  getReviewsOfProduct,
} from "../controllers/review.controller.js";

const router = Router();

router
  .route("/addproduct")
  .post(verifyJwt, upload.single("coverImage"), addProduct);

router.route("/setdefaultproducts").post(setDefaultProduct);

router.route("/getproduct/:pid").get(getProductById);

router.route("/").get(getAllProducts);

// add review
router
  .route("/review/:productId")
  .post(verifyJwt, addReview)
  .get(getReviewsOfProduct);

// search for product
router.route("/search").get(searchProduct)

export default router;
