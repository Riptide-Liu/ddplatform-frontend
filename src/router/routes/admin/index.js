import user from "@/router/routes/admin/user";
import classes from "@/router/routes/admin/class";
import course from "@/router/routes/admin/course";

export default [
    {
        path: '/admin',
        component: () => import('@/views/admin/Index.vue'),
        children: [
            {
                path: '',
                component: () => import('@/views/admin/user/Index'),
                meta: {title: '用户管理'}
            },
            ...user,
            ...classes,
            ...course
        ]
    }
]
