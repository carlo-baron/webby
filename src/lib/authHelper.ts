import jwt from 'jsonwebtoken';
import type { IUser } from '#root/types/userTypes.js';
import type { 
  Response,
} from "express";
import User from '#root/models/UserModel.js';
import { secret } from '#root/config/secret.js';

export const createAccessTokenOnly = (user: IUser) => {
	const accessToken = jwt.sign({ 
			id: user._id,
			name: user.name,
			email: user.email,
			profilePicture: user.profilePicture,
			role: user.role ,
			tokenVersion: user.tokenVersion
	}, secret,{
			expiresIn: '5m'
	});

	return accessToken;
}

export const setUpLogin = (user: IUser, res: Response) => {
	const accessToken = createAccessTokenOnly(user);

	const refreshToken = jwt.sign({
			id: user._id,
			tokenVersion: user.tokenVersion,
			name: user.name,
	}, secret, {
			expiresIn: '1d'
	});

	res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
			//domain: 'mydomain.com',
	});

	return { accessToken, refreshToken };
}

export const generateUniqueUsername = async (base: string): Promise<string> => {
  let username = base
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);

  if (!username) username = 'user';

  let candidate = username;
  let counter = 0;

  while (true) {
    const existing = await User.findOne({ username: candidate });

    if (!existing) return candidate;

    counter++;

    candidate = `${username}${counter}`;

    candidate = candidate.slice(0, 10);
  }
};

