import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with your User type for better type safety
    }
  }
}

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      return next(
        new UnauthorizedException("Unauthorized Token", ErrorCode.UNAUTHORIZED)
      );
    }

    // Verify the token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET) as { userID: number };
    console.log("Token payload:", payload);

    // Fetch the user from the database using the userId from the token payload
    const users = await prismaClient.user.findFirstOrThrow({
      where: { id: payload.userID },
    });

    if (!users) {
      return next(
        new UnauthorizedException("Unauthorized user", ErrorCode.UNAUTHORIZED)
      );
    }

    console.log("Current user:", users); // Log the current user

    // Check if the user has the "ADMIN" role
    if (users.role === "ADMIN") {
      req.user = users; // Attach the user to the request object for further use
      next();
    } else {
      throw new UnauthorizedException(
        "Unauthorized role",
        ErrorCode.UNAUTHORIZED
      );
    }
  } catch (err) {
    console.error("Error in adminMiddleware:", err);
    next(err);
  }
};

export default adminMiddleware;
