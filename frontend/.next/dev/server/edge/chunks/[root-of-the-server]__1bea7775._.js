(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__1bea7775._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/auth/auth-middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser,
    "hasRole",
    ()=>hasRole,
    "isAuthenticated",
    ()=>isAuthenticated
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = /*#__PURE__*/ __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
async function getCurrentUser(req) {
    const accessToken = req.cookies.get('access_token')?.value;
    if (!accessToken) {
        return null;
    }
    try {
        const payload = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(accessToken.split('.')[1], 'base64').toString());
        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
            iat: payload.iat,
            exp: payload.exp
        };
    } catch (error) {
        console.error('Token decode failed:', error);
        return null;
    }
}
async function isAuthenticated(req) {
    const user = await getCurrentUser(req);
    if (!user) return false;
    const now = Math.floor(Date.now() / 1000);
    return user.exp > now;
}
async function hasRole(req, allowedRoles) {
    const user = await getCurrentUser(req);
    if (!user) return false;
    return allowedRoles.includes(user.role);
}
}),
"[project]/src/types/auth.types.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "UserRole",
    ()=>UserRole
]);
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CUSTOMER"] = "customer";
    return UserRole;
}({});
var AuthProvider = /*#__PURE__*/ function(AuthProvider) {
    AuthProvider["LOCAL"] = "local";
    AuthProvider["GOOGLE"] = "google";
    AuthProvider["APPLE"] = "apple";
    return AuthProvider;
}({});
}),
"[project]/src/lib/auth/route-protection.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROUTE_PROTECTION",
    ()=>ROUTE_PROTECTION,
    "getRouteConfig",
    ()=>getRouteConfig,
    "hasAccess",
    ()=>hasAccess,
    "isPublicRoute",
    ()=>isPublicRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/auth.types.ts [middleware-edge] (ecmascript)");
;
const ROUTE_PROTECTION = [
    {
        path: '/',
        requiresAuth: false
    },
    {
        path: '/products',
        requiresAuth: false
    },
    {
        path: '/about',
        requiresAuth: false
    },
    {
        path: '/contact',
        requiresAuth: false
    },
    {
        path: '/login',
        requiresAuth: false,
        redirectTo: '/'
    },
    {
        path: '/register',
        requiresAuth: false,
        redirectTo: '/'
    },
    {
        path: '/forgot-password',
        requiresAuth: false,
        redirectTo: '/'
    },
    {
        path: '/reset-password',
        requiresAuth: false,
        redirectTo: '/'
    },
    {
        path: '/profile',
        requiresAuth: true,
        allowedRoles: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].CUSTOMER,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].ADMIN
        ]
    },
    {
        path: '/orders',
        requiresAuth: true,
        allowedRoles: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].CUSTOMER,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].ADMIN
        ]
    },
    {
        path: '/checkout',
        requiresAuth: true,
        allowedRoles: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].CUSTOMER,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].ADMIN
        ]
    },
    {
        path: '/wishlist',
        requiresAuth: true,
        allowedRoles: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].CUSTOMER,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].ADMIN
        ]
    },
    {
        path: '/returns',
        requiresAuth: true,
        allowedRoles: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].CUSTOMER,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].ADMIN
        ]
    },
    {
        path: '/admin',
        requiresAuth: true,
        allowedRoles: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UserRole"].ADMIN
        ]
    }
];
function getRouteConfig(pathname) {
    return ROUTE_PROTECTION.find((route)=>{
        if (route.path === pathname) return true;
        if (pathname.startsWith(route.path + '/')) return true;
        return false;
    });
}
function isPublicRoute(pathname) {
    const config = getRouteConfig(pathname);
    return !config || !config.requiresAuth;
}
function hasAccess(pathname, userRole) {
    const config = getRouteConfig(pathname);
    if (!config) return true;
    if (!config.requiresAuth) return true;
    if (!userRole) return false;
    if (!config.allowedRoles) return true;
    return config.allowedRoles.includes(userRole);
}
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$auth$2d$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/auth-middleware.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$route$2d$protection$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/route-protection.ts [middleware-edge] (ecmascript)");
;
;
;
async function middleware(req) {
    const { pathname } = req.nextUrl;
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$auth$2d$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getCurrentUser"])(req);
    const isLoggedIn = user !== null;
    const routeConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$route$2d$protection$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getRouteConfig"])(pathname);
    if (!routeConfig) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (isLoggedIn && routeConfig.redirectTo && !routeConfig.requiresAuth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(routeConfig.redirectTo, req.url));
    }
    if (routeConfig.requiresAuth && !isLoggedIn) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('from', pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    if (routeConfig.requiresAuth && routeConfig.allowedRoles && user && !routeConfig.allowedRoles.includes(user.role)) {
        const forbiddenUrl = new URL('/403', req.url);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(forbiddenUrl);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */ '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__1bea7775._.js.map