import jwt from 'jsonwebtoken';
import User from '#root/models/UserModel.js';
import type { DecodedToken } from '#root/types/userTypes.js';
import { LoginSchema } from '#root/validators/auth/loginSchema.js';
import { RegisterSchema } from '#root/validators/auth/registerSchema.js';
import { OAuth2Client } from 'google-auth-library';
import { 
	unauthorized,
	tooMany,
	badInput,
	conflict,
	serverError
} from '#root/lib/errorHelper.js';
import type { 
  Request,
  Response,
  NextFunction 
} from "express";
import { getRateLimiter } from '#root/lib/getRateLimiter.js';
import { 
	setUpLogin,
	createAccessTokenOnly,
	generateUniqueUsername
} from '#root/lib/authHelper.js';
import { getCache, setCache, deleteCache } from '#root/lib/redisCache.js';
import { secret } from '#root/config/secret.js';
import { blacklistToken } from '#root/lib/blacklistToken.js';


export const login = async (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
    const maxLoginAttempts = 5;
    const rateLimiterMongo = getRateLimiter(
        maxLoginAttempts,
        60 * 60,
        60 * 60 * 3,
    );

    const data = LoginSchema.parse(req.body);
    const { name, password } = data;

		const key = `login_password${name}`;
    const rlUser = await rateLimiterMongo.get(key);
    if(rlUser !== null && rlUser.consumedPoints >= maxLoginAttempts){
				res.set("Retry-After", String(Math.ceil(rlUser.msBeforeNext / 1000)));
        throw tooMany("Too Many Requests. Try again later.");
    }else{
        try{
            const user = await User.findOne({name: name}).select('+password');
            if(!user){
                throw badInput("Invalid name or password");
            }

            const isMatch: boolean = await user.comparePassword(password);
            if(!isMatch){
                try{
                  await rateLimiterMongo.consume(key);
                	throw badInput("Invalid name or password");
                }catch(err){
                    if(err instanceof Error){
                        throw err;
                    }else{
                				throw tooMany();
                    }
                }
            }
            
            if(rlUser !== null && rlUser.consumedPoints > 0){
                await rateLimiterMongo.delete(key);
            }

						const { accessToken } = setUpLogin(user, res);
            await user.login();

            return res.status(200).json({
                success: true,
                message: "Logged in as: " + name,
                token: accessToken,
            });
        }catch(err){
            next(err);
        }
    }
}

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
		const cache = await getCache("accessToken");
		if(cache){
			return res.status(200).json({
					success: true,
					message: "There is still a valid token",
					token: cache,
			});
		}

    try {
        if (!req.cookies?.jwt) {
            throw unauthorized();
        }

        const refreshToken = req.cookies.jwt;

				const isBlacklisted = await getCache(`bl:${refreshToken}`);
        if(isBlacklisted){
            throw unauthorized();
        }

        const decoded = jwt.verify(refreshToken, secret) as DecodedToken;
        const username = decoded.name;

        const user = await User.findOne({ name: username });
        if (!user) {
            return next(badInput("Invalid Credentials"));
        }
        await user.incrementTokenVersion();

        const accessToken = createAccessTokenOnly(user);
				await setCache("accessToken", JSON.stringify(accessToken), 60*3);

        return res.status(200).json({
            success: true,
            message: "Refreshed Token of: " + username,
            token: accessToken,
        });

    } catch (err) {
        return next(err);
    }
};

export const register = async(
  req: Request, 
  res: Response,
  next: NextFunction
  ) => {
    const maxAccountCreation = 5;
    const rateLimiter = getRateLimiter(
        maxAccountCreation,
        60 * 60 * 24
    );

		const key = `register_${req.ip}`
    const rlKey = await rateLimiter.get(key);
    if(rlKey !== null && rlKey.consumedPoints >= maxAccountCreation){
				res.set("Retry-After", String(Math.ceil(rlKey.msBeforeNext / 1000)));
        return next(tooMany());
    }else{
        const body = RegisterSchema.parse(req.body);
        const user = await User.findOne({name: body.name});
        if(user){
            return next(conflict('Username already exists', {
							cause: "name"
						}));
        }

        try{
            const newUser = await User.create({
                name: body.name,
                password: body.password
            });

            if(!newUser){
                throw serverError("Failed to create user. Try again.");
            }

            await rateLimiter.consume(key);

						const { accessToken } = setUpLogin(newUser, res);
						await newUser.login();

						await deleteCache("user_all");

            return res.status(200).json({
                success: true,
                message: "Account registered",
								token: accessToken
            });
        }catch(err){
            next(err);
        }
    }
}

export const logout = async (
  req: Request, 
  res: Response,
  next: NextFunction
  ) => {
    if(req.cookies?.jwt){
        const refreshToken = req.cookies?.jwt;
        const decoded = jwt.verify(refreshToken, secret) as DecodedToken;

				await blacklistToken(refreshToken, decoded.exp);

        const user = await User.findOne({name: decoded.name});
        await user?.logout();
        await user?.incrementTokenVersion();

				res.clearCookie('jwt', {
						httpOnly: true,
						sameSite: 'none',
						secure: true,
						//domain: 'mydomain.com',
				});

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }else{
        return next(unauthorized());
    }
}

export const googleCallback = async (
  req: Request, 
  res: Response,
  next: NextFunction
  ) => {
	const client = new OAuth2Client();
	const { credential } = req.body; const webClientId = process.env.WEB_CLIENT_ID || ''; const ticket = await client.verifyIdToken({
		idToken: credential,
		audience: webClientId
	});

	const payload = ticket.getPayload();
	if(payload){
		const googleid = payload.sub;
		const user = await User.findOne({
			googleid
		});

		if(!user){
				const displayName = payload.given_name || "";
				const username = await generateUniqueUsername(displayName);

				const newUser = await User.create({
						name: username,
						email: payload.email,
						googleid: payload.sub,
						profilePicture: payload.picture
				});

				const { accessToken } = setUpLogin(newUser, res);

				await newUser.login();
				return res.status(200).json({
						success: true,
						message: "Logged in as: " + newUser.name,
						token: accessToken,
				});
		}

		const { accessToken } = setUpLogin(user, res);
		await user.login();

		return res.status(200).json({
				success: true,
				message: "Logged in as: " + user.name,
				token: accessToken,
		});
	}else{
		return next(badInput("Invalid Email Credentials"));
	}
}

