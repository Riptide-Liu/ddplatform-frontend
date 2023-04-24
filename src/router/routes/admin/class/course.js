export default [
    {
        path: 'class/:class_id/course',
        component: () => import('@/views/admin/class/course/Index.vue'),
        meta: {title: '班级课程计划管理'}
    },
]
