import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '..';
import { Address, User } from '@prisma/client';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { AddressSchema, UpdateUserSchema } from '../schema/users';
import { UnauthorizedException } from '../exceptions/unauthorized';


const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    AddressSchema.parse(req.body);
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: req.body.userId
      }
    });

    const address = await prismaClient.address.create({
      data: {
        ...req.body,
        userId: user.id
      }
    });
    res.json(address);
  } catch (err) {
    res.status(404).json({ error: 'User Not Found', errorCode: ErrorCode.USER_NOT_FOUND });
  }
};

const listAddress = async (req: Request, res: Response) => {
  try {
    const count = await prismaClient.address.count();
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const address = await prismaClient.address.findMany({
      skip,
      take: 5
    });
    res.json({
      count,
      data: address
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list addresses' });
  }
};

const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prismaClient.address.delete({
      where: { id: Number(id) }
    });
    res.json({ message: `Address ${id} deleted successfully` });
  } catch (error) {
    res.status(404).json({ error: 'Address Not Found', errorCode: ErrorCode.ADDRESS_NOT_FOUND });
  }
};

const updateAddress = async (req: Request, res: Response) => {
  try {
    const validatedData: { defaultShipping?: number | any; defaultBilling?: number | null } = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address | null = null;
    let billingAddress: Address | null = null;
    if (validatedData.defaultShipping) {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShipping
        }
      });
      if (shippingAddress.userId !== req.body.user.id) {
        throw new NotFoundException('Address does not belong to user', ErrorCode.ADDRESS_NOT_BELONG_TO_USER);
      }
    }

    if (validatedData.defaultBilling) {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBilling
        }
      });
      if (billingAddress.userId !== req.body.user.id) {
        throw new NotFoundException('Address does not belong to user', ErrorCode.ADDRESS_NOT_BELONG_TO_USER);
      }
    }

    const updateUser = await prismaClient.user.update({
      where: {
        id: req.body.user.id
      },
      data: validatedData
    });
    res.json(updateUser);
  } catch (err) {
    res.status(404).json({ error: 'User Not Found', errorCode: ErrorCode.USER_NOT_FOUND });
  }
};

export { createAddress, listAddress, deleteAddress, updateAddress };