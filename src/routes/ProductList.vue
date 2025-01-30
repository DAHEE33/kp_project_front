<template>
  <div class="container py-5">
    <h1 class="text-center mb-5">상품 리스트</h1>
    <div class="row g-4">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="col-12 col-sm-6 col-md-4 col-lg-3">
        <RouterLink :to="product.detailhref" class="card h-100 shadow-sm">
          <img :src="product.image" :alt="product.title" class="card-img-top img-line" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-center">{{ product.title }}</h5>
            <p class="card-text text-center text-muted">{{ product.price.toLocaleString() }}원</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import testImg from '~/assets/logo.png';
export default {
  name: "ProductList",
  data() {
    return {
      products: [
        { title: "상품 1", price: 10000, image: testImg, detailhref: '/productDetail/d1' },
        { title: "상품 2", price: 20000, image: testImg, detailhref: '/productDetail/d2' },
        { title: "상품 3", price: 30000, image: testImg, detailhref: '/productDetail/d3' },
        { title: "상품 4", price: 40000, image: testImg, detailhref: '/productDetail/d4' },
        { title: "상품 5", price: 50000, image: testImg, detailhref: '/productDetail/d5' },
      ]
    };
  },
};
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
  border:1px solid #999;
}
</style>
