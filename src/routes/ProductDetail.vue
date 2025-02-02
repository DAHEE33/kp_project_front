<template>
  <div class="container py-5">
    <div class="row">
      <!-- 상품 이미지 -->
      <div class="col-md-6 d-flex justify-content-center align-items-start">
        <img :src="product.imageUrl || demoImg" alt="상품 이미지" class="img-fluid rounded" />
      </div>

      <!-- 상품 정보 -->
      <div class="col-md-6">
        <h1 class="fw-bold mb-3">{{ product.name }}</h1>
        <h2 class="text fw-bold mb-4" style="font-size: 2rem;">
          {{ (product.price ?? 0).toLocaleString() }}원
          <small class="text-muted text-decoration-line-through" style="font-size: 1.2rem;">
            {{ (product.fakePrice ?? 249000).toLocaleString() }}원
          </small>
        </h2>
        <p class="text-muted">{{ product.description }}</p>

         <!-- 기간 옵션 -->
        <!-- <div class="mb-4">
          <label for="period" class="form-label fw-bold">기간 옵션 *</label>
          <select id="period" class="form-select" v-model="selectedOption">
            <option value="">기간 옵션 (필수)</option>
            <option v-for="(option, index) in product.options" :key="index" :value="option">{{ option }}</option>
          </select>
          <p v-if="showError" class="text-danger mt-2">기간 옵션을 선택하셔야 합니다.</p>
        </div> -->
        <div class="mb-4">
          <label for="period" class="form-label fw-bold">기간 옵션 *</label>
          <select id="period" class="form-select" v-model="selectedOption">
            <option value="">기간 옵션 (필수)</option>
            <option>3개월</option>
            <option>6개월</option>
            <option>12개월</option>
          </select>
          <p v-if="showError" class="text-danger mt-2">기간 옵션을 선택하셔야 합니다.</p>
        </div>


        <!-- 버튼 -->
        <div class="d-flex gap-3">
          <button class="btn btn-dark flex-fill primary-color" @click="handlePurchase">구매하기</button>
          <button class="btn btn-outline-secondary flex-fill" @click="handleAddToCart">장바구니</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Comments 컴포넌트 -->
  <Comments :productId="product.id" />
</template>

<script>
import axios from 'axios';
import testImg from '~/assets/logo.png';
import Comments from '~/components/Comments.vue';

export default {
  components: {
    Comments
  },
  data() {
    return {
      product: {},
      demoImg: testImg,
      selectedOption: '',
      showError: false
    };
  },
  mounted() {
    const productId = this.$route.params.id;
    this.fetchProduct(productId);
  },
  methods: {
    async fetchProduct(id) {
      try {
        const response = await axios.get(`http://localhost:8082/products/${id}`);
        this.product = response.data;
      } catch (error) {
        console.error('❌ 상품 정보를 불러오는 중 오류 발생:', error);
      }
    },
    handlePurchase() {
      if (!this.selectedOption) {
        this.showError = true;
      } else {
        this.$router.push('/cart');
      }
    },
    handleAddToCart() {
      if (!this.selectedOption) {
        this.showError = true;
      } else {
        this.showCustomAlert();
      }
    },
    showCustomAlert() {
      const proceed = confirm('장바구니에 추가되었습니다. 계속 쇼핑하시겠습니까?');
      if (proceed) {
        this.$router.push('/productList');
      } else {
        this.$router.push('/cart');
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '~/scss/main.scss';

.primary-color {
  background-color: $primary;
  color: white;
  transition: background-color 0.5s;
}

.primary-color:hover {
  background-color: $primary-opacity;
  color: white;
}


.text-danger {
  color: red !important;
  font-size: 0.9rem;
}
</style>
