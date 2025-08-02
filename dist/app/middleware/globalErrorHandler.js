"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const globalErrorHandler = async (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    let statusCode = 500;
    let message = "Internal Server Error";
    const errorSource = [];
    if (err.name === "ZodError" || err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Zod Validation  Error";
        err.issues.forEach((issue) => {
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
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        const errors = Object.values(err.errors);
        errors.forEach((errorObject) => errorSource.push({
            path: errorObject.path,
            message: errorObject.message,
        }));
        message = "Validation error";
        //mongoose invalid object ID error
    }
    else if (err.name === "CastError") {
        statusCode = 401;
        message = "Invalid MongoDB Object ID";
        //custom app error
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        //default express error
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
