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
      clientKey: "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
      customerKey: "MyMNQmU263rgwoF4IyGpR",
      widgets: null,
    };
  },
  methods: {
    async requestPayment() {
      if (!this.widgets) return;

      try {
        await this.widgets.requestPayment({
          orderId: "unique_order_id_123",
          orderName: "토스 티셔츠 외 2건",
          successUrl: window.location.origin + "/success.html",
          failUrl: window.location.origin + "/fail.html",
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          customerMobilePhone: "01012341234",
        });
      } catch (error) {
        console.error("결제 요청 오류:", error);
      }
    },
  },
  async mounted() {
    try {
      const tossPayments = await loadTossPayments(this.clientKey);
      this.widgets = tossPayments.widgets({ customerKey: this.customerKey });

      // 결제 금액 설정 (예: 50,000원)
      await this.widgets.setAmount({
        currency: "KRW",
        value: 50000,
      });

      // 결제수단 & 약관 렌더링
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
      console.error("위젯 초기화 오류:", error);
    }
  },
};
</script>

<style scoped>
/* 전체 래퍼 컨테이너에 좌우 패딩을 주어 버튼이 화면 끝으로 안 가도록 함 */
.payment-container {
  padding: 0 20px; /* 필요에 따라 값 조정 */
  box-sizing: border-box;
  /* 원하는 경우, 최대 너비를 주고 가운데 정렬도 가능
  max-width: 900px;
  margin: 0 auto;
  */
}

.button-wrapper {
  margin-top: 20px;
  text-align: right; /* 버튼을 오른쪽 정렬 */
  padding-right:  30px;
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
