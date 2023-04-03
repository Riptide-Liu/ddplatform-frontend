import resource from "@/router/routes/admin/course/resource";
import chapter from "@/router/routes/admin/course/chapter";

export default [
    {
        path: 'course',
        component: () => import('@/views/admin/course/Index.vue'),
        meta: {title: '课程管理'},
    },
    ...resource,
    ...chapter
]
