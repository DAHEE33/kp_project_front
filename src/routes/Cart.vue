<template>
  <div class="container py-4">
    <!-- 상품 정보 Header -->
    <div class="d-flex align-items-center border-bottom pb-3 mb-3">
      <input type="checkbox" v-model="allSelected" @change="toggleSelectAll" class="me-2">
      <p class="flex-grow-1 text-secondary m-0">상품 정보</p>
      <p class="text-secondary text-center m-0 quantity-column">수량</p>
      <p class="text-secondary text-center m-0 price-column">주문 금액</p>
      <p class="text-secondary text-center m-0 delivery-column">배송 정보</p>
    </div>

    <!-- 상품 리스트 -->
    <div v-if="cartItems.length > 0">
      <div
        v-for="(item, index) in cartItems"
        :key="item.id"
        class="d-flex align-items-center border-bottom py-3">
        <input
          type="checkbox"
          v-model="item.selected"
          class="me-2">
        <img :src="item.image" alt="상품 이미지" class="product-image me-3">
        <div class="flex-grow-1">
          <p class="mb-0">{{ item.name }}</p>
        </div>
        <p class="text-center mb-0 quantity-column">{{ item.quantity }}</p>
        <p class="text-center fw-bold mb-0 price-column">{{ itemTotalPrice(item) }}원</p>
        <p class="text-center text-secondary mb-0 delivery-column">{{ item.delivery }}</p>
      </div>
    </div>
    <div v-else class="text-center py-5">
      <p class="mb-0 text-muted">장바구니가 비어있습니다.</p>
    </div>

    <!-- 버튼 영역 -->
    <div class="d-flex justify-content-between py-3 border-bottom">
      <button class="btn btn-outline-secondary" @click="removeSelected" :disabled="!cartItems.some(item => item.selected)">
        선택상품 삭제
      </button>
    </div>

    <!-- 주문 요약 -->
    <div class="py-4">
      <div class="d-flex justify-content-between mb-3">
        <p class="mb-0">총 주문 상품</p>
        <p class="mb-0">{{ cartItems.length }}개</p>
      </div>
      <div class="d-flex justify-content-between fw-bold mb-4">
        <p class="mb-0">총 주문 금액</p>
        <p class="mb-0">{{ totalAmount }}원</p>
      </div>
      <div class="d-flex gap-3">
         <RouterLink 
          class="btn btn-light flex-fill" 
          :to="shoppinghref">
            계속 쇼핑하기
        </RouterLink>
        <RouterLink 
          class="btn primary-color flex-fill" 
          :to="orderhref">
            주문하기
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import testImg from '~/assets/logo.png';
export default {
  data() {
    return {
      allSelected: false, // 전체 선택 여부
      cartItems: [
        {
          id: 1,
          name: "바코드 스캔 입출고 재고관리 스프레드시트",
          image: testImg,
          price: 49000,
          quantity: 1,
          delivery: "다운로드(디지털 상품)",
          selected: false,
        },
        {
          id: 2,
          name: "바코드 스캔 입출고 재고관리 스프레드시트",
          image: testImg,
          price: 60000,
          quantity: 2,
          delivery: "다운로드(디지털 상품)",
          selected: false,
        },
      ],
    shoppinghref: '/productList',
    orderhref: '/order'
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },
  methods: {
    // 각 상품의 총 금액 계산
    itemTotalPrice(item) {
      return item.price * item.quantity;
    },
    toggleSelectAll() {
      this.cartItems.forEach((item) => {
        item.selected = this.allSelected;
      });
    },
    removeSelected() {
      this.cartItems = this.cartItems.filter((item) => !item.selected);
      this.allSelected = false;
    },
  },
};
</script>

<style scoped>
@import '~/scss/main.scss';
.text-muted {
  color: #6c757d;
}

.product-image {
  width: 60px;
  height: 60px;
}

.quantity-column {
  width: 100px;
}

.price-column {
  width: 150px;
}

.delivery-column {
  width: 200px;
}
.primary-color {
  background-color: $primary;
  color: white;
  transition: background-color 0.5s;
}
.primary-color:hover {
  background-color: $primary-opacity;
  color: white;
}
</style>
