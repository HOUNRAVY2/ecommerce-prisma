import { Router } from "express";
import {
  createOrder,
  listOrder,
  cancelOrder,
  getOrderById,
  listAllOrder,
} from "../controller/order.controller";
import authMiddleware from "../middlewares/auth";
import errorHandler from "../middlewares/error-handler";

const orderRouter = Router();

orderRouter.post("/", [authMiddleware], createOrder);
orderRouter.get("/index", [authMiddleware], listAllOrder);
orderRouter.get("/", [authMiddleware], listOrder);
orderRouter.get("/:id", [authMiddleware], getOrderById);
orderRouter.put("/:id/cancel", [authMiddleware], cancelOrder);

orderRouter.use(errorHandler);
export default orderRouter;
