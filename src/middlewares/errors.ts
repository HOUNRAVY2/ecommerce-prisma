import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/root";

const errorMidleware: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode ? error.statusCode : 500;
  console.log("statusCode :", statusCode);
  let message = error.message ? error.message : "Unexpected Error";
  res.status(statusCode).json({
    statusCode: statusCode,
    message: message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
};

export default errorMidleware;
