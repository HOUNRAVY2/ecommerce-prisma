import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { Product } from "@prisma/client";
import { CreateCartSchema, ChangeQuantity } from "../schema/cart";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import createHttpError from "http-errors";

const createdCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;

  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (err) {
    res.status(404).json({
      error: "Product  Not Found",
      errorCode: ErrorCode.USER_NOT_FOUND,
    });
  }

  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.body.user.id,
      productId: product!.id,
      quantity: validatedData.quantity,
    },
  });
  res.json(cart);
};

const cartList = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      id: req.body.user.id,
    },
    include: {
      product: true,
    },
  });
  res.json(cart);
};

const cartUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.id) {
      console.log("req.params.id :", req.params.id);
      const cart = await prismaClient.cartItem.findFirst({
        where: {
          id: +req.params.id,
        },
      });
      if (!cart) {
        throw createHttpError(400, {
          message: "Product Not Found",
        });
      }
    }
    const validatedData = ChangeQuantity.parse(req.body);
    const updatedCart = await prismaClient.cartItem.update({
      where: {
        id: +req.params.id,
      },
      data: {
        quantity: validatedData.quantity,
      },
    });
    res.json(updatedCart);
  } catch (err) {
    next(err);
  }
};

const deleteCart = async (req: Request, res: Response) => {
  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });
  res.json({ success: true });
};
export { createdCart, cartList, cartUpdate, deleteCart };
