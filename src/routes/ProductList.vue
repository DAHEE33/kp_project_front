<template>
  <div class="container py-5">
    <h1 class="text-center mb-5">상품 리스트</h1>
    <div class="row g-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3">
        <RouterLink v-if="product && product.id" :to="{ name: 'ProductDetail', params: { id: product.id }, state: { product } }" class="card h-100 shadow-sm">
          <!-- 기존 imageUrl 주석 처리 -->
          <!-- <img :src="product.imageUrl" :alt="product.name" class="card-img-top img-line" /> -->

          <!-- 임의로 src/assets의 이미지 추가 -->
          <img
            :src="getProductImage(product.id)"
            :alt="product.name"
            class="card-img-top img-line"/>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-center">{{ product.name }}</h5>
            <p class="card-text text-center text-muted">{{ product.price.toLocaleString() }}원</p>
            <!-- <p class="card-text text-center text-success">재고: {{ product.stock }}개</p> -->
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import logo from "../assets/logo.png";
import kakaoLogo from "../assets/kakaoLogo.png";
import metacritic from "../assets/Metacritic.png";
import rottenTomatoes from "../assets/Rotten Tomatoes.png";

export default {
  name: "ProductList",
  data() {
    return {
      products: [], // 상품 목록 데이터를 저장할 배열
      images: [logo, kakaoLogo, metacritic, rottenTomatoes],
    };
  },
  mounted() {
    console.log("✅ ProductList 컴포넌트가 마운트되었습니다.");
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        console.log("API 요청 시작: http://localhost:8082/products");
        const response = await axios.get("http://localhost:8082/products");
        console.log("API 응답 성공:", response.data);
        this.products = response.data;
      } catch (error) {
        console.error("상품 목록을 불러오는 중 오류 발생:", error);
      }
    },
    getProductImage(id) {
      // 상품 ID를 기반으로 이미지 배열에서 순환하여 가져오기
      return this.images[(id - 1) % this.images.length];
    },
  },
};
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
  border: 1px solid #999;
}
</style>
