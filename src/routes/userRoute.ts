import express from 'express';
import {
    getAllUsers,
    getUser,
    patchName,
    deleteUser,
    getSelf,
} from '#root/controllers/userController.js';
import {
    checkPermission,
} from '#root/middlewares/authorization/authorize.js';
import {
    isUser
} from '#root/middlewares/isUser.js';
import { 
	getMeLimiter,
	getAllUsersLimiter,
	getUserLimiter,
	patchUserLimiter,
	deleteUserLimiter 
} from '#root/middlewares/rateLimiters/userLimiters.js';

export const userRouter = express.Router();

userRouter.get(
    '/', 
		getAllUsersLimiter,
    checkPermission('user:read_all'),
    getAllUsers
);

userRouter.get(
    '/me',
		getMeLimiter,
    checkPermission('user:read'),
    getSelf
);

userRouter.get(
    '/:name', 
		getUserLimiter,
    checkPermission('user:read'),
    isUser,
    getUser
);

userRouter.patch(
    '/:name',
		patchUserLimiter,
    checkPermission('user:update'),
    isUser,
    patchName
);

userRouter.delete(
    '/:name',
		deleteUserLimiter,
    checkPermission('user:delete'),
    isUser,
    deleteUser
);
