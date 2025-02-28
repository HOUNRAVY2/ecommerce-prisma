import { Router } from "express";
import authRouter from "./auth.routes";
import productRoters from "./products.routes";

const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/product', productRoters)

export default rootRouter;