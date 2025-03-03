import {Request, Response, NextFunction } from 'express'
import { prismaClient } from '..'
import { User } from '@prisma/client'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'
import { AddressSchema } from '../schema/users'

 const createAddress = async(req: Request, res: Response, next:NextFunction) => {
AddressSchema.parse(req.body)
let user: User;
try {
  user = await prismaClient.user.findFirstOrThrow({
    where: {
      id: req.body.userId
    }
  })
  const address = await prismaClient.address.create({
    data:{
      ...req.body,
      userId: user.id
    }
  })
  res.json(address)

} catch(err){
  res.status(404).json({ error: 'User Not Found', errorCode: ErrorCode.PRODUCT_NOT_FOUND });
}    

}



const listAddress = async (req: Request, res: Response) => {
    const count = await prismaClient.address.count()
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const address = await prismaClient.address.findMany({
      skip,
      take: 5
    })
    res.json({
      count, data: address
    })
}

const deleteAddress = async(req: Request, res: Response) => {
    const { id } = req.params;
    await prismaClient.address.delete({
      where: { id: Number(id) }
    });
    res.json({ message: `address${id} deleted successfully` });
}

export {createAddress, listAddress, deleteAddress }