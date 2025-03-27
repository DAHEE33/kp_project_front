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
           <!-- 전화번호 -->
           <p class="mb-1">
              <strong>전화번호 :</strong>
              <!-- (1) 읽기 모드 -->
              <span v-if="!isEditing">
                <!-- 전화번호가 있으면 그대로 표시 -->
                <span v-if="userInfo.phone">
                  {{ userInfo.phone }}
                </span>
                <!-- 전화번호가 없으면 안내 문구 -->
                <span
                  v-else
                  :class="isPhoneError ? 'text-danger fw-bold' : 'text-muted font-italic'" >
                  전화번호를 입력하세요
                </span>
              </span>

              <!-- (2) 수정 모드 -->
              <input
                v-else
                v-model="userInfo.phone"
                @input="onPhoneInput"
                type="text"
                class="form-control phone-input mt-1"
                placeholder="전화번호를 입력하세요" />
            </p>

            <!-- (수정 모드에서) 하이픈 감지 시 빨간 안내 -->
            <div v-if="isEditing && phoneHasHyphen" class="text-danger fw-bold">
              하이픈(-) 없이 입력해주세요
            </div>



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
              <label class="form-check-label" :for="method.value">{{ method.label }}</label>
            </div>
            <div v-if="selectedPayment === 'payBank'">
              <select class="form-select mb-2">
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
            <input class="form-check-input" type="checkbox" v-model="checkAll" @change="toggleAllCheckboxes" id="checkAll" />
            <label class="form-check-label" for="checkAll">
              전체 동의
            </label>
          </div>
          <div class="form-check ms-3">
            <input class="form-check-input" type="checkbox" v-model="checkTerms" @change="updateCheckAll" id="checkTerms" />
            <label class="form-check-label" for="checkTerms">
              구매조건 동의
            </label>
          </div>
          <div class="form-check ms-3">
            <input class="form-check-input" type="checkbox" v-model="checkPrivacy" @change="updateCheckAll" id="checkPrivacy" />
            <label class="form-check-label" for="checkPrivacy">
              개인정보 처리방침 동의
            </label>
          </div>
        </div>
        <!-- 결제하기 버튼 -->
        <button class="btn btn-primary btn-lg text-white" @click="goToPayment">
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
      originalUserInfo: { userId: null, username: "", phone: "", email: "" },
      userInfo: { username: "", phone: "", email: "" },
      isEditing: false,
      totalPrice: 0,
      discountAmount: 0,
      selectedPayment: "payBank",
      cartIds: [],
      paymentMethods: [
        { value: "payBank", label: "무통장입금" },
        { value: "payKakao", label: "카카오페이" },
        { value: "payToss", label: "토스페이" },
      ],
      phoneError: "", // 전화번호 오류 메시지
      checkAll: false,     // 전체 동의 체크 여부
      checkTerms: false,   // 구매조건 동의 체크 여부
      checkPrivacy: false, // 개인정보 처리방침 동의 체크 여부
    };
  },
  computed: {
    finalPrice() {
      return this.totalPrice - this.discountAmount;
    },
  },
  methods: {
    getUserInfoFromStorage(cartIds) {
      const storedData = localStorage.getItem("modifiedUserInfo");
      if (storedData) {
        const modifiedData = JSON.parse(storedData);
        const hasMultipleCartIds = cartIds.length > 1;
        if (hasMultipleCartIds) {
          this.userInfo = { ...this.originalUserInfo };
          return;
        }
        const cartId = cartIds[0];
        if (modifiedData[cartId]) {
          this.userInfo = { ...modifiedData[cartId] };
        } else {
          this.userInfo = { ...this.originalUserInfo };
        }
      } else {
        this.userInfo = { ...this.originalUserInfo };
      }
    },
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
        if (!this.originalUserInfo.userId) {
          this.originalUserInfo = {
            userId: response.data.userId,
            username: response.data.username || "알 수 없음",
            phone: response.data.phoneNumber || "",
            email: response.data.email || "",
          };
        }
        this.getUserInfoFromStorage(this.cartIds);
      } catch (error) {
        console.error("❌ 주문 정보를 불러오는 중 오류 발생:", error);
      }
    },
    toggleEdit() {
      if (this.isEditing) {
        const storedData = localStorage.getItem("modifiedUserInfo");
        const modifiedData = storedData ? JSON.parse(storedData) : {};
        if (this.cartIds.length === 1) {
          const cartId = this.cartIds[0];
          modifiedData[cartId] = { ...this.userInfo };
        }
        localStorage.setItem("modifiedUserInfo", JSON.stringify(modifiedData));
        // 전화번호가 없으면 alert 후, 수정 모드 유지
        if (!this.userInfo.phone) {
          alert("전화번호를 입력하세요");
          return;
        }
      }
      this.isEditing = !this.isEditing;
    },
     // -----------------------------------
    // 1) 하이픈 자동 제거 & 경고 플래그
    // -----------------------------------
    onPhoneInput() {
      if (this.userInfo.phone.includes("-")) {
        this.phoneHasHyphen = true;
        // 입력 중 하이픈을 모두 제거
        this.userInfo.phone = this.userInfo.phone.replace(/-/g, "");
      } else {
        this.phoneHasHyphen = false;
      }
      // 에러 상태를 초기화(입력하면 빨간 글씨가 풀리도록)
      this.isPhoneError = false;
    },

    async goToPayment() {
      // 전화번호 미입력 시 에러
      if (!this.userInfo.phone) {
        alert("전화번호를 입력하세요");
        this.isPhoneError = true; // 빨간색 안내로 전환
        return;
      }
      // 구매조건 및 개인정보 처리방침 체크 여부 확인
      if (!this.checkTerms) {
        alert("구매 조건 동의하기를 확인해주세요");
        return;
      }
      if (!this.checkPrivacy) {
        alert("개인정보 처리방침 동의하기를 확인해주세요");
        return;
      }
      // 오류 메시지가 있다면 값이 채워지면 초기화
      this.phoneError = "";

      try {
        const orderRequest = {
          cartIds: this.cartIds,
          recipientName: this.userInfo.username,
          recipientPhone: this.userInfo.phone,
          recipientEmail: this.userInfo.email,
          paymentMethod: "TOSS"
        };
        const response = await axios.post(
          "http://localhost:8082/orders/create",
          orderRequest,
          { withCredentials: true }
        );
        const orderData = response.data;
        console.log("주문 생성 완료, orderId:", orderData.orderId);
        this.$router.push({
          path: '/payment',
          query: {
            orderId: orderData.orderId,
            totalPrice: orderData.totalPrice
          }
        });
      } catch (error) {
        console.error("주문 생성 중 오류 발생:", error);
      }
    },
    // 예시로 toggleAllCheckboxes, updateCheckAll 함수 추가 (필요에 따라 구현)
    toggleAllCheckboxes() {
      // 전체 동의가 클릭되면 개별 항목을 모두 변경
      this.checkTerms = this.checkAll;
      this.checkPrivacy = this.checkAll;
    },
    updateCheckAll() {
      // 개별 항목의 체크 상태에 따라 전체 동의 체크 여부 업데이트
      this.checkAll = this.checkTerms && this.checkPrivacy;
    }
  },
  created() {
    this.getCartIdsFromStorage();
    this.fetchOrderPreview();
  },
};
</script>

<style scoped>
/* 전화번호가 없을 때의 연회색(흘림체) 안내 */
.font-italic {
  font-style: italic;
}

/* input placeholder를 빨간색/굵게 하고 싶다면 (선택사항) */
.phone-input::placeholder {
  color: #6c757d; /* 기본 Bootstrap placeholder 색상(회색) */
  font-style: italic;
}

/* 원하는 경우 빨간색으로 바꾸려면 */
.phone-input::placeholder {
 color: red;
 font-weight: bold;
}
</style>
