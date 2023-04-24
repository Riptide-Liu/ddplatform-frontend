export default [
    {
        path: '',
        component: () => import('@/views/course/List.vue'),
        meta: {title: '课程'}
    },
    {
        path: '/course/:course_id',
        component: () => import('@/views/course/Index.vue'),
        meta: {title: ''},
        children: [
            {
                path: '',
                component: () => import('@/views/course/Item'),
                meta: {title: '课程内容'},
            },
            {
                path: 'unit/:unit_id',
                component: () => import('@/views/course/chapter/Unit.vue'),
                meta: {title: '单元内容'},
            },
            {
                path: 'resource',
                component: () => import('@/views/course/Resource.vue'),
                meta: {title: '课程资源'},
            },
            {
                path: 'student',
                component: () => import('@/views/course/Student.vue'),
                meta: {title: '我的同学'},
            },
        ]
    },
]
