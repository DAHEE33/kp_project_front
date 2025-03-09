<template>
  <div class="container order-page mt-4">
    <h2 class="text-center mb-3">결제하기</h2>
    <div class="row">
      <!-- 왼쪽 컬럼 (상품정보, 주문자정보) -->
      <div class="col-lg-7">
        <!-- 주문 상품 정보 -->
        <section class="card mb-3">
          <div class="card-header">주문 상품 정보</div>
          <div class="card-body">
            <div v-if="orderItems && orderItems.length > 0">
              <div v-for="item in orderItems" :key="item.productName" class="d-flex align-items-center mb-2">
                <!-- <img
                :src="item.imageUrl || 'https://via.placeholder.com/80'"
                class="img-thumbnail me-3" /> -->
                <div>
                  <p class="fw-bold mb-1">
                    {{ item.productName || "상품명 없음" }}
                  </p>
                  <p class="mb-0">
                    <span class="text-danger">{{ item.price ? item.price.toLocaleString() : 0 }}원</span>
                  </p>
                  <p class="mb-0">수량: {{ item.quantity || 0 }}개</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center p-3">주문한 상품이 없습니다.</div>
          </div>
        </section>


         <!-- 주문자 정보 -->
         <section class="card mb-3">
          <div class="card-header">주문자 정보</div>
          <div class="card-body">
            <p class="mb-1">
              <strong>이름 :</strong>
              <span v-if="!isEditing">{{ userInfo.username || "알 수 없음" }}</span>
              <input v-else v-model="userInfo.username" type="text" class="form-control" />
            </p>
            <p class="mb-1">
              <strong>전화번호 :</strong>
              <span v-if="!isEditing">
                <span v-if="userInfo.phone">{{ userInfo.phone }}</span>
                <span v-else class="text-muted">전화번호를 입력하세요</span>
              </span>
              <input v-else v-model="userInfo.phone" type="text" class="form-control" placeholder="전화번호를 입력하세요" />
            </p>
            <p class="mb-1">
              <strong>이메일 :</strong>
              <span v-if="!isEditing">{{ userInfo.email || "이메일 없음" }}</span>
              <input v-else v-model="userInfo.email" type="email" class="form-control" />
            </p>
            <div class="text-end mt-2">
      <button @click="toggleEdit" class="btn btn-outline-primary btn-sm">
        {{ isEditing ? "수정 완료" : "수정" }}
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
              <strong class="text-danger">{{ finalPrice.toLocaleString() }}원</strong>
            </div>
          </div>
        </section>

        <!-- 결제 수단 -->
        <section class="card">
          <div class="card-header">결제 수단</div>
          <div class="card-body">
            <div v-for="method in paymentMethods" :key="method.value" class="form-check mb-2">
              <input class="form-check-input" type="radio" name="payment" :id="method.value" :value="method.value"
                v-model="selectedPayment" />
              <label class="form-check-label" :for="method.value">{{
                method.label
              }}</label>
            </div>
            <div v-if="selectedPayment === 'payBank'">
              <select class="form-select mb-2">
                <!-- 테이블에서 값 가져오기 -->
                <option>카카오뱅크 333333131313 박주영</option>
                <option>국민은행 333333131313 박주영</option>
                <option>농협 333333131313 박주영</option>
              </select>
              <input type="text" class="form-control mb-2" placeholder="입금자명 (미입력시 주문자명)" />
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
        <!-- 동의 체크박스 -->
        <div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="checkAll" @change="toggleAllCheckboxes"
              id="checkAll" />
            <label class="form-check-label" for="checkAll">
              전체 동의
            </label>
          </div>
          <!-- 구매조건 동의 등 세부 체크박스도 비슷하게 -->
          <div class="form-check ms-3">
            <input class="form-check-input" type="checkbox" v-model="checkTerms" @change="updateCheckAll"
              id="checkTerms" />
            <label class="form-check-label" for="checkTerms">
              구매조건 동의
            </label>
          </div>
          <div class="form-check ms-3">
            <input class="form-check-input" type="checkbox" v-model="checkPrivacy" @change="updateCheckAll"
              id="checkPrivacy" />
            <label class="form-check-label" for="checkPrivacy">
              개인정보 처리방침 동의
            </label>
          </div>
        </div>
        <!-- 결제하기 버튼 -->
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
      orderItems: [],
      originalUserInfo: { userId: null, username: "", phone: "", email: "" }, // 원래 고객 정보
      userInfo: { username: "", phone: "", email: "" }, // 화면에서 보여줄 정보
      isEditing: false,
      totalPrice: 0,
      discountAmount: 0,
      selectedPayment: "payBank",
      cartIds: [], // 현재 장바구니 ID 리스트
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
    // ✅ localStorage에서 cartId별 수정된 정보 불러오기
    getUserInfoFromStorage(cartIds) {
      const storedData = localStorage.getItem("modifiedUserInfo");
      if (storedData) {
        const modifiedData = JSON.parse(storedData);
        
        // ✅ 여러 개의 cartId가 있으면 수정된 데이터 무효화 (기본값 복원)
        const hasMultipleCartIds = cartIds.length > 1;
        if (hasMultipleCartIds) {
          this.userInfo = { ...this.originalUserInfo };
          return;
        }

        // ✅ 단일 cartId인 경우, 수정된 정보가 있으면 적용
        const cartId = cartIds[0]; // 현재 선택된 장바구니 ID
        if (modifiedData[cartId]) {
          this.userInfo = { ...modifiedData[cartId] };
        } else {
          this.userInfo = { ...this.originalUserInfo };
        }
      } else {
        this.userInfo = { ...this.originalUserInfo };
      }
    },

    // ✅ localStorage에서 장바구니 ID 가져오기
    getCartIdsFromStorage() {
      const storedCartIds = localStorage.getItem("selectedCartIds");
      this.cartIds = storedCartIds ? JSON.parse(storedCartIds) : [];
    },

    async fetchOrderPreview() {
      if (this.cartIds.length === 0) {
        console.warn("🚨 선택된 장바구니가 없습니다.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8082/orders/preview",
          { cartIds: this.cartIds },
          { withCredentials: true }
        );

        this.orderItems = response.data.orderItems || [];
        this.totalPrice = response.data.totalPrice || 0;
        this.discountAmount = response.data.discountAmount || 0;

        // ✅ userId는 변하지 않는 값으로 유지
        if (!this.originalUserInfo.userId) {
          this.originalUserInfo = {
            userId: response.data.userId,
            username: response.data.username || "알 수 없음",
            phone: response.data.phoneNumber || "",
            email: response.data.email || "",
          };
        }

        // ✅ localStorage에서 수정된 정보 적용
        this.getUserInfoFromStorage(this.cartIds);
      } catch (error) {
        console.error("❌ 주문 정보를 불러오는 중 오류 발생:", error);
      }
    },

    toggleEdit() {
      if (this.isEditing) {
        // ✅ 수정 완료 시 localStorage에 cartId 기준으로 저장
        const storedData = localStorage.getItem("modifiedUserInfo");
        const modifiedData = storedData ? JSON.parse(storedData) : {};

        // ✅ 단일 cartId에 대해서만 저장
        if (this.cartIds.length === 1) {
          const cartId = this.cartIds[0];
          modifiedData[cartId] = { ...this.userInfo };
        }

        localStorage.setItem("modifiedUserInfo", JSON.stringify(modifiedData));
      }
      this.isEditing = !this.isEditing;
    },

    // async processOrder() {
    //   if (!this.userInfo.phone) {
    //     alert("📢 전화번호를 입력하세요!");
    //     return;
    //   }

    //   // ✅ 결제 요청 시 userId + 수정된 정보 전송
    //   const orderData = {
    //     userId: this.originalUserInfo.userId, // 변경되지 않는 userId
    //     username: this.userInfo.username,
    //     phone: this.userInfo.phone,
    //     email: this.userInfo.email,
    //     cartIds: this.cartIds, // 장바구니 ID
    //     paymentMethod: this.selectedPayment, // 결제 수단
    //   };

    //   try {
    //     const response = await axios.post(
    //       "http://localhost:8082/orders/checkout",
    //       orderData,
    //       { withCredentials: true }
    //     );

    //     alert("✅ 주문이 완료되었습니다!");
    //   } catch (error) {
    //     console.error("❌ 결제 처리 중 오류 발생:", error);
    //     alert("❌ 결제에 실패했습니다.");
    //   }
    // },
  },
  created() {
    this.getCartIdsFromStorage();
    this.fetchOrderPreview();
  },
};
</script>



<style scoped>
.order-page {}

.text-end {
  text-align: right;
}
</style>
