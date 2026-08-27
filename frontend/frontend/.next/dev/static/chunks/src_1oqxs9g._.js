(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/apis/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/auth.store.js [app-client] (ecmascript)");
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8080/api/v1") || "http://localhost:8080/api/v1";
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use((config)=>{
    const accessToken = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().accessToken;
    if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error)=>Promise.reject(error));
// Response Interceptor: Handle 401 & Refresh Token rotation
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null)=>{
    failedQueue.forEach((prom)=>{
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject)=>{
                failedQueue.push({
                    resolve,
                    reject
                });
            }).then((token)=>{
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            }).catch((err)=>Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        const refreshToken = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().refreshToken;
        if (!refreshToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().logout();
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
        try {
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken
            });
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken || refreshToken;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().setAuth({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().logout();
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);
        } finally{
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/apis/auth.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/api.js [app-client] (ecmascript)");
;
const authApi = {
    register: async (registerData)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/register", registerData);
        return response.data;
    },
    login: async (credentials)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/login", credentials);
        return response.data;
    },
    logout: async (refreshToken)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/logout", {
                refreshToken
            });
            return response.data;
        } catch  {
            return {
                success: true
            };
        }
    },
    refreshToken: async (refreshToken)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/refresh", {
            refreshToken
        });
        return response.data;
    },
    getCurrentUser: async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/auth/me");
            return response.data;
        } catch  {
            return null;
        }
    },
    updateProfile: async (profileData)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put("/auth/profile", profileData);
            return response.data;
        } catch  {
            return profileData;
        }
    },
    changePassword: async (passwordData)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/auth/change-password", passwordData);
            return response.data;
        } catch  {
            return {
                success: true
            };
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/apis/category.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categoryApi",
    ()=>categoryApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/api.js [app-client] (ecmascript)");
;
const categoryApi = {
    // GET /categories
    getAll: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/categories");
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // GET /categories/tree
    getTree: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/categories/tree");
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // GET /categories/{id}
    getById: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/categories/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // POST /categories
    create: async (data)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/categories", data);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // PUT /categories/{id}
    update: async (id, data)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/categories/${id}`, data);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // DELETE /categories/{id}
    delete: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/categories/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/apis/note.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "noteApi",
    ()=>noteApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/api.js [app-client] (ecmascript)");
;
const noteApi = {
    // GET /notes
    getAll: async (params = {})=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/notes", {
            params
        });
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // GET /notes/{id}
    getById: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notes/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // POST /notes
    create: async (payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/notes", payload);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // PUT /notes/{id}
    update: async (id, payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/notes/${id}`, payload);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // DELETE /notes/{id}
    delete: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/notes/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/apis/notification.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notificationApi",
    ()=>notificationApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/api.js [app-client] (ecmascript)");
;
const notificationApi = {
    getNotifications: async (page = 0, size = 20)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/notifications?page=${page}&size=${size}`);
        return res.data;
    },
    markAsRead: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/notifications/${id}/read`);
        return res.data;
    },
    markAllAsRead: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/notifications/read-all`);
        return res.data;
    },
    deleteNotification: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/notifications/${id}`);
        return res.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/apis/resource.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resourceApi",
    ()=>resourceApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/api.js [app-client] (ecmascript)");
