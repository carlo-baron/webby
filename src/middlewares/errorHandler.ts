import type { Request, Response, NextFunction } from "express";
import { HttpError } from "#root/lib/errorHelper.js";
import type { ErrorFields } from "#root/types/errorTypes.js";
import mongoose from 'mongoose';

type ReturnErrorType = {
	success: false;
	error: {
		name: string,
		message: string,
		cause?: unknown,
		fields?: ErrorFields 
	}
}

const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response<ReturnErrorType>, 
  next: NextFunction
) => {
	if(process.env.APP_MODE === "development"){
  	console.error(`[${req.method}] ${req.url} → ${err.message}`);
	}

  if(err instanceof mongoose.mongo.MongoServerError && err.code === 11000){
    return res.status(409).json({
      success: false,
      error: {
        name: err.name,
        message: err.message || "Object already exists",
        cause: err.cause,
      },
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errData: Record<string, { name: string; message: string }> = {};

    Object.values(err.errors).forEach((field) => {
      errData[field.path] = {
        name: field.name,
        message: field.message,
      };
    });

    return res.status(400).json({
      success: false,
      error: {
				name: err.name,
				message: err.message,
        fields: errData
      }
    });
  }

	if(err instanceof HttpError){
		return res.status(err.status || 500).json({
			success: false,
			error: {
				name: err.name,
				message: err.message || "Internal Server Error",
				cause: err.cause,
			},
		});
	}

	return res.status(500).json({
		success: false,
		error: {
			name: "Server Error",
			message: err.message
		}
	});
};

export default errorHandler;

