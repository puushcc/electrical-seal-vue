import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/login/Register.vue'
import FindPass from '../views/login/FindPass.vue'
import Login from '../views/login/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'ALogin',
    component: () => import('../views/admin/ALogin.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/findpass',
    name: 'FindPass',
    component: FindPass
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    redirect: '/index',
    children:[
      {
        path: '/index',
        name: 'Index',
        component: () => import('../components/layout/Index.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/contract',
        name: 'Contract',
        component: () => import('../components/Contract/Contract.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/rederContract',
        name: 'RederContract',
        component: () => import('../components/Contract/RederContract.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/addContract',
        name: 'AddContract',
        component: () => import('../components/Contract/AddContract.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/personalCenter',
        name: 'PersonalCenter',
        component: () => import('../components/management/PersonalCenter.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/sealCenter',
        name: 'SealCenter',
        component: () => import('../components/management/SealCenter.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/pcertification',
        name: 'Pcertification',
        component: () => import('../components/Certification/Pcertification.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/ecertification',
        name: 'Ecertification',
        component: () => import('../components/Certification/Ecertification.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/sealDesgin',
        name: 'SealDesgin',
        component: () => import('../components/seal/SealDesgin.vue'),
        meta: {
          requireAuth: true
        }
      },
    ]
  },
  {
    path: '/ahome',
    name: 'AHome',
    component: () => import(/* webpackChunkName: "about" */ '../views/AHome.vue'),
    redirect: '/adminindex',
    children:[
      {
        path: '/adminindex',
        name: 'AdminIndex',
        component: () => import('../components/admin/AdminIndex.vue'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/adminecert',
        name: 'Adminecert',
        component: () => import('../components/admin/Adminecert.vue'),
        meta: {
          requireAuth: true
        }
      },
      
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
