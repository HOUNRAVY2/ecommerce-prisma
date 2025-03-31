import { Router } from "express";
import authRouter from "./auth.routes";
import productRoters from "./products.routes";
import addressRouter from "./address.routes";
import cartRouter from "./cart.routes";
import orderRouter from "./order.routes";
import errorHandler from "../middlewares/error-handler";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/product", productRoters);
rootRouter.use("/address", addressRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use(errorHandler);

export default rootRouter;
