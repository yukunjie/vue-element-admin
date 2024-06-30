/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productsRouter = {
  path: '/products',
  component: Layout,
  redirect: '/products/list',
  name: 'ProductManagement',
  meta: {
    title: 'productManagement',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'dynamicTable' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'dragTable' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'inlineEditTable' }
    // },
    {
      path: 'list',
      component: () => import('@/views/products/list'),
      name: 'ProductList',
      meta: { title: 'productList' }
    },
    {
      path: 'tag',
      component: () => import('@/views/products/tag'),
      name: 'ProductTag',
      meta: { title: 'productTag' }
    }
  ]
}
export default productsRouter
