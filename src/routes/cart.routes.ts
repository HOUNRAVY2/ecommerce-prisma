import { Router } from "express";
import errorHandler from "../middlewares/error-handler";
import {
  createdCart,
  cartList,
  cartUpdate,
  deleteCart,
} from "../controller/cart.controller";
import authMiddleware from "../middlewares/auth";

const cartRouter = Router();

cartRouter.post("/", [authMiddleware], createdCart);
cartRouter.get("/", [authMiddleware], cartList);
cartRouter.put("/:id", [authMiddleware], cartUpdate);
cartRouter.delete("/:id", [authMiddleware], deleteCart);

export default cartRouter;
