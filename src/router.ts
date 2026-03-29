import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./components/pages/Home.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import AdminDashboard from "./components/pages/AdminDashboard.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/admin/dashboard',
    name: 'dashboard',
    component: AdminDashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');

  if (to.path.startsWith('/admin') && !user) {
    return next('/login');
  }

  next();
});

export default router;
