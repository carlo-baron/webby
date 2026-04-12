import type { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import type { DetailedError } from "#root/types/errorTypes.js";
import type { AuthRequest } from "#root/types/userTypes.js";

export const isUser = (
  req: Request, 
  res: Response,
  next: NextFunction 
) => {
    const authReq = req as AuthRequest;
    const { name } = authReq.params;
    if(authReq.user.name !== name && authReq.user.role !== 'admin'){
        const err = new Error("Permission Denied") as DetailedError;
        err.status = 403;
        return next(err);
    }
    next();
}

export const isOwner = (
  Model: Model<any>,
  options: {
    param?: string;
    field?: string;
    ownerField?: string;
  } = {}
) => {
  const {
    param = 'id',
    field = '_id',
    ownerField = 'user'
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;

    try {
      const value = authReq.params[param];
      if (!value) {
        const err = Error(`Missing param: ${param}`) as DetailedError;
        err. status = 400;
        return next(err);
      }

      const query =
        field === '_id'
          ? { _id: value }
          : { [field]: value };

      const doc = await Model.findOne(query);

      if (!doc) {
        const err = Error('Resource not found') as DetailedError;
        err. status = 404;
        return next(err);
      }

      const ownerId =
        doc[ownerField]?._id?.toString?.() ??
        doc[ownerField]?.toString?.();

      if (
        ownerId !== authReq.user.id &&
        authReq.user.role !== 'admin'
      ) {
        const err = Error('Permission Denied') as DetailedError;
        err. status = 403;
        return next(err);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
