import { Router } from "express";
import authRouter from "./auth.routes";
import productRoters from "./products.routes";
import addressRouter from "./address.routes";

const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/product', productRoters)
rootRouter.use('/address', addressRouter)

export default rootRouter;