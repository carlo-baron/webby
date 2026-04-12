const permissionMap = {
    admin: [
        'class:create',
        'class:read',
        'class:read_all',
        'class:update',
        'class:delete',

        'user:read_all',
        'user:read',
        'user:update',
        'user:delete',
        'waitlist:read_all'
    ],
    user: [
        'class:create',
        'class:read',
        'class:update',
        'class:delete',

        'user:read',
        'user:update',
        'user:delete',
    ]
} as const;

export default permissionMap;
