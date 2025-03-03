import {Request, Response } from 'express'
import { prismaClient } from '..'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'

 const createProduct = async(req: Request, res: Response) => {
    const product = await prismaClient.product.create({
        data:{
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)
}

const updateProduct = async(req: Request, res: Response) => {
   try {
const product = req.body;
if(product.tags) {
  product.tags = product.tags.join(',')
}
const updateProduct = await prismaClient.product.update({
  where:{
    id: +req.params.id
  },
  data: product
})
res.json(updateProduct)
   } catch(err){
    res.status(404).json({ error: 'Product Not Found', errorCode: ErrorCode.PRODUCT_NOT_FOUND });

   }
}

const listProduct = async(req: Request, res: Response) => {
    const count = await prismaClient.product.count()
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const products = await prismaClient.product.findMany({
      skip,
      take: 5
    })
    res.json({
      count, data: products
    })
}

const deleteProduct = async(req: Request, res: Response) => {
    const { id } = req.params;
    await prismaClient.product.delete({
      where: { id: Number(id) }
    });
    res.json({ message: `Product${id} deleted successfully` });
}
const getProductById = async(req: Request, res: Response) => {
 try{
const product = await prismaClient.product.findFirstOrThrow({
  where: {
    id: +req.params.id
  }
})
res.json(product)
 } catch(err) {
  res.status(404).json({ error: 'Product Not Found', errorCode: ErrorCode.PRODUCT_NOT_FOUND });
 }
}
export {updateProduct, createProduct, listProduct, deleteProduct, getProductById }