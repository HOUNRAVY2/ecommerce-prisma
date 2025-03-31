import { Router } from "express";
import errorHandler from "../middlewares/error-handler";
import {
  createProduct,
  getProductById,
  listProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
} from "../controller/products.controller";
import authMiddleware from "../middlewares/auth";

const productRouters: Router = Router();

productRouters.post("/", [authMiddleware], createProduct);
productRouters.get("/", [authMiddleware], listProduct);
productRouters.get("/search", [authMiddleware], searchProduct);
productRouters.get("/:id", [authMiddleware], getProductById);
productRouters.put("/:id", [authMiddleware], updateProduct);
productRouters.delete("/:id", [authMiddleware], deleteProduct);

export default productRouters;
