(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/api/interceptors/response.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "responseInterceptor",
    ()=>responseInterceptor,
    "successResponseInterceptor",
    ()=>successResponseInterceptor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/axios-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authStore.ts [app-client] (ecmascript)");
;
;
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error = null)=>{
    failedQueue.forEach((prom)=>error ? prom.reject(error) : prom.resolve());
    failedQueue = [];
};
const IS_PROD = ("TURBOPACK compile-time value", "development") === "production" || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ENVIROMENT === "production";
const responseInterceptor = async (error)=>{
    const originalRequest = error.config;
    const { logout } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
    if (error.response?.status === 401 && originalRequest.method !== "get" && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh") && !originalRequest.url?.includes("/auth/login")) {
        if (isRefreshing) {
            return new Promise((resolve, reject)=>failedQueue.push({
                    resolve,
                    reject
                })).then(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"])(originalRequest)).catch((err)=>Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/refresh");
            processQueue(null);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"])(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            await logout();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        } finally{
            isRefreshing = false;
        }
    }
    if (error.response?.status === 429) {
        console.warn("⚠️ Rate limit exceeded.");
    }
    return Promise.reject(error);
};
const successResponseInterceptor = (response)=>{
    const resConfig = response.config;
    if (!IS_PROD && resConfig.metadata) {
        const duration = new Date().getTime() - resConfig.metadata.startTime.getTime();
        console.log(`✅ [API Response] ${response.status} ${response.config.url} (${duration}ms)`);
    }
    return response;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/interceptors/request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requestInterceptor",
    ()=>requestInterceptor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const IS_PROD = ("TURBOPACK compile-time value", "development") === "production" || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ENVIROMENT === "production";
const requestInterceptor = (config)=>{
    if (!IS_PROD) {
        config.metadata = {
            startTime: new Date()
        };
        config.headers['Accept'] = 'application/json';
        console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/axios-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$interceptors$2f$response$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/interceptors/response.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$interceptors$2f$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/interceptors/request.ts [app-client] (ecmascript)");
;
;
;
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api/v1") || "http://localhost:5000/api/v1";
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});
apiClient.interceptors.request.use(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$interceptors$2f$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestInterceptor"]);
apiClient.interceptors.response.use(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$interceptors$2f$response$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["successResponseInterceptor"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$interceptors$2f$response$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["responseInterceptor"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/error-handler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleApiError",
    ()=>handleApiError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const handleApiError = (error)=>{
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
        const { response, code, message: msg } = error;
        const data = response?.data;
        return {
            message: data?.message || (code === "ECONNABORTED" ? "Request timeout" : code === "ERR_NETWORK" ? "Network error" : msg),
            statusCode: data?.statusCode || response?.status || 500,
            timestamp: data?.timestamp,
            path: data?.path,
            method: data?.method,
            error: data?.error
        };
    }
    return {
        message: "Unexpected error occurred",
        statusCode: 500
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/helper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unwrapResponse",
    ()=>unwrapResponse
]);
const unwrapResponse = (response)=>{
    if (response && typeof response === 'object' && 'data' in response) {
        return response.data;
    }
    return response;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/auth.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/axios-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/helper.ts [app-client] (ecmascript)");
;
;
;
const authService = {
    register: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/register', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    login: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/login', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    verifyEmail: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/verify-email', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    resendCode: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/resend-code', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    forgotPassword: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/forgot-password', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    resetPassword: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/reset-password', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    changePassword: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/change-password', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    logout: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/logout');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    refresh: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/refresh');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getProfile: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/auth/profile');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    updateProfile: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch('/auth/profile', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    loginWithGoogle: ()=>{
        window.location.href = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].defaults.baseURL}/auth/google`;
    },
    loginWithApple: ()=>{
        window.location.href = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].defaults.baseURL}/auth/apple`;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/authStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth,
    "useAuthActions",
    ()=>useAuthActions,
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react/shallow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/auth.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: async (data)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].login(data);
                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        register: async (data)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].register(data);
                set({
                    isLoading: false
                });
                return {
                    userId: response.id,
                    message: response.message
                };
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        logout: async ()=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].logout();
                set({
                    user: null,
                    profile: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        getProfile: async ()=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getProfile();
                set({
                    profile,
                    user: profile,
                    isAuthenticated: true,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        updateProfile: async (data)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].updateProfile(data);
                set({
                    profile,
                    user: profile,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        checkAuth: async ()=>{
            try {
                await get().getProfile();
            } catch  {
                set({
                    user: null,
                    profile: null,
                    isAuthenticated: false
                });
            }
        },
        clearError: ()=>set({
                error: null
            })
    }));
const useAuth = ()=>{
    _s();
    return useAuthStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useAuth.useAuthStore.useShallow": (state)=>({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                isLoading: state.isLoading,
                error: state.error
            })
    }["useAuth.useAuthStore.useShallow"]));
};
_s(useAuth, "qD8Hsc+sTR4Jw2f+gF4p4ZRDZVo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useAuthStore
    ];
});
const useAuthActions = ()=>{
    _s1();
    return useAuthStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useAuthActions.useAuthStore.useShallow": (state)=>({
                login: state.login,
                register: state.register,
                logout: state.logout,
                getProfile: state.getProfile,
                updateProfile: state.updateProfile,
                clearError: state.clearError,
                checkAuth: state.checkAuth
            })
    }["useAuthActions.useAuthStore.useShallow"]));
};
_s1(useAuthActions, "qD8Hsc+sTR4Jw2f+gF4p4ZRDZVo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useAuthStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthInit",
    ()=>useAuthInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const useAuthInit = ()=>{
    _s();
    const checkAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useAuthInit.useAuthStore[checkAuth]": (state)=>state.checkAuth
    }["useAuthInit.useAuthStore[checkAuth]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuthInit.useEffect": ()=>{
            const hasCookies = document.cookie.includes('access_token');
            if (hasCookies) {
                checkAuth().catch({
                    "useAuthInit.useEffect": (error)=>{
                        console.error('Auth check failed:', error);
                    }
                }["useAuthInit.useEffect"]);
            }
        }
    }["useAuthInit.useEffect"], [
        checkAuth
    ]);
};
_s(useAuthInit, "RsYA/P18sdKzh6r109OsDkR92bE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function Providers({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthInit"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(Providers, "7ZOpT9JAc7y7gMji6J1JvbVPon4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthInit"]
    ];
});
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/TopBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopBar",
    ()=>TopBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function TopBar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-primary text-white py-2 text-center text-sm font-medium",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: [
                "🚚 ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-semibold",
                    children: "Envío gratis"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/TopBar.tsx",
                    lineNumber: 7,
                    columnNumber: 20
                }, this),
                " en compras superiores a",
                ' ',
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-bold",
                    children: "$150.000"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/TopBar.tsx",
                    lineNumber: 8,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/TopBar.tsx",
            lineNumber: 6,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/TopBar.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
}
_c = TopBar;
var _c;
__turbopack_context__.k.register(_c, "TopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/product.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productService",
    ()=>productService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/axios-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/helper.ts [app-client] (ecmascript)");
;
;
;
const productService = {
    getAll: async (filters)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/products', {
                params: filters
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getById: async (id)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`/products/${id}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getBySlug: async (slug)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`/products/slug/${slug}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getFeatured: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/products/meta/featured');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    search: async (query)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/products', {
                params: {
                    search: query,
                    limit: 10
                }
            });
            const paginatedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
            return paginatedData.docs;
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getGenders: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/products/meta/genders');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getCategories: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/products/meta/categories');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getCategoriesByGender: async (gender)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`/products/meta/genders/${gender}/categories`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getSubcategoriesByCategory: async (category)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`/products/meta/categories/${category}/subcategories`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/productStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductActions",
    ()=>useProductActions,
    "useProductStore",
    ()=>useProductStore,
    "useProducts",
    ()=>useProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react/shallow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/product.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
const useProductStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        products: [],
        currentProduct: null,
        featuredProducts: [],
        genders: [],
        categories: [],
        pagination: null,
        isLoading: false,
        error: null,
        fetchProducts: async (filters)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getAll(filters);
                set({
                    products: response.docs,
                    pagination: {
                        totalDocs: response.totalDocs,
                        limit: response.limit,
                        page: response.page,
                        totalPages: response.totalPages,
                        hasNextPage: response.hasNextPage,
                        hasPrevPage: response.hasPrevPage
                    },
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        fetchProductById: async (id)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getById(id);
                set({
                    currentProduct: product,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        fetchProductBySlug: async (slug)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getBySlug(slug);
                set({
                    currentProduct: product,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        fetchFeatured: async ()=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getFeatured();
                set({
                    featuredProducts: products,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        fetchGenders: async ()=>{
            try {
                console.log('Store - Fetching genders from API...');
                const genders = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getGenders();
                console.log('Store - Received genders:', genders);
                set({
                    genders
                });
                console.log('Store - State updated, current genders:', genders);
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                console.error('Store - Error fetching genders:', apiError);
                set({
                    error: apiError.message
                });
                throw error;
            }
        },
        fetchCategoriesByGender: async (gender)=>{
            try {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getCategoriesByGender(gender);
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message
                });
                throw error;
            }
        },
        fetchCategories: async ()=>{
            try {
                const categories = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getCategories();
                set({
                    categories
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message
                });
                throw error;
            }
        },
        fetchSubcategories: async (category)=>{
            try {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].getSubcategoriesByCategory(category);
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message
                });
                throw error;
            }
        },
        searchProducts: async (query)=>{
            try {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$product$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productService"].search(query);
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message
                });
                throw error;
            }
        },
        clearCurrentProduct: ()=>set({
                currentProduct: null
            }),
        clearError: ()=>set({
                error: null
            })
    }));
