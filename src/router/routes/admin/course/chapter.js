export default [
    {
        path: 'course/:course_id/chapter',
        component: () => import('@/views/admin/course/chapter/Index.vue'),
        meta: {title: '课程章节管理'}
    },
]