;
const resourceApi = {
    // GET /resources
    getAll: async (params = {})=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/resources", {
            params
        });
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // GET /resources/favorites
    getFavorites: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/resources/favorites");
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // GET /resources/{id}
    getById: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/resources/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // POST /resources
    create: async (payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/resources", payload);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // PUT /resources/{id}
    update: async (id, payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/resources/${id}`, payload);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // DELETE /resources/{id}
    delete: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/resources/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/apis/task.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "taskApi",
    ()=>taskApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/api.js [app-client] (ecmascript)");
;
const taskApi = {
    // GET /tasks
    getAll: async (params = {})=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/tasks", {
            params
        });
        if (res.data && Array.isArray(res.data.content)) {
            return res.data.content;
        }
        return Array.isArray(res.data) ? res.data : [];
    },
    // GET /tasks/{id}
    getById: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/tasks/${id}`);
        return res.data;
    },
    // POST /tasks
    create: async (data)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/tasks", data);
        return res.data;
    },
    // PUT /tasks/{id}
    update: async (id, data)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/tasks/${id}`, data);
        return res.data;
    },
    // PATCH /tasks/{id}/status
    updateStatus: async (id, status)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/tasks/${id}/status`, {
            status
        });
        return res.data;
    },
    // DELETE /tasks/{id}
    delete: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/tasks/${id}`);
        return res.data;
    },
    // GET /tasks/stats
    getStats: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/tasks/stats");
        return res.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/apis/tracker.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "trackerApi",
    ()=>trackerApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/api.js [app-client] (ecmascript)");
;
const trackerApi = {
    // GET /trackers
    getAll: async (params = {})=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/trackers", {
            params
        });
        const payload = res.data?.data !== undefined ? res.data.data : res.data;
        if (payload?.content) {
            return {
                content: payload.content,
                totalPages: payload.totalPages,
                totalElements: payload.totalElements,
                number: payload.number
            };
        }
        return {
            content: Array.isArray(payload) ? payload : [],
            totalPages: 1,
            totalElements: 0,
            number: 0
        };
    },
    // GET /trackers/{id}
    getById: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/trackers/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // POST /trackers
    create: async (payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/trackers", payload);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // PUT /trackers/{id}
    update: async (id, payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/trackers/${id}`, payload);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // PATCH /trackers/{id}/status
    updateStatus: async (id, status)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/trackers/${id}/status`, {
            status
        });
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // DELETE /trackers/{id}
    delete: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/trackers/${id}`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // POST /trackers/{id}/values
    saveValue: async (id, valuePayload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/trackers/${id}/values`, valuePayload);
        return res.data?.data !== undefined ? res.data.data : res.data;
    },
    // GET /trackers/{id}/values
    getValues: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/trackers/${id}/values`);
        return res.data?.data !== undefined ? res.data.data : res.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(workspace)/profile/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$MainLayout$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/MainLayout.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/auth.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$category$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/category.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$task$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/task.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/auth.api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key.mjs [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs [app-client] (ecmascript) <export default as FolderTree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuth.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function ProfilePage() {
    _s();
    const { user, updateUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { themeMode, themePreset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    const { categories, fetchCategories } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$category$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategoryStore"])();
    const { tasks, fetchTasks } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$task$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskStore"])();
    const { logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfilePage.useEffect": ()=>{
            fetchCategories();
            fetchTasks();
        }
    }["ProfilePage.useEffect"], [
        fetchCategories,
        fetchTasks
    ]);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        username: user?.username || "",
        email: user?.email || "",
        gender: user?.gender || "MALE",
        bio: user?.bio || "Architect of personal knowledge systems, tracking goals and learning milestones."
    });
    const [passwordData, setPasswordData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [savingProfile, setSavingProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savedSuccess, setSavedSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [updatingPassword, setUpdatingPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [passwordSuccess, setPasswordSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [passwordError, setPasswordError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleProfileSave = async (e)=>{
        e.preventDefault();
        setSavingProfile(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].updateProfile(formData);
            updateUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                gender: formData.gender,
                bio: formData.bio
            });
            setSavedSuccess(true);
            setTimeout(()=>setSavedSuccess(false), 3000);
        } catch  {
            // Fallback local sync
            updateUser(formData);
            setSavedSuccess(true);
            setTimeout(()=>setSavedSuccess(false), 3000);
        } finally{
            setSavingProfile(false);
        }
    };
    const handlePasswordChange = async (e)=>{
        e.preventDefault();
        setPasswordError("");
        if (!passwordData.currentPassword) {
            setPasswordError("Please enter your current password.");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        setUpdatingPassword(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess(true);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setTimeout(()=>setPasswordSuccess(false), 3000);
        } catch (err) {
            setPasswordError(err.response?.data?.message || "Failed to update password.");
        } finally{
            setUpdatingPassword(false);
        }
    };
    const completedTasksCount = tasks.filter((t)=>t.status === "COMPLETED").length;
    const displayName = formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : formData.username || "System Commander";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$MainLayout$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--secondary)]/20 blur-3xl"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col md:flex-row items-center gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[var(--primary)] via-purple-600 to-[var(--secondary)] text-white text-3xl font-extrabold shadow-2xl shadow-[var(--primary)]/30 border-2 border-white/20 font-mono",
                                                    children: formData.firstName?.[0] || formData.username?.[0] || "V"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 137,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 border-2 border-[var(--surface)] text-[10px] text-white font-bold",
                                                    title: "System Verified"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 140,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center justify-center md:justify-start gap-2.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                            className: "text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono tracking-tight",
                                                            children: displayName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 146,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-3 py-0.5 text-[10px] font-extrabold font-mono text-[var(--primary)] uppercase tracking-wider",
                                                            children: "Knowledge Architect"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 149,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 145,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[var(--text-muted)] font-mono flex items-center justify-center md:justify-start gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "@",
                                                                formData.username || "commander"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 155,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "•"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 156,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: formData.email || "commander@vegarecords.io"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 157,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 154,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 font-mono text-[11px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                                    lineNumber: 162,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "SYSTEM ONLINE"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 161,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center gap-1 text-[var(--text-muted)] bg-[var(--card)] border border-[var(--border)] px-2.5 py-1 rounded-lg",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                    className: "h-3 w-3 text-[var(--primary)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                                    lineNumber: 166,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "ROLE: ADMIN_ROOT"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 165,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center gap-1 text-[var(--text-muted)] bg-[var(--card)] border border-[var(--border)] px-2.5 py-1 rounded-lg",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                    className: "h-3 w-3 text-[var(--secondary)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                                    lineNumber: 170,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "MEMBER SINCE AUG 2026"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 169,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 160,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 144,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: logout,
                                    className: "flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-mono font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        "Sign Out"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                    lineNumber: 129,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
                    children: [
                        {
                            label: "Category Tree Nodes",
                            val: `${categories.length} Nodes`,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"],
                            color: "text-[var(--primary)]"
                        },
                        {
                            label: "Total Tasks Logged",
                            val: `${tasks.length} Logged`,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
                            color: "text-cyan-400"
                        },
                        {
                            label: "Tasks Completed",
                            val: `${completedTasksCount} Completed`,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
                            color: "text-emerald-400"
                        },
                        {
                            label: "Active Theme Mode",
                            val: `${themeMode.toUpperCase()} / ${themePreset.toUpperCase()}`,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
                            color: "text-amber-400"
                        }
                    ].map((stat, idx)=>{
                        const Icon = stat.icon;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1.5 shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider",
                                            children: stat.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 200,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: `h-4 w-4 ${stat.color}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 201,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base font-extrabold text-[var(--text)] font-mono",
                                    children: stat.val
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 203,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, idx, true, {
                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                            lineNumber: 198,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between border-b border-[var(--border)] pb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-base font-bold text-[var(--text)] font-mono flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "h-4 w-4 text-[var(--primary)]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                        lineNumber: 216,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Personal Profile Details"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                lineNumber: 215,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[var(--text-muted)] font-mono mt-0.5",
                                                children: "Update your identity, display names, and system bio."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                lineNumber: 218,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleProfileSave,
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                            children: "First Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 228,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: formData.firstName,
                                                            onChange: (e)=>setFormData({
                                                                    ...formData,
                                                                    firstName: e.target.value
                                                                }),
                                                            placeholder: "Enter first name",
                                                            className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 231,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 227,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                            children: "Last Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 241,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: formData.lastName,
                                                            onChange: (e)=>setFormData({
                                                                    ...formData,
                                                                    lastName: e.target.value
                                                                }),
                                                            placeholder: "Enter last name",
                                                            className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 244,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 240,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                            children: "Username Handle"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 257,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "absolute left-3.5 top-2.5 text-xs text-[var(--text-muted)] font-mono",
                                                                    children: "@"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: formData.username,
                                                                    onChange: (e)=>setFormData({
                                                                            ...formData,
                                                                            username: e.target.value
                                                                        }),
                                                                    placeholder: "username",
                                                                    className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-8 pr-4 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                                    lineNumber: 262,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 260,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 256,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                            children: "Email Address"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 273,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                    className: "absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                                    lineNumber: 277,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "email",
                                                                    value: formData.email,
                                                                    onChange: (e)=>setFormData({
                                                                            ...formData,
                                                                            email: e.target.value
                                                                        }),
                                                                    placeholder: "you@example.com",
                                                                    className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                                    lineNumber: 278,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 276,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 272,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                    children: "Gender Identification"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 291,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.gender,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            gender: e.target.value
                                                        }),
                                                    className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] focus:border-[var(--primary)] focus:outline-none font-mono",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "MALE",
                                                            className: "bg-[var(--surface)] text-[var(--text)]",
                                                            children: "Male"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 299,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "FEMALE",
                                                            className: "bg-[var(--surface)] text-[var(--text)]",
                                                            children: "Female"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 300,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "OTHER",
                                                            className: "bg-[var(--surface)] text-[var(--text)]",
                                                            children: "Other"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 301,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 294,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 290,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                    children: "Personal Objective & Bio"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 307,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    rows: 3,
                                                    value: formData.bio,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            bio: e.target.value
                                                        }),
                                                    placeholder: "Describe your personal knowledge goals...",
                                                    className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono leading-relaxed resize-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 310,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 306,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    disabled: savingProfile,
                                                    className: "flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-2.5 text-xs font-mono font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:opacity-90 transition-opacity disabled:opacity-50",
                                                    children: [
                                                        savingProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                            className: "h-4 w-4 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 326,
                                                            columnNumber: 36
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 326,
                                                            columnNumber: 83
                                                        }, this),
                                                        "Save Profile Changes"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 321,
                                                    columnNumber: 17
                                                }, this),
                                                savedSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                            lineNumber: 332,
                                                            columnNumber: 21
                                                        }, this),
                                                        " Profile Synced!"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 331,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 224,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm h-fit",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-b border-[var(--border)] pb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-base font-bold text-[var(--text)] font-mono flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                    className: "h-4 w-4 text-[var(--primary)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 343,
                                                    columnNumber: 17
                                                }, this),
                                                " Password & Security"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 342,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[var(--text-muted)] font-mono mt-0.5",
                                            children: "Update account credentials & security access tokens."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 345,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handlePasswordChange,
                                    className: "space-y-4",
                                    children: [
                                        passwordError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-400",
                                            children: passwordError
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 352,
                                            columnNumber: 17
                                        }, this),
                                        passwordSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 359,
                                                    columnNumber: 19
                                                }, this),
                                                " Password updated successfully!"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 358,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                    children: "Current Password"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 364,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    value: passwordData.currentPassword,
                                                    onChange: (e)=>setPasswordData({
                                                            ...passwordData,
                                                            currentPassword: e.target.value
                                                        }),
                                                    placeholder: "••••••••",
                                                    className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 367,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                    children: "New Password"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 377,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    value: passwordData.newPassword,
                                                    onChange: (e)=>setPasswordData({
                                                            ...passwordData,
                                                            newPassword: e.target.value
                                                        }),
                                                    placeholder: "••••••••",
                                                    className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 380,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 376,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-semibold text-[var(--text)] font-mono mb-1.5",
                                                    children: "Confirm New Password"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 390,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    value: passwordData.confirmPassword,
                                                    onChange: (e)=>setPasswordData({
                                                            ...passwordData,
                                                            confirmPassword: e.target.value
                                                        }),
                                                    placeholder: "••••••••",
                                                    className: "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none font-mono"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 393,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 389,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: updatingPassword,
                                            className: "w-full rounded-xl border border-[var(--border)] bg-[var(--hover-bg)] py-2.5 text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors flex items-center justify-center gap-2 disabled:opacity-50",
                                            children: [
                                                updatingPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "h-4 w-4 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                                    lineNumber: 407,
                                                    columnNumber: 38
                                                }, this),
                                                "Update Password"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                            lineNumber: 402,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                                    lineNumber: 350,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(workspace)/profile/page.jsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(workspace)/profile/page.jsx",
            lineNumber: 127,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(workspace)/profile/page.jsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_s(ProfilePage, "3BtJU5zKbmPIdropTuNpunDs0fk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$category$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategoryStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$task$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ProfilePage;
var _c;
__turbopack_context__.k.register(_c, "ProfilePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/GlobalCommandPalette.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalCommandPalette
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$search$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/search.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$task$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/task.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$note$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/note.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$resource$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/resource.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tracker$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/tracker.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$category$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/category.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark.mjs [app-client] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs [app-client] (ecmascript) <export default as FolderTree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$command$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Command$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/command.mjs [app-client] (ecmascript) <export default as Command>");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
function GlobalCommandPalette() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isCommandPaletteOpen, closeCommandPalette, recentSearches, addRecentSearch, removeRecentSearch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$search$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchStore"])();
    const { tasks } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$task$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskStore"])();
    const { notes, setSelectedNote } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$note$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNoteStore"])();
    const { resources, setSelectedResource } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$resource$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResourceStore"])();
    const { trackers, setSelectedTracker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tracker$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackerStore"])();
    const { categories } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$category$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategoryStore"])();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Focus input on open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalCommandPalette.useEffect": ()=>{
            if (isCommandPaletteOpen) {
                setQuery("");
                setSelectedIndex(0);
                setTimeout({
                    "GlobalCommandPalette.useEffect": ()=>inputRef.current?.focus()
                }["GlobalCommandPalette.useEffect"], 50);
            }
        }
    }["GlobalCommandPalette.useEffect"], [
        isCommandPaletteOpen
    ]);
    // Combined real search results across all stores
    const searchResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GlobalCommandPalette.useMemo[searchResults]": ()=>{
            if (!query.trim()) return [];
            const q = query.toLowerCase().trim();
            const matchedTasks = tasks.filter({
                "GlobalCommandPalette.useMemo[searchResults].matchedTasks": (t)=>t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
            }["GlobalCommandPalette.useMemo[searchResults].matchedTasks"]).slice(0, 4).map({
                "GlobalCommandPalette.useMemo[searchResults].matchedTasks": (t)=>({
                        id: `task-${t.id}`,
                        title: t.title,
                        type: "Task",
                        subtitle: t.status || "TASK",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
                        color: "text-emerald-400",
                        action: ({
                            "GlobalCommandPalette.useMemo[searchResults].matchedTasks": ()=>{
                                router.push(`/tasks`);
                            }
                        })["GlobalCommandPalette.useMemo[searchResults].matchedTasks"]
                    })
            }["GlobalCommandPalette.useMemo[searchResults].matchedTasks"]);
            const matchedNotes = notes.filter({
                "GlobalCommandPalette.useMemo[searchResults].matchedNotes": (n)=>n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)
            }["GlobalCommandPalette.useMemo[searchResults].matchedNotes"]).slice(0, 4).map({
                "GlobalCommandPalette.useMemo[searchResults].matchedNotes": (n)=>({
                        id: `note-${n.id}`,
                        title: n.title,
                        type: "Note",
                        subtitle: n.categoryName || "Wiki Document",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                        color: "text-[#8b5cf6]",
                        action: ({
                            "GlobalCommandPalette.useMemo[searchResults].matchedNotes": ()=>{
                                setSelectedNote(n);
                                router.push(`/notes`);
                            }
                        })["GlobalCommandPalette.useMemo[searchResults].matchedNotes"]
                    })
            }["GlobalCommandPalette.useMemo[searchResults].matchedNotes"]);
            const matchedResources = resources.filter({
                "GlobalCommandPalette.useMemo[searchResults].matchedResources": (r)=>r.title?.toLowerCase().includes(q) || r.url?.toLowerCase().includes(q)
            }["GlobalCommandPalette.useMemo[searchResults].matchedResources"]).slice(0, 4).map({
                "GlobalCommandPalette.useMemo[searchResults].matchedResources": (r)=>({
                        id: `res-${r.id}`,
                        title: r.title,
                        type: "Resource",
                        subtitle: r.resourceType || "LINK",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"],
                        color: "text-cyan-400",
                        action: ({
                            "GlobalCommandPalette.useMemo[searchResults].matchedResources": ()=>{
                                setSelectedResource(r);
                                router.push(`/resources`);
                            }
                        })["GlobalCommandPalette.useMemo[searchResults].matchedResources"]
                    })
            }["GlobalCommandPalette.useMemo[searchResults].matchedResources"]);
            const matchedTrackers = trackers.filter({
                "GlobalCommandPalette.useMemo[searchResults].matchedTrackers": (tr)=>tr.title?.toLowerCase().includes(q) || tr.description?.toLowerCase().includes(q)
            }["GlobalCommandPalette.useMemo[searchResults].matchedTrackers"]).slice(0, 4).map({
                "GlobalCommandPalette.useMemo[searchResults].matchedTrackers": (tr)=>({
                        id: `tr-${tr.id}`,
                        title: tr.title,
                        type: "Tracker",
                        subtitle: `${tr.progress || 0}% Complete`,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
                        color: "text-amber-400",
                        action: ({
                            "GlobalCommandPalette.useMemo[searchResults].matchedTrackers": ()=>{
                                setSelectedTracker(tr);
                                router.push(`/trackers`);
                            }
                        })["GlobalCommandPalette.useMemo[searchResults].matchedTrackers"]
                    })
            }["GlobalCommandPalette.useMemo[searchResults].matchedTrackers"]);
            const matchedCategories = categories.filter({
                "GlobalCommandPalette.useMemo[searchResults].matchedCategories": (c)=>c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
            }["GlobalCommandPalette.useMemo[searchResults].matchedCategories"]).slice(0, 3).map({
                "GlobalCommandPalette.useMemo[searchResults].matchedCategories": (c)=>({
                        id: `cat-${c.id}`,
                        title: c.name,
                        type: "Category",
                        subtitle: "Workspace Node",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"],
                        color: "text-purple-400",
                        action: ({
                            "GlobalCommandPalette.useMemo[searchResults].matchedCategories": ()=>{
                                router.push(`/categories`);
                            }
                        })["GlobalCommandPalette.useMemo[searchResults].matchedCategories"]
                    })
            }["GlobalCommandPalette.useMemo[searchResults].matchedCategories"]);
            return [
                ...matchedTasks,
                ...matchedNotes,
                ...matchedResources,
                ...matchedTrackers,
                ...matchedCategories
            ];
        }
    }["GlobalCommandPalette.useMemo[searchResults]"], [
        query,
        tasks,
        notes,
        resources,
        trackers,
        categories,
        router,
        setSelectedNote,
        setSelectedResource,
        setSelectedTracker
    ]);
    // Quick Action Shortcuts when query is empty
    const quickActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GlobalCommandPalette.useMemo[quickActions]": ()=>[
                {
                    id: "act-new-task",
                    title: "Create New Task",
                    type: "Action",
                    subtitle: "Add task to board",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
                    color: "text-emerald-400",
                    action: {
                        "GlobalCommandPalette.useMemo[quickActions]": ()=>router.push("/tasks")
                    }["GlobalCommandPalette.useMemo[quickActions]"]
                },
                {
                    id: "act-new-note",
                    title: "Write New Knowledge Note",
                    type: "Action",
                    subtitle: "Open Obsidian Markdown Editor",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                    color: "text-[#8b5cf6]",
                    action: {
                        "GlobalCommandPalette.useMemo[quickActions]": ()=>router.push("/notes")
                    }["GlobalCommandPalette.useMemo[quickActions]"]
                },
                {
                    id: "act-trackers",
                    title: "Open Tracker Hub",
                    type: "Action",
                    subtitle: "View progress rings & timelines",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
                    color: "text-amber-400",
                    action: {
                        "GlobalCommandPalette.useMemo[quickActions]": ()=>router.push("/trackers")
                    }["GlobalCommandPalette.useMemo[quickActions]"]
                },
                {
                    id: "act-activity",
                    title: "View Activity Feed",
                    type: "Action",
                    subtitle: "GitHub style event log",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
                    color: "text-cyan-400",
                    action: {
                        "GlobalCommandPalette.useMemo[quickActions]": ()=>router.push("/activity")
                    }["GlobalCommandPalette.useMemo[quickActions]"]
                }
            ]
    }["GlobalCommandPalette.useMemo[quickActions]"], [
        router
    ]);
    const activeList = query.trim() ? searchResults : quickActions;
    // Keyboard navigation handler
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalCommandPalette.useEffect": ()=>{
            if (!isCommandPaletteOpen) return;
            const handleKeyDown = {
                "GlobalCommandPalette.useEffect.handleKeyDown": (e)=>{
                    if (e.key === "Escape") {
                        closeCommandPalette();
                    } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setSelectedIndex({
                            "GlobalCommandPalette.useEffect.handleKeyDown": (prev)=>(prev + 1) % (activeList.length || 1)
                        }["GlobalCommandPalette.useEffect.handleKeyDown"]);
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setSelectedIndex({
                            "GlobalCommandPalette.useEffect.handleKeyDown": (prev)=>(prev - 1 + activeList.length) % (activeList.length || 1)
                        }["GlobalCommandPalette.useEffect.handleKeyDown"]);
                    } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (activeList[selectedIndex]) {
                            if (query.trim()) addRecentSearch(query.trim());
                            activeList[selectedIndex].action();
                            closeCommandPalette();
                        }
                    }
                }
            }["GlobalCommandPalette.useEffect.handleKeyDown"];
            window.addEventListener("keydown", handleKeyDown);
            return ({
                "GlobalCommandPalette.useEffect": ()=>window.removeEventListener("keydown", handleKeyDown)
            })["GlobalCommandPalette.useEffect"];
        }
    }["GlobalCommandPalette.useEffect"], [
        isCommandPaletteOpen,
        activeList,
        selectedIndex,
        query,
        addRecentSearch,
        closeCommandPalette
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isCommandPaletteOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: 0.15
                    },
                    onClick: closeCommandPalette,
                    className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pointer-events-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            scale: 0.95,
                            y: -10
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.95,
                            y: -10
                        },
                        transition: {
                            type: "spring",
                            damping: 25,
                            stiffness: 350
                        },
                        className: "pointer-events-auto w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden font-mono text-left flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "h-5 w-5 text-[var(--primary)] shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 246,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: inputRef,
                                        type: "text",
                                        value: query,
                                        onChange: (e)=>{
                                            setQuery(e.target.value);
                                            setSelectedIndex(0);
                                        },
                                        placeholder: "Type a command or search tasks, notes, trackers...",
                                        className: "flex-1 bg-transparent text-sm text-[var(--text)] focus:outline-none placeholder:text-[var(--text-muted)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 247,
                                        columnNumber: 17
                                    }, this),
                                    query ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setQuery(""),
                                        className: "text-[var(--text-muted)] hover:text-white",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                            lineNumber: 260,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 259,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] font-bold",
                                        children: "ESC"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 263,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                lineNumber: 245,
                                columnNumber: 15
                            }, this),
                            !query && recentSearches.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2 overflow-x-auto custom-scrollbar",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] uppercase font-bold text-[var(--text-muted)] shrink-0 flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "h-3 w-3 text-[var(--primary)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 273,
                                                columnNumber: 21
                                            }, this),
                                            " Recent:"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 272,
                                        columnNumber: 19
                                    }, this),
                                    recentSearches.map((term)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setQuery(term),
                                            className: "group flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] text-[var(--text)] hover:border-[var(--primary)] transition-all shrink-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: term
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                    lineNumber: 281,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3 w-3 text-[var(--text-muted)] hover:text-rose-400",
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        removeRecentSearch(term);
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                    lineNumber: 282,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, term, true, {
                                            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                            lineNumber: 276,
                                            columnNumber: 21
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                lineNumber: 271,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-h-[380px] overflow-y-auto custom-scrollbar p-2 space-y-1",
                                children: [
                                    activeList.map((item, index)=>{
                                        const Icon = item.icon;
                                        const isSelected = index === selectedIndex;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>{
                                                if (query.trim()) addRecentSearch(query.trim());
                                                item.action();
                                                closeCommandPalette();
                                            },
                                            onMouseEnter: ()=>setSelectedIndex(index),
                                            className: `flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${isSelected ? "bg-[var(--primary)]/20 border border-[var(--primary)]/50 text-white" : "border border-transparent text-[var(--text-muted)] hover:text-white hover:bg-[var(--card)]"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] ${item.color}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                                lineNumber: 317,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                            lineNumber: 316,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "truncate",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-bold text-[var(--text)] truncate",
                                                                    children: item.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                                    lineNumber: 320,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] text-[var(--text-muted)] truncate",
                                                                    children: item.subtitle
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                                    lineNumber: 321,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                            lineNumber: 319,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                    lineNumber: 315,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 shrink-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded bg-[var(--card)] border border-[var(--border)] px-2 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase",
                                                            children: item.type
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                            lineNumber: 326,
                                                            columnNumber: 25
                                                        }, this),
                                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                            className: "h-3.5 w-3.5 text-[var(--primary)]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                            lineNumber: 329,
                                                            columnNumber: 40
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                    lineNumber: 325,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                            lineNumber: 301,
                                            columnNumber: 21
                                        }, this);
                                    }),
                                    query.trim() && searchResults.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-12 text-center text-xs text-[var(--text-muted)] space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                className: "h-8 w-8 text-[var(--primary)] opacity-40 mx-auto animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 337,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold text-[var(--text)]",
                                                children: [
                                                    'No matching results for "',
                                                    query,
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 338,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px]",
                                                children: "Try searching tasks, notes, trackers, resources or categories."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 339,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 336,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                lineNumber: 295,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] bg-[var(--card)] text-[10px] text-[var(--text-muted)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded border border-[var(--border)] bg-[var(--surface)] px-1 py-0.5 font-bold",
                                                        children: "↑↓"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                        lineNumber: 348,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Navigate"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 347,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-bold",
                                                        children: "↵"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                        lineNumber: 351,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Select"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 350,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-bold",
                                                        children: "ESC"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                        lineNumber: 354,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Close"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 353,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 346,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 text-[var(--primary)] font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$command$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Command$3e$__["Command"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                                lineNumber: 359,
                                                columnNumber: 19
                                            }, this),
                                            " Vega OS Command Palette"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                                lineNumber: 345,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                        lineNumber: 237,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
                    lineNumber: 236,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
            lineNumber: 224,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/common/GlobalCommandPalette.jsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
