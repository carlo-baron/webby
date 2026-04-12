import type { 
  Request,
  Response,
  NextFunction
} from "express";
import { notFound } from "#root/lib/errorHelper.js";

const routeValidator = (
  req: Request, 
  res: Response, 
  next: NextFunction) => {
    return next(notFound("Route not found."));
}

export default routeValidator;
