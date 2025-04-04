import { Request, Response, NextFunction } from "express";
import { prismaClient } from "..";
import { Address, User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { z } from "zod";
import { AddressSchema, UpdateUserSchema, RoleSchema } from "../schema/users";

const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = AddressSchema.parse(req.body);
    const use = await prismaClient.user.findFirstOrThrow({
      where: {
        id: req.body.user.id,
      },
    });
    const address = await prismaClient.address.create({
      data: {
        city: payload.city,
        country: payload.country,
        lineOne: payload.lineOne,
        lineTwo: payload.lineTwo,
        pincode: payload.pincode,
        userId: use.id,
      },
    });
    res.json(address);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation error",
        message: err.errors,
      });
    } else {
      console.log("my error:", err);
      res.status(500).json({
        error: "Failed to create address",
        errorCode: ErrorCode.ADDRESS_NOT_FOUND,
      });
    }
  }
};

const listAddress = async (req: Request, res: Response) => {
  try {
    const count = await prismaClient.address.count();
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const address = await prismaClient.address.findMany({
      skip,
      take: 5,
    });
    res.json({
      count,
      data: address,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to list addresses" });
  }
};

const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prismaClient.address.delete({
      where: { id: Number(id) },
    });
    res.json({ message: `Address ${id} deleted successfully` });
  } catch (error) {
    res.status(404).json({
      error: "Address Not Found",
      errorCode: ErrorCode.ADDRESS_NOT_FOUND,
    });
  }
};

const updateAddress = async (req: Request, res: Response) => {
  try {
    const validatedData: {
      defaultShipping?: number | any;
      defaultBilling?: number | null;
    } = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address | null = null;
    let billingAddress: Address | null = null;
    if (validatedData.defaultShipping) {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShipping,
        },
      });
      if (shippingAddress.userId !== req.body.user.id) {
        throw new NotFoundException(
          "Address does not belong to user",
          ErrorCode.ADDRESS_NOT_BELONG_TO_USER
        );
      }
    }

    if (validatedData.defaultBilling) {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBilling,
        },
      });
      if (billingAddress.userId !== req.body.user.id) {
        throw new NotFoundException(
          "Address does not belong to user",
          ErrorCode.ADDRESS_NOT_BELONG_TO_USER
        );
      }
    }

    const updateUser = await prismaClient.user.update({
      where: {
        id: req.body.user.id,
      },
      data: validatedData,
    });
    res.json(updateUser);
  } catch (err) {
    res
      .status(404)
      .json({ error: "User Not Found", errorCode: ErrorCode.USER_NOT_FOUND });
  }
};

const listUsers = async (req: Request, res: Response) => {
  try {
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const users = await prismaClient.user.findMany({
      skip,
      take: 5,
    });
    res.json(users);
  } catch (err) {
    console.log("err :", err);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prismaClient.user.findFirstOrThrow({
      where: { id: Number(id) },
      include: {
        Address: true,
      },
    });
    if (user.Address.length === 0) {
      user.Address = [
        {
          id: 0,
          lineOne: "No address yet",
          lineTwo: "",
          city: "",
          country: "",
          pincode: "",
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          formattedAddress: "No address yet",
        },
      ];
    }
    res.json(user);
  } catch (err) {
    res.status(404).json({
      error: "User Not Found",
      errorCode: ErrorCode.PRODUCT_NOT_FOUND,
    });
  }
};

const changeRole = async (req: Request, res: Response) => {
  try {
    const validatedData = RoleSchema.parse(req.body);
    const user = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        role: validatedData.role,
      },
    });
    res.json({ message: "Successfully for change role", user });
  } catch (err) {
    res.status(404).json({
      error: "Something went wrong",
    });
  }
};

export {
  createAddress,
  listAddress,
  deleteAddress,
  updateAddress,
  listUsers,
  getUserById,
  changeRole,
};
