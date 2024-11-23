import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ListarGallos.vue')
    }
    ,{
      path: '/listar-gallos',
      name: 'listargallo',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ListarGallos.vue')
    }
    ,{
      path: '/registro-gallo',
      name: 'registrogallo',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FormGallo.vue')
    },
    {
      path: '/gallo/:id_gallo',
      name: 'editargallo',
      component: () => import('../views/FormGallo.vue'),
    },
    {
      path : '/ver-gallo/:ver_id_gallo',
      name : 'verGallo',
      component: () => import('../views/FormGallo.vue')
    },
    {
      path : '/camadas/:id_gallo',
      name : 'camadas',
      component: () => import('../views/CamadasView.vue')
    },
    {
      path : '/camadas-general/',
      name : 'camadasgeneral',
      component: () => import('../views/CamadasGeneralView.vue')
    },
    {
      path : '/cuidos/:id_gallo',
      name : 'cuidos',
      component: () => import('../views/CuidosView.vue')
    },
    {
      path : '/cuidos-general/',
      name : 'cuidosgeneral',
      component: () => import('../views/CuidosGeneralView.vue')
    },
    {
      path : '/arbol/:id_gallo',
      name : 'arbol',
      component: () => import('../views/ArbolGenealogico.vue')
    },
    {
      path : '/backup',
      name : 'backup',
      component: () => import('../views/BackupView.vue')
    },
  ]
})

export default router
