<template>
  <div class="payment-container">
    <!-- 결제 수단 영역 -->
    <div id="payment-method"></div>

    <!-- 약관 영역 -->
    <div id="agreement" style="margin-top: 20px;"></div>

    <!-- 버튼을 감싸는 영역 -->
    <div class="button-wrapper">
      <button class="payment-button" @click="requestPayment">
        결제하기
      </button>
    </div>
  </div>
</template>

<script>
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

export default {
  data() {
    return {
      clientKey: "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm", // 실제 키로 교체
      customerKey: "", // 주문 생성 API로부터 전달받은 사용자 ID (userId)
      orderId: "",     // 주문 생성 API에서 받은 주문 ID
      totalPrice: 0,   // 주문 생성 API에서 계산한 총 금액
      widgets: null,
    };
  },
  methods: {
    async requestPayment() {
      console.log("this.orderId : " + this.orderId);
      if (!this.widgets) return;
      try {
        await this.widgets.requestPayment({
          orderId: this.orderId, // 주문 생성 시 받은 orderId 사용
          orderName: "프로그램", // 필요시 동적으로 변경 가능 -> 추가 수정
          successUrl: window.location.origin + "/success.html",
          failUrl: window.location.origin + "/fail.html",
          // 추가로 고객 정보(이메일, 이름, 전화번호)를 전달할 수 있음
          // customerEmail: "", 
          // customerName: "",
          // customerMobilePhone: ""
        });
      } catch (error) {
        console.error("결제 요청 오류:", error);
      }
    },
    async initializeTossWidget() {
      // query parameter로부터 orderId, totalPrice, userId를 읽어옵니다.
      // URL 예시: /payment?orderId=123&totalPrice=50000&userId=28
      this.orderId = this.$route.query.orderId || "unique_order_id_123";
      this.totalPrice = Number(this.$route.query.totalPrice) || 50000;
      this.customerKey = this.$route.query.userId || "MyMNQmU263rgwoF4IyGpR";

      try {
        const tossPayments = await loadTossPayments(this.clientKey);
        // customerKey는 JWT로부터 받은 userId를 사용 (프론트엔드로 전달됨)
        this.widgets = tossPayments.widgets({ customerKey: this.customerKey });
        
        // 결제 금액 설정
        await this.widgets.setAmount({
          currency: "KRW",
          value: this.totalPrice,
        });

        // 결제 수단과 약관 UI 렌더링
        await Promise.all([
          this.widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          this.widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);
      } catch (error) {
        console.error("Toss 위젯 초기화 오류:", error);
      }
    }
  },
  async mounted() {
    this.initializeTossWidget();
  }
};
</script>

<style scoped>
.payment-container {
  padding: 0 20px;
  box-sizing: border-box;
}

.button-wrapper {
  margin-top: 20px;
  text-align: right;
  padding-right: 30px;
}

.payment-button {
  background-color: #0064FF;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 14px 30px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.payment-button:hover {
  background-color: #0052f3;
}
</style>
