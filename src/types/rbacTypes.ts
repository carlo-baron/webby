import permissionMap from "#root/middlewares/authorization/roles.js";

export type Role = keyof typeof permissionMap;
export type Permission = typeof permissionMap[Role][number];
