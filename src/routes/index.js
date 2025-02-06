import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home'
import Movie from './Movie'
import About from './About'
import NotFound from './NotFound'
import Login from './Login'
import Cart from './Cart'
import Mypage from './Mypage'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'
import Order from './Order'
import store from '../store/index'  // Vuex 스토어 불러오기

const routes = [
  { path: '/', component: Home },
  { path: '/movie/:id', component: Movie },
  { path: '/about', component: About },
  // 신규 생성 라우터
  { path: '/login', component: Login },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/mypage', component: Mypage, meta: { requiresAuth: true } },
  { path: '/productList', component: ProductList },
  { path: '/productDetail/:id', name: 'ProductDetail', component: ProductDetail},
  { path: '/:notFound(.*)', component: NotFound },
  { path: '/order', component: Order }
];

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes
});

// 네비게이션 가드: 보호된 페이지에 대해 Vuex의 인증 상태를 확인
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.getters.isAuthenticated) {
      // Vuex에 토큰이 있으면 인증된 것으로 간주
      next();
    } else {
      // 인증되지 않은 경우 로그인 페이지로 이동
      next('/login');
    }
  } else {
    next();
  }
});

export default router;