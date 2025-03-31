import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { CreateProductSchema } from "../schema/products";

const createProduct = async (req: Request, res: Response) => {
  const validatedData = CreateProductSchema.parse(req.body);
  try {
    const product = await prismaClient.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        tags: validatedData.tags,
      },
    });
    res.json(product);
  } catch (err) {
    console.log("my error:", err);
    res.status(500).json({
      error: "Failed to create product",
      errorCode: ErrorCode.PRODUCT_NOT_FOUND,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const validatedData = CreateProductSchema.parse(req.body);
  try {
    const updateProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        tags: validatedData.tags,
      },
    });
    res.json(updateProduct);
  } catch (err) {
    res.status(404).json({
      error: "Product Not Found",
      errorCode: ErrorCode.PRODUCT_NOT_FOUND,
    });
  }
};

const listProduct = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const products = await prismaClient.product.findMany({
    skip,
    take: 5,
  });
  res.json({
    count,
    data: products,
  });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prismaClient.product.delete({
    where: { id: Number(id) },
  });
  res.json({ message: `Product${id} deleted successfully` });
};
const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    res.json(product);
  } catch (err) {
    res.status(404).json({
      error: "Product Not Found",
      errorCode: ErrorCode.PRODUCT_NOT_FOUND,
    });
  }
};

const searchProduct = async (req: Request, res: Response) => {
  try {
    const query = req.query.q?.toString() || "";
    const products = await prismaClient.product.findMany({
      where: {
        name: {
          search: req.query.q?.toString(),
        },
        description: {
          search: req.query.q?.toString(),
        },
        tags: {
          has: query,
        },
      },
    });
    if (products.length == 0) {
      res.status(404).json({
        error: "Product not found",
      });
    }
    res.json(products);
  } catch (err) {
    res.status(404).json({
      error: "Something went wrong",
    });
  }
};

export {
  updateProduct,
  createProduct,
  listProduct,
  deleteProduct,
  getProductById,
  searchProduct,
};
