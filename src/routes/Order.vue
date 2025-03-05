<template>
  <div class="container order-page mt-4">
    <h2 class="text-center mb-3">결제하기</h2>
    <div class="row">
      <!-- 왼쪽 컬럼 (상품정보, 주문자정보) -->
      <div class="col-lg-7">
        <!-- 주문 상품 정보 -->
        <div class="card mb-3">
          <div class="card-header">주문 상품 정보</div>
          <div v-if="orderItems && orderItems.length > 0">
            <div
              v-for="item in orderItems"
              :key="item.productName"
              class="d-flex align-items-center mb-2"
            >
              <img
                :src="item.imageUrl || 'https://via.placeholder.com/80'"
                class="img-thumbnail me-3"
              />
              <div>
                <p class="fw-bold mb-1">
                  {{ item.productName || "상품명 없음" }}
                </p>
                <p class="mb-0">
                  <span class="text-danger"
                    >{{ item.price ? item.price.toLocaleString() : 0 }}원</span
                  >
                </p>
                <p class="mb-0">수량: {{ item.quantity || 0 }}개</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-3">주문한 상품이 없습니다.</div>
        </div>

        <!-- 주문자 정보 -->
        <section class="card mb-3">
          <div class="card-header">주문자 정보</div>
          <div class="card-body">
            <p class="mb-1"><strong>이름 :</strong> {{ userInfo.username }}</p>
            <p class="mb-1">
              <strong>전화번호 :</strong>
              <span v-if="userInfo.phone">{{ userInfo.phone }}</span>
              <input
                v-else
                v-model="inputPhoneNumber"
                type="text"
                class="form-control"
                placeholder="전화번호를 입력하세요"
              />
            </p>
            <div class="d-flex justify-content-between">
              <p class="mb-2"><strong>이메일 :</strong> {{ userInfo.email }}</p>
              <button
                @click="updateMethod"
                class="btn btn-outline-primary btn-sm"
              >
                수정
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- 오른쪽 컬럼 (주문 요약, 결제 수단) -->
      <div class="col-lg-5">
        <!-- 주문 요약 -->
        <section class="card mb-3">
          <div class="card-header">주문 요약</div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span>상품가격</span>
              <strong>{{ totalPrice.toLocaleString() }}원</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>상품 할인금액</span>
              <strong>-{{ discountAmount.toLocaleString() }}원</strong>
            </div>
            <div class="d-flex justify-content-between border-top pt-2">
              <span>총 주문금액</span>
              <strong class="text-danger"
                >{{ finalPrice.toLocaleString() }}원</strong
              >
            </div>
          </div>
        </section>

        <!-- 결제 수단 -->
        <section class="card">
          <div class="card-header">결제 수단</div>
          <div class="card-body">
            <div
              v-for="method in paymentMethods"
              :key="method.value"
              class="form-check mb-2"
            >
              <input
                class="form-check-input"
                type="radio"
                name="payment"
                :id="method.value"
                :value="method.value"
                v-model="selectedPayment"
              />
              <label class="form-check-label" :for="method.value">{{
                method.label
              }}</label>
            </div>
            <div v-if="selectedPayment === 'payBank'">
              <select class="form-select mb-2">
                <option>카카오뱅크 333333131313 박주영</option>
              </select>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="입금자명 (미입력시 주문자명)"
              />
              <p class="text-muted">
                주문 후 24시간 동안 미입금시 자동 취소됩니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 하단 영역: 전체 동의, 결제하기 버튼 -->
    <div class="row mt-3">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="checkAll"
              @change="toggleAllCheckboxes"
              id="checkAll"
            />
            <label class="form-check-label" for="checkAll">전체 동의</label>
          </div>
        </div>
        <button class="btn btn-primary btn-lg text-white" @click="processOrder">
          결제하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orderItems: [], // ✅ undefined 방지
      userInfo: { username: "", phone: "", email: "" },
      inputPhoneNumber: "",
      totalPrice: 0,
      discountAmount: 0,
      selectedPayment: "payBank",
      paymentMethods: [
        { value: "payBank", label: "무통장입금" },
        { value: "payKakao", label: "카카오페이" },
        { value: "payToss", label: "토스페이" },
      ],
    };
  },
  computed: {
    finalPrice() {
      return this.totalPrice - this.discountAmount;
    },
  },
  methods: {
    async fetchOrderPreview() {
      console.log("🚀 주문 미리보기 API 요청 시작");

      try {
        const response = await axios.post(
          "http://localhost:8082/orders/preview",
          {
            userId: this.userInfo.id,
            cartIds: [1, 2, 3], // ✅ 장바구니 ID
          }
        );

        console.log("✅ API 응답:", response.data);

        this.orderItems = response.data.orderItems || []; // ✅ undefined 방지
        this.userInfo.username = response.data.username || "알 수 없음";
        this.userInfo.phone = response.data.phoneNumber || "";
        this.userInfo.email = response.data.email || "";

        this.totalPrice = response.data.totalPrice || 0;
        this.discountAmount = response.data.discountAmount || 0;
      } catch (error) {
        console.error("❌ 주문 정보를 불러오는 중 오류 발생:", error);
        this.orderItems = []; // ✅ 요청 실패 시 빈 배열 할당
        this.totalPrice = 0;
        this.discountAmount = 0;
      }
    },
    async processOrder() {
      try {
        const response = await axios.post("/api/orders/create-or-get", {
          userId: this.userInfo.id,
          phoneNumber: this.userInfo.phone || this.inputPhoneNumber,
          cartIds: [1, 2, 3],
          totalPrice: this.finalPrice,
          discountAmount: this.discountAmount,
          paymentMethod: this.selectedPayment,
        });

        alert("주문이 성공적으로 생성되었습니다!");
      } catch (error) {
        console.error("주문 생성 오류:", error);
      }
    },
  },
  created() {
    this.fetchOrderPreview();
  },
};
</script>

<style scoped>
.order-page {
}
</style>
