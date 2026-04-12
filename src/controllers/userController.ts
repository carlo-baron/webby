import User from '#root/models/UserModel.js';
import type { 
	Request,
	Response,
	NextFunction,
} from "express";
import type { AuthRequest } from '#root/types/userTypes.js';
import { NameParamsSchema } from '#root/validators/user/nameParamsSchema.js';
import { UpdateNameBodySchema } from '#root/validators/user/updateNameBodySchema.js';
import { 
	notFound,
	unauthorized,
} from '#root/lib/errorHelper.js';
import { getCache, setCache, deleteCache } from '#root/lib/redisCache.js';
import { paginate } from '#root/lib/paginationUtil.js';

export const getAllUsers = async(
	req: Request, 
	res: Response,
	next: NextFunction
) => {
	const { skip, limit } = paginate(req);

	const cache = await getCache(`user_all:skip=${skip}:limit=${limit}`);
	if(cache){
		await deleteCache(`user_all:*`);
		return res.status(200).json({
			success: true,
			message: cache 
		});
	}
	try{
		const users = await User.find({})
		.skip(skip)
		.limit(limit)
		.select('name -_id')
		.lean();

		if(users.length === 0){
			throw notFound("No users found.");
		};

		await setCache(`user_all:skip=${skip}:limit=${limit}`, JSON.stringify(users));

		return res.status(200).json({
			success: true,
			message: users
		});
	}catch(err){
		next(err);
	}
}

export const getUser = async(
	req: Request, 
	res: Response,
	next: NextFunction
) => {
	const {name} = NameParamsSchema.parse(req.params);
	const cache = await getCache(`user:${name}`);
	if(cache){
		return res.status(200).json({
			success: true,
			message: "The user's email is: " + cache.name,
			user: cache
		});
	}

	try{
		const user = await User.findOne({name});
		if(!user){
			throw notFound("User not found.");
		}

		await setCache(`user:${name}`, JSON.stringify(user));
		return res.status(200).json({
			success: true,
			message: "The user's email is: " + user.name,
			user
		});
	}catch(err) {
		next(err)
	};
}

export const patchName = async(
	req: Request, 
	res: Response,
	next: NextFunction
) => {
	const { name, new_name } = UpdateNameBodySchema.parse(req.body); 
	try{
		const user = await User.findOne({name});
		if(!user) {
			throw notFound("User not found");
		}
		user.name = new_name;

		await user.save();

		await deleteCache(`user:${name}`);
		await deleteCache(`user_all:*`);
		await deleteCache(`user_self:${name}`);


		return res.status(200).json({
			success: true,
			message: "User name updated"
		}); }catch(err){
			next(err);
		}
}

export const deleteUser = async(
	req: Request, 
	res: Response,
	next: NextFunction
) => {
	const { name } = NameParamsSchema.parse(req.params);

	await User.deleteOne({name});

	await deleteCache(`user:${name}`);
	await deleteCache(`user_all:*`);
	await deleteCache(`user_self:${name}`);

	return res.status(200).json({
		success: true,
		message: "User name updated"
	});
}

export const getSelf = async(
	req: Request, 
	res: Response,
	next: NextFunction
) => {
	const authReq = req as AuthRequest;

	const cacheKey = `user_self:${authReq.user.name}`
	const cache = await getCache(cacheKey);
	if(cache){
		return res.status(200).json({
			success: true,
			message: "You got username, email, and profilePicture",
			user: cache
		});
	}

	try{
		if(!authReq.user){
			throw unauthorized();
		}

		const user = {
			name: authReq.user.name,
			email: authReq.user.email,
			profilePicture: authReq.user.profilePicture
		}
		await setCache(cacheKey, JSON.stringify(user), 60 * 3);

		return res.status(200).json({
			success: true,
			message: "You got username, email, and profilePicture",
			user: user
		});
	}catch(err){
		next(err);
	}
} 