_s(GlobalCommandPalette, "Z51LTLTAUKcTANX7vUuLznSKocM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$search$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$task$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$note$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNoteStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$resource$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResourceStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$tracker$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTrackerStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$category$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCategoryStore"]
    ];
});
_c = GlobalCommandPalette;
var _c;
__turbopack_context__.k.register(_c, "GlobalCommandPalette");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/ProtectedRoute.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProtectedRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/auth.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ProtectedRoute({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProtectedRoute.useEffect": ()=>{
            if (!loading && !isAuthenticated) {
                router.push("/login");
            }
        }
    }["ProtectedRoute.useEffect"], [
        isAuthenticated,
        loading,
        router
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[var(--background)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-10 w-10 animate-spin text-[var(--primary)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/ProtectedRoute.jsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-slate-400",
                        children: "Loading VegaRecords..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/ProtectedRoute.jsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/ProtectedRoute.jsx",
                lineNumber: 21,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/common/ProtectedRoute.jsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) {
        return null;
    }
    return children;
}
_s(ProtectedRoute, "aVH8qG5d1XeFW2m2jzvZx7Ah3o4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = ProtectedRoute;
var _c;
__turbopack_context__.k.register(_c, "ProtectedRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/MainLayout.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MainLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$ProtectedRoute$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/ProtectedRoute.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Sidebar.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopNav$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/TopNav.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$GlobalCommandPalette$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/GlobalCommandPalette.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function MainLayout({ children }) {
    _s();
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$ProtectedRoute$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen w-screen overflow-hidden bg-[var(--background)]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    mobileOpen: mobileMenuOpen,
                    onMobileClose: ()=>setMobileMenuOpen(false)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/MainLayout.jsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 flex-col min-w-0 h-full overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopNav$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onMobileMenuToggle: ()=>setMobileMenuOpen(!mobileMenuOpen)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MainLayout.jsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 15
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: 0.35,
                                    ease: "easeOut"
                                },
                                className: "mx-auto max-w-7xl pb-12",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/MainLayout.jsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/MainLayout.jsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/MainLayout.jsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$GlobalCommandPalette$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/layout/MainLayout.jsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/MainLayout.jsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/MainLayout.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(MainLayout, "d7gXMF6mPDUhHBNUSEb8mLK4AII=");
_c = MainLayout;
var _c;
__turbopack_context__.k.register(_c, "MainLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/NotificationDropdown.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotificationDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$notification$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/notification.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-check.mjs [app-client] (ecmascript) <export default as CheckCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.mjs [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function NotificationDropdown() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { notifications, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$notification$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotificationStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationDropdown.useEffect": ()=>{
            fetchNotifications();
        }
    }["NotificationDropdown.useEffect"], [
        fetchNotifications
    ]);
    const unreadCount = notifications.filter((n)=>!n.isRead).length;
    // Click outside to close
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationDropdown.useEffect": ()=>{
            const handleClickOutside = {
                "NotificationDropdown.useEffect.handleClickOutside": (e)=>{
                    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                        setIsOpen(false);
                    }
                }
            }["NotificationDropdown.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "NotificationDropdown.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["NotificationDropdown.useEffect"];
        }
    }["NotificationDropdown.useEffect"], []);
    const getIcon = (type)=>{
        switch(type){
            case "MILESTONE":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                    className: "h-4 w-4 text-amber-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                    lineNumber: 46,
                    columnNumber: 16
                }, this);
            case "REMINDER":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                    className: "h-4 w-4 text-rose-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                    lineNumber: 48,
                    columnNumber: 16
                }, this);
            case "TRACKER":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                    className: "h-4 w-4 text-[#8b5cf6]"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                    lineNumber: 50,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                    className: "h-4 w-4 text-cyan-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                    lineNumber: 52,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: dropdownRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shadow-sm font-mono",
                title: "Notifications",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                        className: "h-4 w-4 text-[var(--primary)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white animate-pulse",
                        children: unreadCount
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 10,
                        scale: 0.95
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: 10,
                        scale: 0.95
                    },
                    transition: {
                        duration: 0.15
                    },
                    className: "absolute right-0 top-12 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl backdrop-blur-2xl z-50 font-mono text-left space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between border-b border-[var(--border)] pb-2.5 px-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            className: "h-4 w-4 text-[var(--primary)]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-[var(--text)]",
                                            children: "Notifications"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                            lineNumber: 86,
                                            columnNumber: 17
                                        }, this),
                                        unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-400 border border-rose-500/30",
                                            children: [
                                                unreadCount,
                                                " Unread"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                            lineNumber: 88,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                    lineNumber: 84,
                                    columnNumber: 15
                                }, this),
                                unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: markAllAsRead,
                                    className: "flex items-center gap-1 text-[10px] text-[var(--primary)] hover:underline font-bold",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCheck$3e$__["CheckCheck"], {
                                            className: "h-3 w-3"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                            lineNumber: 99,
                                            columnNumber: 19
                                        }, this),
                                        " Mark All Read"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                    lineNumber: 95,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-h-72 overflow-y-auto custom-scrollbar space-y-1.5",
                            children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-8 text-center text-xs text-[var(--text-muted)] space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                        className: "h-6 w-6 text-[var(--text-muted)] opacity-40 mx-auto"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                        lineNumber: 108,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "No notifications yet"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                        lineNumber: 109,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                lineNumber: 107,
                                columnNumber: 17
                            }, this) : notifications.slice(0, 5).map((notif)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `group relative flex items-start justify-between rounded-xl border p-2.5 text-xs transition-all ${!notif.isRead ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--text)]" : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2.5 min-w-0 pr-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shrink-0 mt-0.5",
                                                    children: getIcon(notif.type)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                    lineNumber: 122,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-0.5 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-[var(--text)] truncate",
                                                            children: notif.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                            lineNumber: 126,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] leading-relaxed text-[var(--text-muted)] line-clamp-2",
                                                            children: notif.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                            lineNumber: 127,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] text-[var(--text-muted)] opacity-75 block",
                                                            children: new Date(notif.timestamp).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                            lineNumber: 130,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                    lineNumber: 125,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                            lineNumber: 121,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1 shrink-0",
                                            children: [
                                                !notif.isRead && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>markAsRead(notif.id),
                                                    className: "p-1 rounded-md hover:bg-[var(--surface)] text-[var(--primary)]",
                                                    title: "Mark Read",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "h-3.5 w-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                        lineNumber: 146,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                    lineNumber: 141,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteNotification(notif.id),
                                                    className: "p-1 rounded-md hover:bg-[var(--surface)] text-rose-400",
                                                    title: "Delete Notification",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "h-3 w-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                        lineNumber: 154,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                                    lineNumber: 149,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                            lineNumber: 139,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, notif.id, true, {
                                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                    lineNumber: 113,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-[var(--border)] pt-2 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/notifications",
                                onClick: ()=>setIsOpen(false),
                                className: "inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline",
                                children: [
                                    "View Notifications Center ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                        lineNumber: 169,
                                        columnNumber: 43
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/NotificationDropdown.jsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(NotificationDropdown, "y0rxLG7iDh8nHt4FWN6quARa0Ak=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$notification$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotificationStore"]
    ];
});
_c = NotificationDropdown;
var _c;
__turbopack_context__.k.register(_c, "NotificationDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Sidebar.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/auth.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs [app-client] (ecmascript) <export default as FolderTree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.mjs [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark.mjs [app-client] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.mjs [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/cn.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const NAV_ITEMS = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
        badge: "CORE"
    },
    {
        name: "Categories",
        href: "/categories",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"],
        badge: "TREE"
    },
    {
        name: "Tasks",
        href: "/tasks",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
        badge: "BOARD"
    },
    {
        name: "Trackers",
        href: "/trackers",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        badge: "LIVE"
    },
    {
        name: "Tracker Types",
        href: "/tracker-types",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
        badge: "SCHEMA"
    },
    {
        name: "Resources",
        href: "/resources",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"]
    },
    {
        name: "Notes",
        href: "/notes",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    },
    {
        name: "Knowledge Graph",
        href: "/graph",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"],
        badge: "NEURAL"
    },
    {
        name: "Activity",
        href: "/activity",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
    },
    {
        name: "Notifications",
        href: "/notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    }
];
function Sidebar({ mobileOpen = false, onMobileClose = ()=>{} }) {
    _s();
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const userRole = user?.role?.toUpperCase() || "";
    const isAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";
    const SidebarContent = ({ isMobile = false })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full w-full flex-col select-none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-16 md:h-20 items-center justify-between px-4 border-b border-[var(--border)] relative overflow-hidden bg-[var(--hover-bg)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                            lineNumber: 58,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            onClick: ()=>isMobile && onMobileClose(),
                            className: "flex items-center gap-3 overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--primary)] via-purple-600 to-[var(--secondary)] text-white shadow-xl shadow-[var(--primary)]/40 border border-white/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            className: "h-5 w-5 md:h-6 md:w-6 animate-pulse text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                                            lineNumber: 66,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[var(--surface)] text-[9px] font-extrabold",
                                            children: "✓"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                                            lineNumber: 67,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                    lineNumber: 65,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base font-extrabold tracking-tight text-[var(--text)] font-mono",
                                                    children: "VEGA"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                                    lineNumber: 74,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded bg-[var(--primary)]/20 px-1.5 py-0.5 text-[9px] font-extrabold text-[var(--primary)] font-mono border border-[var(--primary)]/30",
                                                    children: "SaaS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                                    lineNumber: 77,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                                            lineNumber: 73,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-mono text-[var(--text-muted)] tracking-wider",
                                            children: "KNOWLEDGE HUB"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                                            lineNumber: 81,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                    lineNumber: 72,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                            lineNumber: 60,
                            columnNumber: 17
                        }, this),
                        isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onMobileClose,
                            className: "flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 93,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                            lineNumber: 89,
                            columnNumber: 21
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCollapsed(!collapsed),
                            className: "flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)] transition-colors shadow-sm",
                            title: collapsed ? "Expand Sidebar" : "Collapse Sidebar",
                            children: collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 101,
                                columnNumber: 38
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 101,
                                columnNumber: 77
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                            lineNumber: 96,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                    lineNumber: 56,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex-1 space-y-1.5 px-3 py-4 overflow-y-auto custom-scrollbar",
                    children: [
                        isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin",
                            onClick: ()=>isMobile && onMobileClose(),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold transition-all mb-3", pathname.startsWith("/admin") ? "bg-rose-500/20 border border-rose-500/50 text-rose-400 shadow-md" : "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "h-4 w-4 text-rose-400 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                                            lineNumber: 120,
                                            columnNumber: 29
                                        }, this),
                                        (!collapsed || isMobile) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Admin HQ"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                                            lineNumber: 121,
                                            columnNumber: 58
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                    lineNumber: 119,
                                    columnNumber: 25
                                }, this),
                                (!collapsed || isMobile) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded bg-rose-500/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase shrink-0 whitespace-nowrap leading-none",
                                    children: "PANEL"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                    lineNumber: 124,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                            lineNumber: 109,
                            columnNumber: 21
                        }, this),
                        NAV_ITEMS.map((item)=>{
                            const Icon = item.icon;
                            const isActive = pathname === item.href || item.href !== "/dashboard" && pathname.startsWith(item.href);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                onClick: ()=>isMobile && onMobileClose(),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group relative flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-mono font-medium transition-all duration-200", isActive ? "bg-[var(--hover-bg)] text-[var(--primary)] font-bold shadow-sm" : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"),
                                children: [
                                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        layoutId: "activeIndicator",
                                        className: "absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)]",
                                        transition: {
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                                        lineNumber: 148,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3.5 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                                lineNumber: 156,
                                                columnNumber: 33
                                            }, this),
                                            (!collapsed || isMobile) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate",
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                                lineNumber: 163,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                                        lineNumber: 155,
                                        columnNumber: 29
                                    }, this),
                                    (!collapsed || isMobile) && item.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-1.5 py-0.5 text-[9px] font-mono font-extrabold uppercase tracking-wider shrink-0 whitespace-nowrap leading-none", isActive ? "bg-[var(--primary)] text-white shadow-sm" : "bg-[var(--card)] text-[var(--text-muted)] border border-[var(--border)]"),
                                        children: item.badge
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                                        lineNumber: 168,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 136,
                                columnNumber: 25
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                    lineNumber: 107,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 border-t border-[var(--border)] bg-[var(--surface)]",
                    children: !collapsed || isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/profile",
                                onClick: ()=>isMobile && onMobileClose(),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 rounded-xl p-2.5 text-xs font-mono font-bold border transition-all", pathname === "/profile" ? "bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)] shadow-sm" : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "h-4 w-4 text-[var(--primary)] shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                                        lineNumber: 198,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "Profile"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                                        lineNumber: 199,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 188,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/settings/theme",
                                onClick: ()=>isMobile && onMobileClose(),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 rounded-xl p-2.5 text-xs font-mono font-bold border transition-all", pathname.startsWith("/settings") ? "bg-[var(--secondary)]/20 border-[var(--secondary)]/50 text-[var(--secondary)] shadow-sm" : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--secondary)]/40"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "h-4 w-4 text-[var(--secondary)] shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                                        lineNumber: 212,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "Settings"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                                        lineNumber: 213,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 202,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                        lineNumber: 187,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/profile",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-9 items-center justify-center rounded-xl border transition-all", pathname === "/profile" ? "bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)] shadow-sm" : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"),
                                title: "User Profile",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    className: "h-4 w-4 text-[var(--primary)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                    lineNumber: 228,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 218,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/settings/theme",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$cn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-9 items-center justify-center rounded-xl border transition-all", pathname.startsWith("/settings") ? "bg-[var(--secondary)]/20 border-[var(--secondary)]/50 text-[var(--secondary)] shadow-sm" : "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"),
                                title: "Theme & Engine Settings",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    className: "h-4 w-4 text-[var(--secondary)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                                    lineNumber: 241,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 231,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Sidebar.jsx",
                        lineNumber: 217,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                    lineNumber: 185,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/Sidebar.jsx",
            lineNumber: 54,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].aside, {
                initial: false,
                animate: {
                    width: collapsed ? 84 : 275
                },
                transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                },
                className: "hidden md:flex sticky top-0 left-0 h-screen shrink-0 z-40 flex-col border-r border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarContent, {
                    isMobile: false
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                    lineNumber: 258,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Sidebar.jsx",
                lineNumber: 252,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            onClick: onMobileClose,
                            className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                            lineNumber: 266,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].aside, {
                            initial: {
                                x: "-100%"
                            },
                            animate: {
                                x: 0
                            },
                            exit: {
                                x: "-100%"
                            },
                            transition: {
                                type: "spring",
                                damping: 25,
                                stiffness: 250
                            },
                            className: "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--surface)] border-r border-[var(--border)] shadow-2xl flex flex-col md:hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarContent, {
                                isMobile: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Sidebar.jsx",
                                lineNumber: 282,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Sidebar.jsx",
                            lineNumber: 275,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Sidebar.jsx",
                    lineNumber: 264,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Sidebar.jsx",
                lineNumber: 262,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Sidebar.jsx",
        lineNumber: 250,
        columnNumber: 9
    }, this);
}
_s(Sidebar, "e3Jq4t1PKKYy9cDyZFJhpZh42Cc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/TopNav.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuth.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$search$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/search.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$NotificationDropdown$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/NotificationDropdown.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/palette.mjs [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
function TopNav({ onMobileMenuToggle }) {
    _s();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { themeMode, themePreset, setThemeMode, setThemePreset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    const { openCommandPalette } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$search$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchStore"])();
    const [profileOpen, setProfileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [themeOpen, setThemeOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Global ⌘K or / keyboard shortcut listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopNav.useEffect": ()=>{
            const handleKeyDown = {
                "TopNav.useEffect.handleKeyDown": (e)=>{
                    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                        e.preventDefault();
                        openCommandPalette();
                    }
                    if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
                        e.preventDefault();
                        openCommandPalette();
                    }
                }
            }["TopNav.useEffect.handleKeyDown"];
            window.addEventListener("keydown", handleKeyDown);
            return ({
                "TopNav.useEffect": ()=>window.removeEventListener("keydown", handleKeyDown)
            })["TopNav.useEffect"];
        }
    }["TopNav.useEffect"], [
        openCommandPalette
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-30 flex h-16 md:h-20 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 px-3 sm:px-6 backdrop-blur-2xl transition-colors duration-300 gap-2 font-mono",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onMobileMenuToggle,
                className: "flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                title: "Toggle Menu",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                    className: "h-5 w-5"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/TopNav.jsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/TopNav.jsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-xs sm:max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: openCommandPalette,
                    className: "w-full flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs text-[var(--text-muted)] hover:border-[var(--primary)]/50 transition-all shadow-inner font-mono text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2.5 truncate",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--primary)] shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/TopNav.jsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate",
                                    children: "Search tasks, notes, trackers..."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/TopNav.jsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/TopNav.jsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--hover-bg)] px-2 py-0.5 rounded-md border border-[var(--border)] shrink-0",
                            children: "⌘K"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/TopNav.jsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/TopNav.jsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/TopNav.jsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$NotificationDropdown$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/components/layout/TopNav.jsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setThemeMode(themeMode === "dark" ? "light" : "dark"),
                        className: "flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shadow-sm",
                        title: `Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`,
                        children: themeMode === "dark" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                            className: "h-4 w-4 text-amber-400"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/TopNav.jsx",
                            lineNumber: 86,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                            className: "h-4 w-4 text-[var(--primary)]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/TopNav.jsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/TopNav.jsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setThemeOpen(!themeOpen),
                                className: "flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/40 transition-all shadow-sm",
                                title: "Switch Theme Preset",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                                    className: "h-4 w-4 text-[var(--primary)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/TopNav.jsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            themeOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-12 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl backdrop-blur-2xl z-50 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] font-mono text-[var(--text-muted)] uppercase px-2 mb-2",
                                        children: "Color Presets"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopNav.jsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this),
                                    Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"]).map(([key, preset])=>{
                                        const isSelected = themePreset === key;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setThemePreset(key);
                                                setThemeOpen(false);
                                            },
                                            className: `flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-mono transition-colors ${isSelected ? "bg-[var(--primary)]/15 text-[var(--text)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)]"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "h-2.5 w-2.5 rounded-full",
                                                            style: {
                                                                backgroundColor: preset.primary
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/TopNav.jsx",
                                                            lineNumber: 123,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: preset.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/TopNav.jsx",
                                                            lineNumber: 124,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/TopNav.jsx",
                                                    lineNumber: 122,
                                                    columnNumber: 21
                                                }, this),
                                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "h-3.5 w-3.5 text-[var(--primary)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/TopNav.jsx",
                                                    lineNumber: 126,
                                                    columnNumber: 36
                                                }, this)
                                            ]
                                        }, key, true, {
                                            fileName: "[project]/src/components/layout/TopNav.jsx",
                                            lineNumber: 110,
                                            columnNumber: 19
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/TopNav.jsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setProfileOpen(!profileOpen),
                                className: "flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5 pr-3 hover:border-[var(--primary)]/40 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-xs font-extrabold text-white shadow-md",
                                        children: user?.firstName?.charAt(0) || user?.username?.charAt(0) || "V"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopNav.jsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold text-[var(--text)] font-mono hidden sm:inline",
                                        children: user?.firstName || user?.username || "Commander"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopNav.jsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            profileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 top-12 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-2 border-b border-[var(--border)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-[var(--text)] font-mono",
                                                children: [
                                                    user?.firstName,
                                                    " ",
                                                    user?.lastName || user?.username
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-[var(--text-muted)] font-mono truncate",
                                                children: user?.email
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                                lineNumber: 152,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/TopNav.jsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/profile",
                                        onClick: ()=>setProfileOpen(false),
                                        className: "flex items-center gap-2 rounded-xl p-2 text-xs text-[var(--text)] hover:bg-[var(--hover-bg)] font-mono",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "h-3.5 w-3.5 text-[var(--primary)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this),
                                            " My User Profile"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/TopNav.jsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/settings/theme",
                                        onClick: ()=>setProfileOpen(false),
                                        className: "flex items-center gap-2 rounded-xl p-2 text-xs text-[var(--text)] hover:bg-[var(--hover-bg)] font-mono",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                className: "h-3.5 w-3.5 text-[var(--secondary)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this),
                                            " Theme Engine Settings"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/TopNav.jsx",
                                        lineNumber: 163,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            logout();
                                            setProfileOpen(false);
                                        },
                                        className: "flex w-full items-center gap-2 rounded-xl p-2 text-xs text-rose-400 hover:bg-rose-500/10 font-mono",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this),
                                            " Sign Out"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/TopNav.jsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/TopNav.jsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/TopNav.jsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/TopNav.jsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/TopNav.jsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(TopNav, "QnQgt2GGAyheH0ffmpCHWGOsHe4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$search$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchStore"]
    ];
});
_c = TopNav;
var _c;
__turbopack_context__.k.register(_c, "TopNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useAuth.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/auth.api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/auth.store.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function useAuth() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, accessToken, isAuthenticated, setAuth, updateUser, logout: clearAuthStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const loginMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].login,
        onSuccess: {
            "useAuth.useMutation[loginMutation]": (data)=>{
                setAuth({
                    user: data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
                router.push("/dashboard");
            }
        }["useAuth.useMutation[loginMutation]"]
    });
    const registerMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].register,
        onSuccess: {
            "useAuth.useMutation[registerMutation]": (data)=>{
                setAuth({
                    user: data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
                router.push("/dashboard");
            }
        }["useAuth.useMutation[registerMutation]"]
    });
    const logoutMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useAuth.useMutation[logoutMutation]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].logout(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().refreshToken)
        }["useAuth.useMutation[logoutMutation]"],
        onSettled: {
            "useAuth.useMutation[logoutMutation]": ()=>{
                clearAuthStore();
                router.push("/login");
            }
        }["useAuth.useMutation[logoutMutation]"]
    });
    const currentUserQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "currentUser"
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$auth$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].getCurrentUser,
        enabled: !!accessToken && isAuthenticated
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuth.useEffect": ()=>{
            if (currentUserQuery.data) {
                updateUser(currentUserQuery.data);
            }
        }
    }["useAuth.useEffect"], [
        currentUserQuery.data,
        updateUser
    ]);
    return {
        user: currentUserQuery.data || user,
        isAuthenticated,
        isLoading: loginMutation.isPending || registerMutation.isPending,
        error: loginMutation.error || registerMutation.error,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync
    };
}
_s(useAuth, "jIdw10e0Wyohbe2c0F6VcbK43y0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$auth$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/auth.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: true,
        setAuth: ({ user, accessToken, refreshToken })=>{
            set({
                user: user || get().user,
                accessToken: accessToken || get().accessToken,
                refreshToken: refreshToken || get().refreshToken,
                isAuthenticated: true,
                loading: false
            });
        },
        setUser: (user)=>{
            set({
                user
            });
        },
        updateUser: (updatedFields)=>{
            set((state)=>({
                    user: state.user ? {
                        ...state.user,
                        ...updatedFields
                    } : updatedFields
                }));
        },
        logout: ()=>{
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                loading: false
            });
        },
        setLoading: (loading)=>{
            set({
                loading
            });
        }
    }), {
    name: "vegarecords-auth",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    onRehydrateStorage: ()=>(state)=>{
            if (state) {
                state.setLoading(false);
            }
        }
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/category.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCategoryStore",
    ()=>useCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$category$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/category.api.js [app-client] (ecmascript)");
;
;
const useCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        categories: [],
        selectedCategoryId: null,
        expandedNodeIds: [],
        searchTerm: "",
        isLoading: false,
        // Inspector state (hidden by default)
        isInspectorOpen: false,
        // Drawer state
        isDrawerOpen: false,
        drawerMode: "create",
        editingCategory: null,
        parentForNewChildId: null,
        // Actions
        fetchCategories: async ()=>{
            set({
                isLoading: true
            });
            try {
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$category$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryApi"].getAll();
                if (Array.isArray(data)) {
                    set({
                        categories: data,
                        selectedCategoryId: get().selectedCategoryId || data[0]?.id || null
                    });
                }
            } catch  {
                set({
                    categories: []
                });
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        selectCategory: (id)=>{
            set({
                selectedCategoryId: id
            });
        },
        toggleInspector: ()=>{
            set((state)=>({
                    isInspectorOpen: !state.isInspectorOpen
                }));
        },
        openInspector: ()=>{
            set({
                isInspectorOpen: true
            });
        },
        closeInspector: ()=>{
            set({
                isInspectorOpen: false
            });
        },
        toggleNodeExpand: (id)=>{
            const { expandedNodeIds } = get();
            if (expandedNodeIds.includes(id)) {
                set({
                    expandedNodeIds: expandedNodeIds.filter((nodeId)=>nodeId !== id)
                });
            } else {
                set({
                    expandedNodeIds: [
                        ...expandedNodeIds,
                        id
                    ]
                });
            }
        },
        expandAll: ()=>{
            const allIds = get().categories.map((c)=>c.id);
            set({
                expandedNodeIds: allIds
            });
        },
        collapseAll: ()=>{
            set({
                expandedNodeIds: []
            });
        },
        setSearchTerm: (term)=>{
            set({
                searchTerm: term
            });
        },
        openCreateDrawer: (parentId = null)=>{
            set({
                isDrawerOpen: true,
                drawerMode: "create",
                editingCategory: null,
                parentForNewChildId: parentId
            });
        },
        openEditDrawer: (category)=>{
            set({
                isDrawerOpen: true,
                drawerMode: "edit",
                editingCategory: category,
                parentForNewChildId: null
            });
        },
        closeDrawer: ()=>{
            set({
                isDrawerOpen: false,
                editingCategory: null,
                parentForNewChildId: null
            });
        },
        addCategory: async (categoryData)=>{
            try {
                const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$category$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryApi"].create(categoryData);
                const parentId = created.parentCategoryId || created.parentId;
                set((state)=>{
                    const updatedCategories = [
                        ...state.categories,
                        created
                    ];
                    const updatedExpanded = parentId ? Array.from(new Set([
                        ...state.expandedNodeIds,
                        parentId
                    ])) : state.expandedNodeIds;
                    return {
                        categories: updatedCategories,
                        selectedCategoryId: created.id,
                        expandedNodeIds: updatedExpanded,
                        isDrawerOpen: false
                    };
                });
            } catch  {
            // API error handled by caller / interceptor
            }
        },
        updateCategory: async (id, updatedFields)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$category$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryApi"].update(id, updatedFields);
                set((state)=>({
                        categories: state.categories.map((cat)=>cat.id === id ? {
                                ...cat,
                                ...updatedFields
                            } : cat),
                        isDrawerOpen: false,
                        editingCategory: null
                    }));
                return {
                    success: true
                };
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || "Failed to update category.";
                return {
                    success: false,
                    error: errorMsg
                };
            }
        },
        deleteCategory: async (id)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$category$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryApi"].delete(id);
                set((state)=>{
                    const idsToDelete = new Set([
                        id
                    ]);
                    let changed = true;
                    while(changed){
                        changed = false;
                        state.categories.forEach((cat)=>{
                            const pId = cat.parentCategoryId || cat.parentId;
                            if (pId && idsToDelete.has(pId) && !idsToDelete.has(cat.id)) {
                                idsToDelete.add(cat.id);
                                changed = true;
                            }
                        });
                    }
                    const filtered = state.categories.filter((cat)=>!idsToDelete.has(cat.id));
                    const remainingSelected = state.selectedCategoryId === id ? filtered[0]?.id || null : state.selectedCategoryId;
                    return {
                        categories: filtered,
                        selectedCategoryId: remainingSelected
                    };
                });
                return {
                    success: true
                };
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || "Failed to delete category.";
                return {
                    success: false,
                    error: errorMsg
                };
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/note.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNoteStore",
    ()=>useNoteStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$note$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/note.api.js [app-client] (ecmascript)");
;
;
const useNoteStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        notes: [],
        pagination: {
            page: 0,
            size: 20,
            totalElements: 0,
            totalPages: 1
        },
        viewMode: "grid",
        filters: {
            categoryId: null,
            trackerId: null,
            isFavorite: false,
            search: ""
        },
        selectedNote: null,
        activeNoteDetail: null,
        isLoading: false,
        drawerOpen: false,
        editingNote: null,
        isCategorySidebarOpen: false,
        openCategorySidebar: ()=>set({
                isCategorySidebarOpen: true
            }),
        closeCategorySidebar: ()=>set({
                isCategorySidebarOpen: false
            }),
        toggleCategorySidebar: ()=>set((state)=>({
                    isCategorySidebarOpen: !state.isCategorySidebarOpen
                })),
        setViewMode: (mode)=>set({
                viewMode: mode
            }),
        toggleFocusMode: ()=>set((state)=>({
                    focusMode: !state.focusMode
                })),
        setFilters: (newFilters)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        ...newFilters
                    },
                    pagination: {
                        ...state.pagination,
                        page: 0
                    }
                }));
            get().fetchNotes();
        },
        resetFilters: ()=>{
            set({
                filters: {
                    categoryId: null,
                    trackerId: null,
                    isFavorite: false,
                    search: ""
                },
                pagination: {
                    page: 0,
                    size: 20,
                    totalElements: 0,
                    totalPages: 1
                }
            });
            get().fetchNotes();
        },
        openDrawer: (note = null)=>{
            set({
                editingNote: note,
                drawerOpen: true
            });
        },
        closeDrawer: ()=>{
            set({
                editingNote: null,
                drawerOpen: false
            });
        },
        setSelectedNote: (note)=>set({
                selectedNote: note
            }),
        fetchNotes: async ()=>{
            set({
                isLoading: true
            });
            try {
                const { filters, pagination } = get();
                const params = {
                    page: pagination.page,
                    size: pagination.size
                };
                if (filters.categoryId) params.categoryId = filters.categoryId;
                if (filters.trackerId) params.trackerId = filters.trackerId;
                if (filters.isFavorite) params.isFavorite = true;
                if (filters.search) params.search = filters.search;
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$note$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noteApi"].getAll(params);
                const data = res?.content ? res : {
                    content: Array.isArray(res) ? res : [],
                    totalElements: 0,
                    totalPages: 1
                };
                set({
                    notes: data.content || [],
                    pagination: {
                        ...pagination,
                        totalElements: data.totalElements || 0,
                        totalPages: data.totalPages || 1
                    }
                });
            } catch  {
                set({
                    notes: []
                });
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        fetchNoteById: async (id)=>{
            set({
                isLoading: true
            });
            try {
                const note = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$note$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noteApi"].getById(id);
                set({
                    activeNoteDetail: note
                });
                return note;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        createNote: async (payload)=>{
            set({
                isLoading: true
            });
            try {
                const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$note$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noteApi"].create(payload);
                get().fetchNotes();
                return created;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        updateNote: async (id, payload)=>{
            set({
                isLoading: true
            });
            try {
                const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$note$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noteApi"].update(id, payload);
                get().fetchNotes();
                if (get().selectedNote?.id === id) {
                    set({
                        selectedNote: updated
                    });
                }
                if (get().activeNoteDetail?.id === id) {
                    set({
                        activeNoteDetail: updated
                    });
                }
                return updated;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        toggleFavorite: async (note)=>{
            const newFav = !note.isFavorite;
            set((state)=>({
                    notes: state.notes.map((n)=>n.id === note.id ? {
                            ...n,
                            isFavorite: newFav
                        } : n)
                }));
            try {
                const payload = {
                    title: note.title,
                    content: note.content,
                    categoryId: note.categoryId,
                    trackerId: note.trackerId,
                    isFavorite: newFav
                };
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$note$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noteApi"].update(note.id, payload);
            } catch  {
                set((state)=>({
                        notes: state.notes.map((n)=>n.id === note.id ? {
                                ...n,
                                isFavorite: note.isFavorite
                            } : n)
                    }));
            }
        },
        deleteNote: async (id)=>{
            set({
                isLoading: true
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$note$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noteApi"].delete(id);
                if (get().selectedNote?.id === id) {
                    set({
                        selectedNote: null
                    });
                }
                if (get().activeNoteDetail?.id === id) {
                    set({
                        activeNoteDetail: null
                    });
                }
                get().fetchNotes();
            } finally{
                set({
                    isLoading: false
                });
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/notification.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNotificationStore",
    ()=>useNotificationStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$notification$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/notification.api.js [app-client] (ecmascript)");
;
;
;
const INITIAL_NOTIFICATIONS = [
    {
        id: "notif-1",
        title: "Task Priority Alert: High Level Due Today",
        message: "Spring Boot Microservices Security task is scheduled for completion at High Level priority.",
        type: "CRITICAL",
        entityType: "TASK",
        level: "Level 1 Priority",
        priority: "HIGH",
        isRead: false,
        timestamp: new Date().toISOString(),
        link: "/tasks"
    },
    {
        id: "notif-2",
        title: "Tracker Milestone: Ep 1095 Achieved!",
        message: "One Piece Anime Series tracker updated set value (EP 1095 / 1100).",
        type: "MILESTONE",
        entityType: "TRACKER",
        level: "Level 0 Set",
        priority: "MEDIUM",
        isRead: false,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        link: "/trackers"
    },
    {
        id: "notif-3",
        title: "Category Node Added: L2 Flyway Sub-Tree",
        message: "New sub-category node created under Software Engineering -> Backend Architecture.",
        type: "INFO",
        entityType: "CATEGORY",
        level: "Level 2 Sub-tree",
        priority: "LOW",
        isRead: true,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        link: "/categories"
    },
    {
        id: "notif-4",
        title: "System Synchronization Complete",
        message: "All 5 dynamic tracker sets and 12 category tree nodes are fully synchronized.",
        type: "SUCCESS",
        entityType: "SYSTEM",
        level: "Root Level",
        priority: "LOW",
        isRead: true,
        timestamp: new Date(Date.now() - 86400000).toISOString()
    }
];
const useNotificationStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        notifications: INITIAL_NOTIFICATIONS,
        filter: "ALL",
        loading: false,
        setFilter: (filter)=>set({
                filter
            }),
        fetchNotifications: async ()=>{
            set({
                loading: true
            });
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$notification$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationApi"].getNotifications(0, 50);
                const data = res?.content || res || [];
                if (Array.isArray(data) && data.length > 0) {
                    set({
                        notifications: data,
                        loading: false
                    });
                } else {
                    set({
                        loading: false
                    });
                }
            } catch (err) {
                console.warn("Failed to fetch notifications from backend, using local store", err);
                set({
                    loading: false
                });
            }
        },
        markAsRead: async (id)=>{
            set((state)=>({
                    notifications: state.notifications.map((n)=>n.id === id ? {
                            ...n,
                            isRead: true
                        } : n)
                }));
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$notification$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationApi"].markAsRead(id);
            } catch (err) {
                console.warn("Failed to sync markAsRead to backend", err);
            }
        },
        markAllAsRead: async ()=>{
            set((state)=>({
                    notifications: state.notifications.map((n)=>({
                            ...n,
                            isRead: true
                        }))
                }));
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$notification$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationApi"].markAllAsRead();
            } catch (err) {
                console.warn("Failed to sync markAllAsRead to backend", err);
            }
        },
        deleteNotification: async (id)=>{
            set((state)=>({
                    notifications: state.notifications.filter((n)=>n.id !== id)
                }));
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$notification$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationApi"].deleteNotification(id);
            } catch (err) {
                console.warn("Failed to sync deleteNotification to backend", err);
            }
        },
        clearAll: ()=>set({
                notifications: []
            }),
        addNotification: (notif)=>{
            const newNotif = {
                id: `notif-${Date.now()}`,
                isRead: false,
                timestamp: new Date().toISOString(),
                ...notif
            };
            set((state)=>({
                    notifications: [
                        newNotif,
                        ...state.notifications
                    ]
                }));
        }
    }), {
    name: "vega-notification-storage"
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/resource.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useResourceStore",
    ()=>useResourceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$resource$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/resource.api.js [app-client] (ecmascript)");
;
;
const useResourceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        resources: [],
        pagination: {
            page: 0,
            size: 20,
            totalElements: 0,
            totalPages: 1
        },
        viewMode: "grid",
        filters: {
            categoryId: null,
            resourceType: null,
            isFavorite: false,
            search: ""
        },
        isLoading: false,
        drawerOpen: false,
        editingResource: null,
        isCategorySidebarOpen: false,
        openCategorySidebar: ()=>set({
                isCategorySidebarOpen: true
            }),
        closeCategorySidebar: ()=>set({
                isCategorySidebarOpen: false
            }),
        toggleCategorySidebar: ()=>set((state)=>({
                    isCategorySidebarOpen: !state.isCategorySidebarOpen
                })),
        setViewMode: (mode)=>set({
                viewMode: mode
            }),
        setFilters: (newFilters)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        ...newFilters
                    },
                    pagination: {
                        ...state.pagination,
                        page: 0
                    }
                }));
            get().fetchResources();
        },
        resetFilters: ()=>{
            set({
                filters: {
                    categoryId: null,
                    resourceType: null,
                    isFavorite: false,
                    search: ""
                },
                pagination: {
                    page: 0,
                    size: 20,
                    totalElements: 0,
                    totalPages: 1
                }
            });
            get().fetchResources();
        },
        openDrawer: (resource = null)=>{
            set({
                editingResource: resource,
                drawerOpen: true
            });
        },
        closeDrawer: ()=>{
            set({
                editingResource: null,
                drawerOpen: false
            });
        },
        setSelectedResource: (resource)=>set({
                selectedResource: resource
            }),
        fetchResources: async ()=>{
            set({
                isLoading: true
            });
            try {
                const { filters, pagination } = get();
                const params = {
                    page: pagination.page,
                    size: pagination.size
                };
                if (filters.resourceType) params.resourceType = filters.resourceType;
                if (filters.categoryId) params.categoryId = filters.categoryId;
                if (filters.search) params.search = filters.search;
                let data;
                if (filters.isFavorite) {
                    const favs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$resource$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceApi"].getFavorites();
                    data = {
                        content: Array.isArray(favs) ? favs : [],
                        totalElements: favs.length,
                        totalPages: 1
                    };
                } else {
                    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$resource$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceApi"].getAll(params);
                    data = res?.content ? res : {
                        content: Array.isArray(res) ? res : [],
                        totalElements: 0,
                        totalPages: 1
                    };
                }
                set({
                    resources: data.content || [],
                    pagination: {
                        ...pagination,
                        totalElements: data.totalElements || 0,
                        totalPages: data.totalPages || 1
                    }
                });
            } catch  {
                set({
                    resources: []
                });
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        createResource: async (payload)=>{
            set({
                isLoading: true
            });
            try {
                const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$resource$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceApi"].create(payload);
                get().fetchResources();
                return created;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        updateResource: async (id, payload)=>{
            set({
                isLoading: true
            });
            try {
                const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$resource$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceApi"].update(id, payload);
                get().fetchResources();
                if (get().selectedResource?.id === id) {
                    set({
                        selectedResource: updated
                    });
                }
                return updated;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        toggleFavorite: async (resource)=>{
            const newFav = !resource.isFavorite;
            // Optimistic update
            set((state)=>({
                    resources: state.resources.map((r)=>r.id === resource.id ? {
                            ...r,
                            isFavorite: newFav
                        } : r)
                }));
            try {
                const payload = {
                    title: resource.title,
                    url: resource.url,
                    resourceType: resource.resourceType,
                    notes: resource.notes,
                    isFavorite: newFav,
                    categoryIds: resource.categories ? resource.categories.map((c)=>c.id) : []
                };
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$resource$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceApi"].update(resource.id, payload);
            } catch  {
                // Revert if failed
                set((state)=>({
                        resources: state.resources.map((r)=>r.id === resource.id ? {
                                ...r,
                                isFavorite: resource.isFavorite
                            } : r)
                    }));
            }
        },
        deleteResource: async (id)=>{
            set({
                isLoading: true
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$resource$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceApi"].delete(id);
                if (get().selectedResource?.id === id) {
                    set({
                        selectedResource: null
                    });
                }
                get().fetchResources();
            } finally{
                set({
                    isLoading: false
                });
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/search.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSearchStore",
    ()=>useSearchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useSearchStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        isCommandPaletteOpen: false,
        searchQuery: "",
        recentSearches: [
            "Next.js 15",
            "Spring Boot Auth",
            "Tailwind v4",
            "Obsidian Wiki"
        ],
        openCommandPalette: ()=>set({
                isCommandPaletteOpen: true
            }),
        closeCommandPalette: ()=>set({
                isCommandPaletteOpen: false
            }),
        toggleCommandPalette: ()=>set((state)=>({
                    isCommandPaletteOpen: !state.isCommandPaletteOpen
                })),
        setSearchQuery: (query)=>set({
                searchQuery: query
            }),
        addRecentSearch: (term)=>{
            if (!term || !term.trim()) return;
            const q = term.trim();
            set((state)=>({
                    recentSearches: [
                        q,
                        ...state.recentSearches.filter((item)=>item !== q)
                    ].slice(0, 8)
                }));
        },
        removeRecentSearch: (term)=>set((state)=>({
                    recentSearches: state.recentSearches.filter((item)=>item !== term)
                })),
        clearRecentSearches: ()=>set({
                recentSearches: []
            })
    }), {
    name: "vega-search-storage",
    partialize: (state)=>({
            recentSearches: state.recentSearches
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/task.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTaskStore",
    ()=>useTaskStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$task$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/task.api.js [app-client] (ecmascript)");
;
;
const useTaskStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        tasks: [],
        selectedTaskId: null,
        viewMode: "list",
        isLoading: false,
        // Filters
        filters: {
            status: "ALL",
            priority: "ALL",
            categoryId: "ALL",
            search: ""
        },
        // Drawer state
        isDrawerOpen: false,
        drawerMode: "create",
        editingTask: null,
        // Category Overlay Sidebar state
        isCategorySidebarOpen: false,
        // Actions
        openCategorySidebar: ()=>set({
                isCategorySidebarOpen: true
            }),
        closeCategorySidebar: ()=>set({
                isCategorySidebarOpen: false
            }),
        toggleCategorySidebar: ()=>set((state)=>({
                    isCategorySidebarOpen: !state.isCategorySidebarOpen
                })),
        fetchTasks: async ()=>{
            set({
                isLoading: true
            });
            try {
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$task$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["taskApi"].getAll();
                if (Array.isArray(data)) {
                    set({
                        tasks: data
                    });
                }
            } catch  {
                set({
                    tasks: []
                });
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        setViewMode: (mode)=>{
            set({
                viewMode: mode
            });
        },
        setFilter: (key, value)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        [key]: value
                    }
                }));
        },
        resetFilters: ()=>{
            set({
                filters: {
                    status: "ALL",
                    priority: "ALL",
                    categoryId: "ALL",
                    search: ""
                }
            });
        },
        selectTask: (id)=>{
            set({
                selectedTaskId: id
            });
        },
        toggleTaskStatus: async (id)=>{
            const task = get().tasks.find((t)=>t.id === id);
            if (!task) return;
            const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
            const newProgress = newStatus === "COMPLETED" ? 100 : 0;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$task$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["taskApi"].updateStatus(id, newStatus);
                set((state)=>({
                        tasks: state.tasks.map((t)=>t.id === id ? {
                                ...t,
                                status: newStatus,
                                progress: newProgress
                            } : t)
                    }));
            } catch  {
            // Handled by API interceptor / caller
            }
        },
        updateTaskStatus: async (id, status)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$task$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["taskApi"].updateStatus(id, status);
                set((state)=>({
                        tasks: state.tasks.map((t)=>t.id === id ? {
                                ...t,
                                status,
                                progress: status === "COMPLETED" ? 100 : status === "IN_PROGRESS" ? 50 : 0
                            } : t)
                    }));
            } catch  {
            // Handled by API interceptor / caller
            }
        },
        openCreateDrawer: (preselectedCategoryId = null)=>{
            set({
                isDrawerOpen: true,
                drawerMode: "create",
                editingTask: preselectedCategoryId ? {
                    categoryId: preselectedCategoryId
                } : null
            });
        },
        openEditDrawer: (task)=>{
            set({
                isDrawerOpen: true,
                drawerMode: "edit",
                editingTask: task
            });
        },
        closeDrawer: ()=>{
            set({
                isDrawerOpen: false,
                editingTask: null
            });
        },
        addTask: async (taskData)=>{
            try {
                const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$task$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["taskApi"].create(taskData);
                set((state)=>({
                        tasks: [
                            created,
                            ...state.tasks
                        ],
                        isDrawerOpen: false
                    }));
            } catch  {
            // Handled by API interceptor / caller
            }
        },
        updateTask: async (id, updatedFields)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$task$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["taskApi"].update(id, updatedFields);
                set((state)=>({
                        tasks: state.tasks.map((t)=>t.id === id ? {
                                ...t,
                                ...updatedFields
                            } : t),
                        isDrawerOpen: false,
                        editingTask: null
                    }));
            } catch  {
            // Handled by API interceptor / caller
            }
        },
        deleteTask: async (id)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$task$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["taskApi"].delete(id);
                set((state)=>({
                        tasks: state.tasks.filter((t)=>t.id !== id),
                        selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId
                    }));
            } catch  {
            // Handled by API interceptor / caller
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/tracker.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTrackerStore",
    ()=>useTrackerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/apis/tracker.api.js [app-client] (ecmascript)");
;
;
const useTrackerStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        trackers: [],
        selectedTracker: null,
        activeTrackerDetail: null,
        trackerValues: [],
        pagination: {
            page: 0,
            size: 12,
            totalPages: 1,
            totalElements: 0
        },
        viewMode: "grid",
        filters: {
            trackerTypeId: null,
            status: null,
            search: "",
            isFavorite: false
        },
        drawerOpen: false,
        editingTracker: null,
        isLoading: false,
        setFilters: (newFilters)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        ...newFilters
                    },
                    pagination: {
                        ...state.pagination,
                        page: 0
                    }
                }));
            get().fetchTrackers();
        },
        setViewMode: (mode)=>set({
                viewMode: mode
            }),
        setSelectedTracker: (tracker)=>set({
                selectedTracker: tracker
            }),
        openDrawer: (tracker = null)=>set({
                editingTracker: tracker,
                drawerOpen: true
            }),
        closeDrawer: ()=>set({
                editingTracker: null,
                drawerOpen: false
            }),
        fetchTrackers: async ()=>{
            set({
                isLoading: true
            });
            try {
                const { filters, pagination } = get();
                const params = {
                    page: pagination.page,
                    size: pagination.size,
                    ...filters.trackerTypeId && {
                        trackerTypeId: filters.trackerTypeId
                    },
                    ...filters.status && {
                        status: filters.status
                    },
                    ...filters.search && {
                        search: filters.search
                    }
                };
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].getAll(params);
                let content = res.content || [];
                if (filters.isFavorite) {
                    content = content.filter((t)=>t.isFavorite);
                }
                set({
                    trackers: content,
                    pagination: {
                        ...pagination,
                        totalPages: res.totalPages || 1,
                        totalElements: res.totalElements || content.length
                    }
                });
            } catch  {
                set({
                    trackers: []
                });
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        fetchTrackerById: async (id)=>{
            set({
                isLoading: true
            });
            try {
                const detail = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].getById(id);
                const values = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].getValues(id);
                set({
                    activeTrackerDetail: detail,
                    trackerValues: values || []
                });
                return detail;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        createTracker: async (payload)=>{
            set({
                isLoading: true
            });
            try {
                const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].create(payload);
                get().fetchTrackers();
                return created;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        updateTracker: async (id, payload)=>{
            set({
                isLoading: true
            });
            try {
                const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].update(id, payload);
                get().fetchTrackers();
                if (get().activeTrackerDetail?.id === id) {
                    set({
                        activeTrackerDetail: updated
                    });
                }
                return updated;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        updateStatus: async (id, status)=>{
            set({
                isLoading: true
            });
            try {
                const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].updateStatus(id, status);
                get().fetchTrackers();
                if (get().activeTrackerDetail?.id === id) {
                    set({
                        activeTrackerDetail: updated
                    });
                }
                return updated;
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        // Gamified +1 Quick Increment Action
        quickIncrementProgress: async (tracker, step = 1)=>{
            const current = tracker.currentCount || 0;
            const target = tracker.targetCount || 100;
            const nextVal = Math.min(current + step, target);
            const newStatus = nextVal >= target ? "COMPLETED" : "IN_PROGRESS";
            // Optimistic UI update
            set((state)=>({
                    trackers: state.trackers.map((t)=>t.id === tracker.id ? {
                            ...t,
                            currentCount: nextVal,
                            status: newStatus
                        } : t),
                    activeTrackerDetail: state.activeTrackerDetail?.id === tracker.id ? {
                        ...state.activeTrackerDetail,
                        currentCount: nextVal,
                        status: newStatus
                    } : state.activeTrackerDetail
                }));
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].update(tracker.id, {
                    title: tracker.title,
                    status: newStatus,
                    currentCount: nextVal,
                    targetCount: target,
                    trackerTypeId: tracker.trackerType?.id,
                    isFavorite: tracker.isFavorite
                });
                // Record progress log entry in values
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].saveValue(tracker.id, {
                    value: `Progress updated to ${nextVal} (+${step})`,
                    loggedAt: new Date().toISOString()
                });
                get().fetchTrackers();
            } catch  {
                get().fetchTrackers();
            }
        },
        deleteTracker: async (id)=>{
            set({
                isLoading: true
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$apis$2f$tracker$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackerApi"].delete(id);
                get().fetchTrackers();
            } finally{
                set({
                    isLoading: false
                });
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/cn.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1oqxs9g._.js.map