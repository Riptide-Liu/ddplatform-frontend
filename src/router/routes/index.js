import test from "@/router/routes/test.js";
import admin from "@/router/routes/admin";

export default [
    {
        path: '/',
        component: () => import('@/views/Home'),
        children: [
        ],
    },
    {
        path: '/user/login',
        component: () => import('@/views/user/Login'),
    },
    ...admin,
    ...test
]
