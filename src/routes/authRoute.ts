import express from 'express';
import { 
    login,
    refresh,
    register,
    logout,
		googleCallback,
} from '#root/controllers/authController.js';
import authenticate from '#root/middlewares/authenticate.js';
import { 
	refreshLimiter,
	loginLimiter,
	registerLimiter,
	googleLimiter,
	defaultLimiter
} from '#root/middlewares/rateLimiters/authLimiters.js';

export const authRouter = express.Router();

authRouter.get('/', defaultLimiter, async (req, res, next) => {
	res.status(200).json({
		success: true,
		message: "This is where authentication happens"
	});
});
authRouter.post('/refresh', refreshLimiter, refresh);
authRouter.post('/login', loginLimiter, login);
authRouter.post('/register', registerLimiter, register);
authRouter.post('/logout', authenticate, logout);
authRouter.post('/google', googleLimiter, googleCallback);
