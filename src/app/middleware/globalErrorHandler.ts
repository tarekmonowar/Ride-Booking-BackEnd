/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError, ZodIssue } from "zod";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  let statusCode = 500;
  let message = "Internal Server Error";
  const errorSource: { path: string; message: string }[] = [];

  if (err.name === "ZodError" || err instanceof ZodError) {
    statusCode = 400;
    message = "Zod Validation  Error";
    err.issues.forEach((issue: ZodIssue) => {
      errorSource.push({
        path: String(issue.path[issue.path.length - 1]),
        message: issue.message,
      });
    });
  }
  //mongoose duplicate value error
  else if (err.code === 11000) {
    statusCode = 409;
    const match = err.message.match(/"([^"]*)"/);
    const field = match?.[1] || "field";
    message = `The ${field} you entered already exists`;

    //mongoose validation error
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    const errors = Object.values(err.errors);
    errors.forEach((errorObject) =>
      errorSource.push({
        path: errorObject.path,
        message: errorObject.message,
      }),
    );
    message = "Validation error";

    //mongoose invalid object ID error
  } else if (err.name === "CastError") {
    statusCode = 401;
    message = "Invalid MongoDB Object ID";

    //custom app error
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    //default express error
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
