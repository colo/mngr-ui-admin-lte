
const routes = [
  {
    path: '/',
    component: () => import('layouts/admin-lte.vue'),
    name: 'Home',
    redirect: { name: 'Dashboard' },
    children: [
      {
        path: 'dashboard/:host?',
        component: () => import('pages/dashboard.vue'),
        name: 'Dashboard'
        // children: [
        //   {
        //     path: ':host',
        //     component: () => import('pages/dashboard/host.vue'),
        //   }
        // ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
