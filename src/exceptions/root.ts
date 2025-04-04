export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  ADDRESS_NOT_BELONG_TO_USER = 1005,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSABLE_ENTIY = 2001,
  INTERNAL_EXCEPTION = 3001,
  UNAUTHORIZED = 3004,
  PRODUCT_NOT_FOUND = 4001,
  ADDRESS_NOT_FOUND = 4004,
  ORDER_NOT_FOUND = 5001,
}
