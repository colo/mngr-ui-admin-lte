
const routes = [
  {
    path: '/',
    component: () => import('layouts/admin-lte.vue'),
    name: 'Home',
    // redirect: { name: 'Dashboard' },
    children: [
      {
        path: 'dashboards',
        component: () => import('pages/dashboard.vue'),
        name: 'Dashboards',
        meta: {
          breadcrumb: {
            parent: 'Home'
          }
        },
        children: [
          {
            name: 'Types',
            path: ':type',
            component: () => import('pages/dashboard/generic.vue'),
            meta: {
              breadcrumb: {
                parent: 'Dashboards'
              }
            },
            children:[
              {
                // name: 'Host',
                path: ':id',
                component: () => import('pages/dashboard/generic.vue'),
                // meta: {
                //   breadcrumb: {
                //     parent: 'Dashboard'
                //
                //   }
                // },
              }
            ]
          }

        ]
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
