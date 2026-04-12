import jwt from 'jsonwebtoken';
import User from '#root/models/UserModel.js';
import type { RequestHandler } from 'express';
import type { 
  Response,
  NextFunction 
} from "express";
import type { AuthRequest, IUser, DecodedToken } from '#root/types/userTypes.js';
import { 
	unauthorized
} from '#root/lib/errorHelper.js';
import { secret } from '#root/config/secret.js';

const authenticate = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    try{
        if(!token){
					throw unauthorized("Invalid input. No token provided.", { cause: "accessToken" });
        }

        jwt.verify(token, secret, async (err, decoded) => {
            if(err){
							if(err.name === "TokenExpiredError"){
                return next(unauthorized("Token Expired", { cause: "tokenExpired"}));
							}
              return next(unauthorized("Invalid Token", { cause: "accessToken"}));
            }

            try{
                const payload = decoded as DecodedToken;
                const user = await User.findOne({name: payload.name}) as IUser;
                if(payload.tokenVersion !== user.tokenVersion){
                    throw unauthorized("Invalid or expired token", { cause: "accessToken" });
                }

                req.user = payload;
                next();
            }catch(err){
                next(err);
            }
        });
    }catch(err){
        next(err);
    }
}

export default authenticate as RequestHandler;
