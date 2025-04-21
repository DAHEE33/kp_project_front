<template>
  <div class="container py-5">
    <div class="row">
      <!-- 상품 이미지 -->
      <div class="col-md-6 d-flex justify-content-center align-items-start">
        <img
          :src="product.imageUrl || demoImg"
          alt="상품 이미지"
          class="img-fluid rounded"/>
      </div>

      <!-- 상품 정보 -->
      <div class="col-md-6">
        <h1 class="fw-bold mb-3">{{ product.name }}</h1>
        <h2 class="text fw-bold mb-4" style="font-size: 2rem">
          {{ (product.price ?? 0).toLocaleString() }}원
          <small
            class="text-muted text-decoration-line-through"
            style="font-size: 1.2rem">
            {{ (product.fakePrice ?? 249000).toLocaleString() }}원
          </small>
        </h2>
        <p class="text-muted">{{ product.description }}</p>

        <!-- 기간 옵션 -->
        <div class="mb-4">
          <label for="period" class="form-label fw-bold">기간 옵션 *</label>
          <select id="period" class="form-select" v-model="selectedOption">
            <option value="">기간 옵션 (필수)</option>
            <option>3개월</option>
            <option>6개월</option>
            <option>12개월</option>
          </select>
          <p v-if="showError" class="text-danger mt-2">
            기간 옵션을 선택하셔야 합니다.
          </p>
        </div>

        <!-- 버튼 -->
        <div class="d-flex gap-3">
          <button
            class="btn btn-dark flex-fill primary-color"
            @click="handlePurchase">
            구매하기
          </button>
          <button
            class="btn btn-outline-secondary flex-fill"
            @click="handleAddToCart">
            장바구니
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Comments 컴포넌트 -->
  <Comments v-if="product.id" :productId="product.id" />
</template>

<script>
import axios from "axios";
import testImg from "~/assets/logo.png";
import Comments from "~/components/Comments.vue";

export default {
  components: {
    Comments,
  },
  data() {
    return {
      product: {},
      demoImg: testImg,
      selectedOption: "",
      showError: false,
      isLoggedIn: false,
      userId: null,
    };
  },
  mounted() {
    const productId = this.$route.params.id;
    this.fetchProduct(productId);
    this.checkLoginStatus(); // 로그인 상태 확인
  },
  methods: {
  logoutUser(actionType = "") {
  this.isLoggedIn = false;
  this.userId = null;

  if (actionType) {
    console.log(`🔄 [${actionType}] 중 세션 만료 → 강제 새로고침 실행`);
    // ❌ 기존: alert 두 번 발생 가능성 → ✅ "로그인이 필요합니다." 한 번만 띄우기
    setTimeout(() => {
      window.location.reload(); // 🔄 특정 액션 중 세션 만료 시 강제 새로고침
    }, 100); // ✅ alert 후 약간의 딜레이 후 새로고침 (UX 개선)
  }
}

,
    async checkLoginStatus() {
      try {
        console.log("✅ 로그인 상태 확인 API 호출");

        const response = await axios.get("http://localhost:8082/user/info", {
          withCredentials: true, // 🔹 JWT 쿠키 포함 필수
        });

        console.log("✅ API 응답:", response.data);

        if (response.status === 200 && response.data?.loggedIn) {
          this.isLoggedIn = true;
          this.userId = response.data.userId;
          console.log("✅ 로그인 상태: true, userId:", this.userId);
        } else {
          this.isLoggedIn = false;
          this.userId = null;
          console.log("❌ 로그인 상태: false");
        }
      } catch (error) {
        console.error("❌ 로그인 상태 확인 실패:", error);
        this.isLoggedIn = false;
        this.userId = null;
      }
    },

    async fetchProduct(id) {
      try {
        const response = await axios.get(
          `http://localhost:8082/pass/products/${id}`
        );
        this.product = response.data;
      } catch (error) {
        console.error("❌ 상품 정보를 불러오는 중 오류 발생:", error);
      }
    },

    async handleAddToCart() {
      await this.checkLoginStatus();

      if (!this.isLoggedIn) {
        alert("로그인이 필요합니다.");
        return;
      }

      if (!this.selectedOption) {
        this.showError = true;
        return;
      }

      try {
        console.log("🚀 장바구니 추가 API 호출, productId:", this.product.id);

        // ✅ API 요청 (withCredentials: true 사용)
        await axios.post(
          "http://localhost:8082/cart/add",
          { productId: this.product.id, quantity: 1 },
          { withCredentials: true }
        );

        // ✅ 쇼핑 계속 여부 팝업 띄우기
        const proceed = confirm(
          "장바구니에 추가되었습니다. 쇼핑을 계속하시겠습니까?"
        );
        if (!proceed) {
          this.$router.push("/cart");
        }
      } catch (error) {
        console.error("❌ 장바구니 추가 중 오류 발생:", error);
        alert("장바구니에 추가하는 중 오류가 발생했습니다.");
      }
    },
   async handlePurchase() {
  await this.checkLoginStatus();

  if (!this.isLoggedIn) {
    alert("로그인이 필요합니다."); // ✅ 한 번만 alert 실행
    this.logoutUser("구매하기"); // 🔄 새로고침은 logoutUser()에서 처리
    return;
  }

  if (!this.selectedOption) {
    this.showError = true;
    return;
  }

  try {
    console.log("🚀 구매하기 버튼 클릭됨, productId:", this.product.id);

    await axios.post(
      "http://localhost:8082/cart/add",
      { productId: this.product.id, quantity: 1 },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    alert("장바구니에 추가되었습니다.");
    this.$router.push("/cart");
  } catch (error) {
    console.error("❌ 장바구니 추가 중 오류 발생:", error);

    if (error.response?.status === 401) {
      alert("로그인이 필요합니다."); // ✅ 여기서도 한 번만 실행
      this.logoutUser("구매하기");
    } else {
      alert("장바구니에 추가하는 중 오류가 발생했습니다.");
    }
  }
}

,
    showCustomAlert() {
      const proceed = confirm(
        "장바구니에 추가되었습니다. 계속 쇼핑하시겠습니까?"
      );
      if (proceed) {
        this.$router.push("/productList"); // ✅ 쇼핑 계속하기 → 상품 목록 페이지로 이동
      } else {
        this.$router.push("/cart"); // ✅ 장바구니 페이지로 이동
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "~/scss/main.scss";

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
