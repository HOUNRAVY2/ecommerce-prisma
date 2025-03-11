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
addressRouter.put("/", [authMiddleware], updateAddress);
addressRouter.get("/users", [authMiddleware], listUsers);
addressRouter.get("/users/:id", [authMiddleware], getUserById);
addressRouter.put("/users/:id", [authMiddleware], changeRole);
addressRouter.delete("/:id", [authMiddleware], deleteAddress);
addressRouter.use(errorHandler);

export default addressRouter;
