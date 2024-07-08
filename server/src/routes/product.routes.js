import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct,setDefaultProduct } from "../controllers/product.controller.js";

const router = Router();

router
  .route("/addproduct")
  .post(upload.single("coverImage"), addProduct);

router.route("/setdefaultproducts").post(setDefaultProduct)

export default router;
