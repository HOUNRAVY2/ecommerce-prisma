import { Router } from "express";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";

const createOrder = async (req: Request, res: Response): Promise<void> => {
  await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.body.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "cart is empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);
    const address = await tx.address.findFirst({
      where: {
        id: req.body.user.defaultShippingAddress,
      },
    });
    if (!address) {
      return res.status(404).json({
        error: "Address Not Found",
        errorCode: ErrorCode.ADDRESS_NOT_FOUND,
      });
    }
    const order = await tx.order.create({
      data: {
        userId: req.body.user.id,
        netAmount: price,
        address: address.formattedAddress,
        OrderProduct: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    await tx.cartItem.deleteMany({
      where: {
        userId: req.body.user.id,
      },
    });
    res.json(order);
  });
};

const listOrder = async (req: Request, res: Response): Promise<void> => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.body.user.id,
    },
  });
  res.json(orders);
};

const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.body.user.id,
      },
      data: {
        status: "CANCELLED",
      },
    });
    res.json(order);
  } catch (err) {
    res.status(404).json({
      error: "Something went wrong",
    });
  }
};

const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        OrderProduct: true,
        OrderEvent: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

// manage order

const listAllOrder = async (req: Request, res: Response) => {
  let whereClause = {};

  const status = req.query.status;

  const skip = req.query.skip ? Number(req.query.skip) : 0;
  if (status) {
    whereClause = {
      status,
    };
  }
  try {
    const order = await prismaClient.order.findMany({
      where: whereClause,
      skip,
      take: 5,
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const changeStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
      },
    });
    res.json({ "Status Changed Successfully:": order });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const listUserOders = async (req: Request, res: Response) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  let whereClause: any = {
    userId: +req.params.id,
  };
  const status = req.params.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip,
    take: 5,
  });
  res.json(orders);
};
export {
  createOrder,
  listOrder,
  cancelOrder,
  getOrderById,
  listAllOrder,
  changeStatus,
  listUserOders,
};
