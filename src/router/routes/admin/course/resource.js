export default [
    {
        path: 'course/:course_id/resource',
        component: () => import('@/views/admin/course/resource/Index.vue'),
        meta: {title: '课程资源管理'}
    },
]
