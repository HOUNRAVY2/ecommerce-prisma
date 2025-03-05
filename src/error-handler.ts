import { Response, Request, NextFunction } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
export const errorHAndler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exceptions: HttpException;
      if (error instanceof HttpException) {
        exceptions = error;
      } else {
        exceptions = new InternalException(
          " Somthings went wrong!",
          error,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }
      console.log(exceptions);
      next(exceptions);
    }
  };
};
