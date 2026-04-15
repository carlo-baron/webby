import express from 'express';
import { 
    login,
    refresh,
    register,
    logout,
		googleCallback,
} from '#root/controllers/authController.js';
import { 
	refreshLimiter,
	loginLimiter,
	registerLimiter,
	googleLimiter,
	defaultLimiter
} from '#root/middlewares/rateLimiters/authLimiters.js';
import authenticate from '#root/middlewares/authenticate.js';

export const authRouter = express.Router();

authRouter.get('/', authenticate, defaultLimiter, async (req, res, next) => {
	res.status(200).json({
		success: true,
		message: "User is already authenticated."
	});
});
authRouter.post('/refresh', refreshLimiter, refresh);
authRouter.post('/login', loginLimiter, login);
authRouter.post('/register', registerLimiter, register);
authRouter.post('/logout', authenticate, logout);
authRouter.post('/google', googleLimiter, googleCallback);
