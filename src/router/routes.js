
const routes = [
  {
    path: '/',
    component: () => import('layouts/admin-lte.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard.vue') }
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
