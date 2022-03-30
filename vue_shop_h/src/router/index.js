import Vue from 'vue'
import VueRouter from 'vue-router'


// 路由懒加载
// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')

// import Welcome from '../components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users'
const Users = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/user/Users.vue')

// import Roles from '../components/power/Roles'
const Roles = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/power/Roles.vue')

// import Rights from '../components/power/Rights'
const Rights = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/power/Rights.vue')

// import Categories from '../components/goods/Categories'
const Categories = () => import(/* webpackChunkName: "cate_param" */ '../components/goods/Categories.vue')

// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName: "cate_param" */ '../components/goods/Params.vue')

// import List from '../components/goods/List'
const List = () => import(/* webpackChunkName: "list_add" */ '../components/goods/List.vue')

// import Add from '../components/goods/Add'
const Add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/Add.vue')


// import Order from '../components/order/Order'
const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order.vue')

// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'   //如果path是访问‘/‘，就重定向到login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',   //或者这里写 redirect:'/home/welcome' 然后children里的path也改成 path:'welcome',

    children: [
      {
        path: '/welcome',
        component: Welcome,

      },
      {
        path: '/users',
        component: Users,

      },
      {
        path: '/roles',
        component: Roles,

      },
      {
        path: '/rights',
        component: Rights,

      },
      {
        path: '/categories',
        component: Categories,

      },
      {
        path: '/params',
        component: Params,

      },
      {
        path: '/goods',
        component: List,

      },
      {
        path: '/goods/add',
        component: Add,
      },
      {
        path: '/orders',
        component: Order,
      },
      {
        path: '/reports',
        component: Report,
      },

    ]
  },
]

const router = new VueRouter({
  routes
});


router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
