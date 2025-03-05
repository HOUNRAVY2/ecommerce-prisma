import { Router } from "express";
import authRouter from "./auth.routes";
import productRoters from "./products.routes";
import addressRouter from "./address.routes";
import cartRouter from "./cart.routes";

const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/product', productRoters)
rootRouter.use('/address', addressRouter)
rootRouter.use('/cart', cartRouter)

export default rootRouter;