export default [
    {
        path: '/',
        component: () => import('@/views/Home'),
        children: [
            {
                path: '',
                component: () => import('@/views/user/Login'),
            },
        ],
    },
]
