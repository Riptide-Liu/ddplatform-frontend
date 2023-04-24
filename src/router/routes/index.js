import test from "@/router/routes/test.js";
import admin from "@/router/routes/admin";
import course from "@/router/routes/course";

export default [
    {
        path: '/',
        component: () => import('@/views/Home'),
        meta: {title: 'DDPlatform'},
        children: [
            ...course
        ],
    },
    {
        path: '/user/login',
        component: () => import('@/views/user/Login'),
    },
    ...admin,
    ...test
]
