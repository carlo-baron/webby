import express from 'express';
import { 
    login,
    refresh,
    register,
    logout,
		googleCallback
} from '#root/controllers/authController.js';
import authenticate from '#root/middlewares/authenticate.js';
import { 
	refreshLimiter,
	loginLimiter,
	registerLimiter,
	googleLimiter
} from '#root/middlewares/rateLimiters/authLimiters.js';

export const authRouter = express.Router();

authRouter.post('/refresh', refreshLimiter, refresh);
authRouter.post('/login', loginLimiter, login);
authRouter.post('/register', registerLimiter, register);
authRouter.post('/logout', authenticate, logout);
authRouter.post('/google', googleLimiter, googleCallback);
