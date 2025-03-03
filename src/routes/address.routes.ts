import { Router } from "express";
import errorHandler from "../middlewares/error-handler";
import authMiddleware from "../middlewares/auth";
import { createAddress, listAddress } from "../controller/address.controller";


const addressRouter = Router()

addressRouter.post('/', [authMiddleware], createAddress)
addressRouter.get('/', [authMiddleware], listAddress)
addressRouter.use(errorHandler)

export default addressRouter;