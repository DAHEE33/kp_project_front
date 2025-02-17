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
     <div v-if="cartItems && cartItems.length > 0">
      <div v-for="item in cartItems" :key="item.product.id" class="d-flex align-items-center border-bottom py-3">
        <input type="checkbox" v-model="item.selected" class="me-2">
        <img :src="item.product.imageUrl || demoImg" alt="상품 이미지" class="product-image me-3">
        <div class="flex-grow-1">
          <p class="mb-0">{{ item.product.name }}</p>
        </div>
        <input 
          type="number" 
          class="text-center mb-0 quantity-input" 
          v-model.number="item.quantity"
          @change="updateQuantity(item)"
          min="1"
        >
        <p class="text-center fw-bold mb-0 price-column">{{ itemTotalPrice(item) }}원</p>
        <p class="text-center text-secondary mb-0 delivery-column">{{ item.product.delivery || '다운로드(디지털 상품)' }}</p>
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
        <RouterLink class="btn btn-light flex-fill" :to="shoppinghref">계속 쇼핑하기</RouterLink>
        <RouterLink class="btn primary-color flex-fill" :to="orderhref">주문하기</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import testImg from "~/assets/logo.png";

export default {
  data() {
    return {
      allSelected: false, // 전체 선택 여부
      cartItems: [],
      shoppinghref: "/productList",
      orderhref: "/order",
      demoImg: testImg, // 기본 이미지
    };
  },
  computed: {
    // 총 주문 금액 계산
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },
  },
  async mounted() {
    await this.fetchCartItems();
  },
  methods: {
    // ✅ 장바구니 불러오기
    async fetchCartItems() {
      try {
        const response = await axios.get("http://localhost:8082/cart/list", {
          headers: { Authorization: `Bearer ${this.getToken()}` },
        });
        this.cartItems = response.data.map(item => ({
          ...item,
          selected: false, // 선택 여부 추가
        }));
      } catch (error) {
        console.error("❌ 장바구니 데이터를 불러오는 중 오류 발생:", error);
      }
    },

    // ✅ 각 상품의 총 금액 계산
    itemTotalPrice(item) {
      return item.product.price * item.quantity;
    },

    // ✅ 전체 선택 / 해제
    toggleSelectAll() {
      this.cartItems.forEach((item) => {
        item.selected = this.allSelected;
      });
    },

    // ✅ 선택한 상품 삭제
    async removeSelected() {
      const selectedItems = this.cartItems.filter(item => item.selected);
      for (const item of selectedItems) {
        await this.removeFromCart(item.product.id);
      }
      this.fetchCartItems();
      this.allSelected = false;
    },

    // ✅ 개별 상품 삭제
    async removeFromCart(productId) {
      try {
        await axios.delete(`http://localhost:8082/cart/remove/${productId}`, {
          headers: { Authorization: `Bearer ${this.getToken()}` },
        });
      } catch (error) {
        console.error("❌ 장바구니 상품 삭제 오류:", error);
      }
    },

    // ✅ 상품 수량 변경 API 호출
    async updateQuantity(item) {
      if (item.quantity < 1) {
        item.quantity = 1; // 최소 수량 제한
      }
      try {
        await axios.put(
          "http://localhost:8082/cart/update",
          {
            productId: item.product.id,
            quantity: item.quantity,
          },
          {
            headers: { Authorization: `Bearer ${this.getToken()}` },
          }
        );
      } catch (error) {
        console.error("❌ 수량 변경 중 오류 발생:", error);
      }
    },

    // ✅ JWT 토큰 가져오기
    getToken() {
      return localStorage.getItem("loginJwtToken");
    },
  },
};
</script>

<style scoped lang="scss">
@import "~/scss/main.scss";

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

.quantity-input {
  width: 50px;
  text-align: center;
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
