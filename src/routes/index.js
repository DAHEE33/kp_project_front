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
export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/movie/:id',
      component: Movie
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/:notFound(.*)',
      component: NotFound
    },
    /* 신규 추가 소스 */

    // 로그인 페이지
    {
      path: '/login',
      component: Login
    },
    // 장바구니 페이지
    {
      path: '/cart',
      component: Cart
    },
    // 마이페이지
    {
      path: '/mypage',
      component: Mypage
    },
    // 상품목록 페이지
    {
      path: '/productList',
      component: ProductList
    },
    // 상품상세 페이지
    {
      path: '/productDetail/:id',
      component: ProductDetail
    }
  ]
})
