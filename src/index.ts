import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import errorMidleware from "./middlewares/errors";

const app: Express = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("it is working");
});
app.use("/api", rootRouter);
app.use(errorMidleware);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, () =>
  console.log(`App working at port http://localhost:${PORT}`)
);