const useProducts = ()=>{
    _s();
    return useProductStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useProducts.useProductStore.useShallow": (state)=>({
                products: state.products,
                currentProduct: state.currentProduct,
                featuredProducts: state.featuredProducts,
                genders: state.genders,
                categories: state.categories,
                pagination: state.pagination,
                isLoading: state.isLoading,
                error: state.error
            })
    }["useProducts.useProductStore.useShallow"]));
};
_s(useProducts, "kPDa1wXFzXOnm2Io6efYpTxtEQ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useProductStore
    ];
});
const useProductActions = ()=>{
    _s1();
    return useProductStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useProductActions.useProductStore.useShallow": (state)=>({
                fetchProducts: state.fetchProducts,
                fetchProductById: state.fetchProductById,
                fetchProductBySlug: state.fetchProductBySlug,
                fetchFeatured: state.fetchFeatured,
                fetchGenders: state.fetchGenders,
                fetchCategoriesByGender: state.fetchCategoriesByGender,
                fetchCategories: state.fetchCategories,
                fetchSubcategories: state.fetchSubcategories,
                searchProducts: state.searchProducts,
                clearCurrentProduct: state.clearCurrentProduct,
                clearError: state.clearError
            })
    }["useProductActions.useProductStore.useShallow"]));
};
_s1(useProductActions, "kPDa1wXFzXOnm2Io6efYpTxtEQ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useProductStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/CategoryDropdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoryDropdown",
    ()=>CategoryDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/productStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function CategoryDropdown({ gender, label, openGender, setOpenGender }) {
    _s();
    const isOpen = openGender === gender;
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [subcategories, setSubcategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingCategories, setLoadingCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loadingSubcats, setLoadingSubcats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { fetchCategoriesByGender, fetchSubcategories } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductActions"])();
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoryDropdown.useEffect": ()=>{
            if (isOpen && categories.length === 0) {
                setLoadingCategories(true);
                fetchCategoriesByGender(gender).then(setCategories).catch({
                    "CategoryDropdown.useEffect": (error)=>{
                        console.error('Failed to fetch categories:', error);
                        setCategories([]);
                    }
                }["CategoryDropdown.useEffect"]).finally({
                    "CategoryDropdown.useEffect": ()=>setLoadingCategories(false)
                }["CategoryDropdown.useEffect"]);
            }
        }
    }["CategoryDropdown.useEffect"], [
        isOpen,
        gender,
        categories.length,
        fetchCategoriesByGender
    ]);
    const handleMouseEnter = ()=>{
        setOpenGender(gender);
    };
    const handleMouseLeave = ()=>{
        setOpenGender(null);
        setActiveCategory(null);
        setSubcategories([]);
    };
    const handleCategoryHover = async (categorySlug)=>{
        if (categorySlug === activeCategory) return;
        setActiveCategory(categorySlug);
        setLoadingSubcats(true);
        try {
            const subs = await fetchSubcategories(categorySlug);
            setSubcategories(subs);
        } catch (error) {
            console.error('Failed to fetch subcategories:', error);
            setSubcategories([]);
        } finally{
            setLoadingSubcats(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dropdownRef,
        className: "relative",
        onMouseEnter: handleMouseEnter,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "flex items-center gap-1 px-4 py-2 text-text-muted hover:text-primary transition-colors font-medium",
                children: [
                    label,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        className: `w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                        lineNumber: 75,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                lineNumber: 73,
                columnNumber: 13
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 top-full h-3 w-full bg-transparent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                        lineNumber: 83,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 top-full bg-white shadow-lg border border-border rounded-l-xl rounded-r-none z-50 transition-all duration-200 ease-out data-[open=false]:opacity-0 data-[open=false]:translate-y-1",
                        "data-open": isOpen,
                        onMouseLeave: handleMouseLeave,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-[280px] rounded-l-xl",
                                    children: loadingCategories ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-8 bg-gray-200 animate-pulse rounded mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 90,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-8 bg-gray-200 animate-pulse rounded mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 91,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-8 bg-gray-200 animate-pulse rounded"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 92,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                        lineNumber: 89,
                                        columnNumber: 37
                                    }, this) : categories.length > 0 ? categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onMouseEnter: ()=>handleCategoryHover(category),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/products?gender=${gender}&category=${category}`,
                                                className: `block px-6 py-3 hover:bg-accent transition-colors capitalize ${activeCategory === category ? 'bg-accent' : ''}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-text-muted",
                                                    children: category
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 97,
                                                columnNumber: 45
                                            }, this)
                                        }, category, false, {
                                            fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                            lineNumber: 96,
                                            columnNumber: 41
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6 text-sm text-text-muted",
                                        children: "Sin categorías"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                        lineNumber: 107,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                    lineNumber: 87,
                                    columnNumber: 29
                                }, this),
                                activeCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute left-full top-0 w-[340px] h-full bg-white shadow-lg rounded-r-xl border border-border opacity-100 translate-x-0 transition-all duration-200 ease-out",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-semibold tracking-widest text-text-muted uppercase mb-2",
                                                children: "Subcategorías"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 117,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-px bg-border mb-4 opacity-60"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 120,
                                                columnNumber: 41
                                            }, this),
                                            loadingSubcats ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-8 bg-gray-200 animate-pulse rounded"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-8 bg-gray-200 animate-pulse rounded"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 122,
                                                columnNumber: 45
                                            }, this) : subcategories.length > 0 ? subcategories.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/products?gender=${gender}&category=${activeCategory}&subcategory=${sub}`,
                                                    className: "group flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-text-secondary capitalize hover:bg-accent hover:text-primary",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mr-2 h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 53
                                                        }, this),
                                                        sub
                                                    ]
                                                }, sub, true, {
                                                    fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 49
                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-text-muted",
                                                children: "Sin subcategorías"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                                lineNumber: 138,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                        lineNumber: 116,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                                    lineNumber: 113,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                            lineNumber: 85,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
                        lineNumber: 84,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/CategoryDropdown.tsx",
        lineNumber: 67,
        columnNumber: 9
    }, this);
}
_s(CategoryDropdown, "udsljTaFlbREjTTNJ/s7aps8NaI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductActions"]
    ];
});
_c = CategoryDropdown;
var _c;
__turbopack_context__.k.register(_c, "CategoryDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/SearchBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchBar",
    ()=>SearchBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/productStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function SearchBar() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { searchProducts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductActions"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBar.useEffect": ()=>{
            if (!query.trim()) {
                setResults([]);
                return;
            }
            const timeoutId = setTimeout({
                "SearchBar.useEffect.timeoutId": async ()=>{
                    setIsLoading(true);
                    try {
                        const products = await searchProducts(query);
                        setResults(products);
                    } catch (error) {
                        console.error('Search failed:', error);
                        setResults([]);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["SearchBar.useEffect.timeoutId"], 300);
            return ({
                "SearchBar.useEffect": ()=>clearTimeout(timeoutId)
            })["SearchBar.useEffect"];
        }
    }["SearchBar.useEffect"], [
        query,
        searchProducts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBar.useEffect": ()=>{
            const handleClickOutside = {
                "SearchBar.useEffect.handleClickOutside": (event)=>{
                    if (searchRef.current && !searchRef.current.contains(event.target)) {
                        setIsOpen(false);
                    }
                }
            }["SearchBar.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "SearchBar.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["SearchBar.useEffect"];
        }
    }["SearchBar.useEffect"], []);
    const handleSearch = (e)=>{
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery('');
        }
    };
    const handleClear = ()=>{
        setQuery('');
        setResults([]);
        inputRef.current?.focus();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: searchRef,
        className: "relative",
        children: [
            !isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    setIsOpen(true);
                    setTimeout(()=>inputRef.current?.focus(), 100);
                },
                className: "p-2 hover:bg-accent rounded-full transition-colors",
                "aria-label": "Buscar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                    className: "w-5 h-5 text-text-muted"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/SearchBar.tsx",
                    lineNumber: 81,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/SearchBar.tsx",
                lineNumber: 73,
                columnNumber: 17
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-full mt-2 w-[400px] bg-white shadow-lg rounded-lg border border-border overflow-hidden z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSearch,
                        className: "p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/SearchBar.tsx",
                                    lineNumber: 89,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: inputRef,
                                    type: "text",
                                    value: query,
                                    onChange: (e)=>setQuery(e.target.value),
                                    placeholder: "Buscar productos...",
                                    className: "w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/SearchBar.tsx",
                                    lineNumber: 90,
                                    columnNumber: 29
                                }, this),
                                query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleClear,
                                    className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full",
                                    "aria-label": "Limpiar búsqueda",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4 text-text-muted"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/SearchBar.tsx",
                                        lineNumber: 105,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/SearchBar.tsx",
                                    lineNumber: 99,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/SearchBar.tsx",
                            lineNumber: 88,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/SearchBar.tsx",
                        lineNumber: 87,
                        columnNumber: 21
                    }, this),
                    query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-[400px] overflow-y-auto border-t border-border",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center text-text-muted",
                            children: "Buscando..."
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/SearchBar.tsx",
                            lineNumber: 114,
                            columnNumber: 33
                        }, this) : results.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-2",
                            children: results.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/products/${product.slug}`,
                                    onClick: ()=>{
                                        setIsOpen(false);
                                        setQuery('');
                                    },
                                    className: "flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: product.images?.[0] || '/placeholder.png',
                                            alt: product.name,
                                            width: 50,
                                            height: 50,
                                            className: "rounded object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/SearchBar.tsx",
                                            lineNumber: 127,
                                            columnNumber: 45
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium text-text-primary truncate",
                                                    children: product.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/SearchBar.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 49
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-text-muted",
                                                    children: [
                                                        "$",
                                                        product.price.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/SearchBar.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/SearchBar.tsx",
                                            lineNumber: 134,
                                            columnNumber: 45
                                        }, this)
                                    ]
                                }, product.id, true, {
                                    fileName: "[project]/src/components/layout/SearchBar.tsx",
                                    lineNumber: 118,
                                    columnNumber: 41
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/SearchBar.tsx",
                            lineNumber: 116,
                            columnNumber: 33
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center text-text-muted",
                            children: "No se encontraron productos"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/SearchBar.tsx",
                            lineNumber: 142,
                            columnNumber: 33
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/SearchBar.tsx",
                        lineNumber: 112,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/SearchBar.tsx",
                lineNumber: 86,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/SearchBar.tsx",
        lineNumber: 71,
        columnNumber: 9
    }, this);
}
_s(SearchBar, "Bertl4I6/JgUNMhNlO/2rlYipmU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductActions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SearchBar;
var _c;
__turbopack_context__.k.register(_c, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/UserMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/layout/UserMenu.tsx
__turbopack_context__.s([
    "UserMenu",
    ()=>UserMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function UserMenu() {
    _s();
    const { isAuthenticated, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthActions"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserMenu.useEffect": ()=>{
            const handleClickOutside = {
                "UserMenu.useEffect.handleClickOutside": (event)=>{
                    if (menuRef.current && !menuRef.current.contains(event.target)) {
                        setIsOpen(false);
                    }
                }
            }["UserMenu.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "UserMenu.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["UserMenu.useEffect"];
        }
    }["UserMenu.useEffect"], []);
    const handleLogout = async ()=>{
        try {
            await logout();
            setIsOpen(false);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/login",
            className: "p-2 hover:bg-accent rounded-full transition-colors",
            "aria-label": "Iniciar sesión",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                className: "w-5 h-5 text-text-muted"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/UserMenu.tsx",
                lineNumber: 46,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/layout/UserMenu.tsx",
            lineNumber: 41,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: menuRef,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "p-2 hover:bg-accent rounded-full transition-colors",
                "aria-label": "Menú de usuario",
                children: user?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: user.avatar,
                    alt: user.name,
                    className: "w-8 h-8 rounded-full object-cover"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/UserMenu.tsx",
                    lineNumber: 59,
                    columnNumber: 21
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 rounded-full bg-primary flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-white text-sm font-semibold",
                        children: user?.name.charAt(0).toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/UserMenu.tsx",
                        lineNumber: 66,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/UserMenu.tsx",
                    lineNumber: 65,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/UserMenu.tsx",
                lineNumber: 53,
                columnNumber: 13
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-border overflow-hidden z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-b border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium text-text-primary truncate",
                                children: user?.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/UserMenu.tsx",
                                lineNumber: 76,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-text-muted truncate",
                                children: user?.email
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/UserMenu.tsx",
                                lineNumber: 77,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/UserMenu.tsx",
                        lineNumber: 75,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/profile",
                                onClick: ()=>setIsOpen(false),
                                className: "flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/UserMenu.tsx",
                                        lineNumber: 86,
                                        columnNumber: 29
                                    }, this),
                                    "Mi Perfil"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/UserMenu.tsx",
                                lineNumber: 81,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/orders",
                                onClick: ()=>setIsOpen(false),
                                className: "flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/UserMenu.tsx",
                                        lineNumber: 95,
                                        columnNumber: 29
                                    }, this),
                                    "Mis Órdenes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/UserMenu.tsx",
                                lineNumber: 90,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/wishlist",
                                onClick: ()=>setIsOpen(false),
                                className: "flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/UserMenu.tsx",
                                        lineNumber: 104,
                                        columnNumber: 29
                                    }, this),
                                    "Lista de Deseos"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/UserMenu.tsx",
                                lineNumber: 99,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/UserMenu.tsx",
                        lineNumber: 80,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLogout,
                            className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/UserMenu.tsx",
                                    lineNumber: 114,
                                    columnNumber: 29
                                }, this),
                                "Cerrar Sesión"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/UserMenu.tsx",
                            lineNumber: 110,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/UserMenu.tsx",
                        lineNumber: 109,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/UserMenu.tsx",
                lineNumber: 74,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/UserMenu.tsx",
        lineNumber: 52,
        columnNumber: 9
    }, this);
}
_s(UserMenu, "IXZyrqBrwFWlZJKbHp6XWfroScA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthActions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = UserMenu;
var _c;
__turbopack_context__.k.register(_c, "UserMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/cart.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cartService",
    ()=>cartService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/axios-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/helper.ts [app-client] (ecmascript)");
;
;
;
const cartService = {
    getCart: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/cart');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    addToCart: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/cart/items', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    updateCartItem: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch('/cart/items', data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    removeFromCart: async (data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete('/cart/items', {
                data
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    clearCart: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete('/cart');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    mergeCart: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/cart/merge');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/cartStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCart",
    ()=>useCart,
    "useCartActions",
    ()=>useCartActions,
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react/shallow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cart$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/cart.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        cart: null,
        isLoading: false,
        error: null,
        fetchCart: async ()=>{
            set({
                isLoading: true
            });
            try {
                const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cart$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartService"].getCart();
                set({
                    cart,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        addToCart: async (data)=>{
            set({
                isLoading: true
            });
            try {
                const { cart } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cart$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartService"].addToCart(data);
                set({
                    cart,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        updateCartItem: async (data)=>{
            set({
                isLoading: true
            });
            try {
                const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cart$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartService"].updateCartItem(data);
                set({
                    cart,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        removeFromCart: async (data)=>{
            set({
                isLoading: true
            });
            try {
                const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cart$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartService"].removeFromCart(data);
                set({
                    cart,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        clearCart: async ()=>{
            set({
                isLoading: true
            });
            try {
                const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cart$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartService"].clearCart();
                set({
                    cart,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        clearError: ()=>set({
                error: null
            })
    }));
const useCart = ()=>{
    _s();
    return useCartStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useCart.useCartStore.useShallow": (state)=>({
                cart: state.cart,
                isLoading: state.isLoading,
                error: state.error
            })
    }["useCart.useCartStore.useShallow"]));
};
_s(useCart, "DsslesM7/Bxxk43MfPWJGyIveCI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useCartStore
    ];
});
const useCartActions = ()=>{
    _s1();
    return useCartStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useCartActions.useCartStore.useShallow": (state)=>({
                fetchCart: state.fetchCart,
                addToCart: state.addToCart,
                updateCartItem: state.updateCartItem,
                removeFromCart: state.removeFromCart,
                clearCart: state.clearCart,
                clearError: state.clearError
            })
    }["useCartActions.useCartStore.useShallow"]));
};
_s1(useCartActions, "DsslesM7/Bxxk43MfPWJGyIveCI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useCartStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/CartIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartIcon",
    ()=>CartIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cartStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function CartIcon() {
    _s();
    const { cart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { fetchCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartActions"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartIcon.useEffect": ()=>{
            fetchCart();
        }
    }["CartIcon.useEffect"], [
        fetchCart
    ]);
    const itemCount = cart?.itemCount || 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: "/cart",
        className: "relative p-2 hover:bg-accent rounded-full transition-colors",
        "aria-label": "Carrito de compras",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                className: "w-5 h-5 text-text-muted"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/CartIcon.tsx",
                lineNumber: 24,
                columnNumber: 13
            }, this),
            itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center",
                children: itemCount > 9 ? '9+' : itemCount
            }, void 0, false, {
                fileName: "[project]/src/components/layout/CartIcon.tsx",
                lineNumber: 26,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/CartIcon.tsx",
        lineNumber: 19,
        columnNumber: 9
    }, this);
}
_s(CartIcon, "7my3TqBQi0yghW9qYKIppECN7dM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartActions"]
    ];
});
_c = CartIcon;
var _c;
__turbopack_context__.k.register(_c, "CartIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/user.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userService",
    ()=>userService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/axios-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/helper.ts [app-client] (ecmascript)");
;
;
;
const userService = {
    getWishlist: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/users/me/wishlist');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    addToWishlist: async (productId)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(`/users/me/wishlist/${productId}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    removeFromWishlist: async (productId)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(`/users/me/wishlist/${productId}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    clearWishlist: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete('/users/me/wishlist');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    // Admin endpoints
    getAllUsers: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/users');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    getUserById: async (id)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`/users/${id}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    updateUser: async (id, data)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch(`/users/${id}`, data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    },
    deleteUser: async (id)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axios$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(`/users/${id}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unwrapResponse"])(response.data);
        } catch (error) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/wishlistStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWishlist",
    ()=>useWishlist,
    "useWishlistActions",
    ()=>useWishlistActions,
    "useWishlistStore",
    ()=>useWishlistStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react/shallow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/user.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/error-handler.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
const useWishlistStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        items: [],
        isLoading: false,
        error: null,
        fetchWishlist: async ()=>{
            set({
                isLoading: true
            });
            try {
                const items = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].getWishlist();
                set({
                    items,
                    isLoading: false
                });
            } catch (error) {
                const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$error$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error);
                set({
                    error: apiError.message,
                    isLoading: false
                });
                throw error;
            }
        },
        addToWishlist: async (productId)=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].addToWishlist(productId);
            await get().fetchWishlist();
        },
        removeFromWishlist: async (productId)=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].removeFromWishlist(productId);
            await get().fetchWishlist();
        },
        clearWishlist: async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].clearWishlist();
            set({
                items: []
            });
        },
        isInWishlist: (productId)=>get().items.some((item)=>item.id === productId),
        clearError: ()=>set({
                error: null
            })
    }));
const useWishlist = ()=>{
    _s();
    return useWishlistStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useWishlist.useWishlistStore.useShallow": (state)=>({
                items: state.items,
                isLoading: state.isLoading,
                error: state.error,
                count: state.items.length
            })
    }["useWishlist.useWishlistStore.useShallow"]));
};
_s(useWishlist, "Rv9CNpF51JYmCdR21IA1jJL1LO4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useWishlistStore
    ];
});
const useWishlistActions = ()=>{
    _s1();
    return useWishlistStore({
        "useWishlistActions.useWishlistStore": (state)=>({
                fetchWishlist: state.fetchWishlist,
                addToWishlist: state.addToWishlist,
                removeFromWishlist: state.removeFromWishlist,
                clearWishlist: state.clearWishlist,
                isInWishlist: state.isInWishlist,
                clearError: state.clearError
            })
    }["useWishlistActions.useWishlistStore"]);
};
_s1(useWishlistActions, "e1stohL2dNChoEfq/MD2aqMh4wA=", false, function() {
    return [
        useWishlistStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/TopBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$CategoryDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/CategoryDropdown.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/SearchBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$UserMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/UserMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$CartIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/CartIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/wishlistStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/productStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function Navbar() {
    _s();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { count: wishlistCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWishlist"])();
    const { genders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProducts"])();
    const { fetchGenders } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductActions"])();
    const [openGender, setOpenGender] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            fetchGenders().catch({
                "Navbar.useEffect": (error)=>{
                    console.error('Failed to fetch genders:', error);
                }
            }["Navbar.useEffect"]);
        }
    }["Navbar.useEffect"], [
        fetchGenders
    ]);
    const genderLabels = {
        male: 'Hombre',
        female: 'Mujer',
        kid: 'Niño',
        unisex: 'Unisex'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-40 bg-white shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopBar"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/Navbar.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "max-w-7xl mx-auto px-4 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: genders.length > 0 ? genders.map((gender)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$CategoryDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CategoryDropdown"], {
                                    gender: gender,
                                    label: genderLabels[gender] || gender,
                                    openGender: openGender,
                                    setOpenGender: setOpenGender
                                }, gender, false, {
                                    fileName: "[project]/src/components/layout/Navbar.tsx",
                                    lineNumber: 46,
                                    columnNumber: 17
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-10 w-20 bg-gray-200 animate-pulse rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Navbar.tsx",
                                        lineNumber: 56,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-10 w-20 bg-gray-200 animate-pulse rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Navbar.tsx",
                                        lineNumber: 57,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-10 w-20 bg-gray-200 animate-pulse rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Navbar.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Navbar.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "absolute left-1/2 -translate-x-1/2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/LOGO_LA_PILCHA.png",
                                alt: "Logo",
                                width: 100,
                                height: 100
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Navbar.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchBar"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/Navbar.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/wishlist",
                                    className: "relative p-2 hover:bg-accent rounded-full transition-colors",
                                    "aria-label": "Lista de deseos",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                            className: "w-5 h-5 text-text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Navbar.tsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this),
                                        wishlistCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center",
                                            children: wishlistCount > 9 ? '9+' : wishlistCount
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Navbar.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Navbar.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$UserMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserMenu"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/Navbar.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$CartIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartIcon"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/Navbar.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Navbar.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Navbar.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Navbar.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Navbar.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(Navbar, "sONfHwCJY3w8QgekCZBDDFPOyBM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$wishlistStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWishlist"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProducts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$productStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductActions"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_3abf8f24._.js.map