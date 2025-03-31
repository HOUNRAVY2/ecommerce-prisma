import { Router } from "express";
import errorHandler from "../middlewares/error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
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
addressRouter.put("/", [authMiddleware], updateAddress);
addressRouter.get("/users", [adminMiddleware, authMiddleware], listUsers);
addressRouter.get("/users/:id", [adminMiddleware, authMiddleware], getUserById);
addressRouter.put("/users/:id", [adminMiddleware, authMiddleware], changeRole);
addressRouter.delete("/:id", [authMiddleware], deleteAddress);

export default addressRouter;
