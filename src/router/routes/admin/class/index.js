import student from "@/router/routes/admin/class/student";
import course from "@/router/routes/admin/class/course";

export default [
    {
        path: 'class',
        component: () => import('@/views/admin/class/Index.vue'),
        meta: {title: '班级管理'}
    },
    ...student,
    ...course
]
