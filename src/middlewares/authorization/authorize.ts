import type { 
  Response,
  NextFunction, 
  RequestHandler
} from "express";
import permissionMap from "./roles.js";
import type { Permission } from "#root/types/rbacTypes.js";
import type { AuthRequest } from "#root/types/userTypes.js";
import { forbidden } from "#root/lib/errorHelper.js";

export const checkPermission = (action: Permission): RequestHandler =>{
    return ((req: AuthRequest,
            res: Response,
            next: NextFunction
           ) => {

        const user = req.user;
        const role = user.role;

        if(permissionMap[role].some(permission => permission === action)){
            return next();
        }else{
            return next(forbidden());
        }
    }) as RequestHandler;
}
