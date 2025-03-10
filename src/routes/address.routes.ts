import { Router } from "express";
import errorHandler from "../middlewares/error-handler";
import authMiddleware from "../middlewares/auth";
import {
  createAddress,
  listAddress,
  deleteAddress,
  updateAddress,
  listUsers,
  getUserById,
  changeRole,
} from "../controller/address.controller";

const addressRouter = Router();

addressRouter.post("/", [authMiddleware], createAddress);
addressRouter.get("/", [authMiddleware], listAddress);
addressRouter.delete("/", [authMiddleware], deleteAddress);
addressRouter.put("/", [authMiddleware], updateAddress);
addressRouter.get("/users", [authMiddleware], listUsers);
addressRouter.get("/users/:id", [authMiddleware], getUserById);
addressRouter.put("/users/:id", [authMiddleware], changeRole);
addressRouter.use(errorHandler);

export default addressRouter;
