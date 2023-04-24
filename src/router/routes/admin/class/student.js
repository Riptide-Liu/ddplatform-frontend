export default [
    {
        path: 'class/:class_id/student',
        component: () => import('@/views/admin/class/student/Index.vue'),
        meta: {title: '班级学生管理'}
    },
]
