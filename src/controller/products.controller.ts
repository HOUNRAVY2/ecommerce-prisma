import {Request, Response } from 'express'
import { prismaClient } from '..'

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
    const { id } = req.params;
    const product = await prismaClient.product.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
        tags: req.body.tags.join(',')
      }
    });
    res.json(product);
}

const listProduct = async(req: Request, res: Response) => {
    const products = await prismaClient.product.findMany();
    res.json(products);
}

const deleteProduct = async(req: Request, res: Response) => {
    const { id } = req.params;
    await prismaClient.product.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Product deleted successfully' });
}
const getProductById = async(req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prismaClient.product.findUnique({
      where: { id: Number(id) }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
}
export {updateProduct, createProduct, listProduct, deleteProduct, getProductById }