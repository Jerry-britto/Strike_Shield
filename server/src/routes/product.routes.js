import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct } from "../controllers/product.controller.js";

const router = Router();

router
  .route("/addproduct")
  .post(verifyUser, upload.single("coverImage"), addProduct);

export default router;
