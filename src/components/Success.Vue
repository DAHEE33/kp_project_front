<template>
    <div class="wrapper">
      <div class="flex-column align-center confirm-loading w-100 max-w-540" v-if="!isConfirmed">
        <div class="flex-column align-center">
          <img src="https://static.toss.im/lotties/loading-spot-apng.png" width="120" height="120" />
          <h2 class="title text-center">결제 요청까지 성공했어요.</h2>
          <h4 class="text-center description">결제 승인하고 완료해보세요.</h4>
        </div>
        <div class="w-100">
          <button id="confirmPaymentButton" class="btn primary w-100" @click="confirmPayment">
            결제 승인하기
          </button>
        </div>
      </div>
      <div class="flex-column align-center confirm-success w-100 max-w-540" v-else>
        <img src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" width="120" height="120" />
        <h2 class="title">결제를 완료했어요</h2>
        <div class="response-section w-100">
          <div class="flex justify-between">
            <span class="response-label">결제 금액</span>
            <span class="response-text">{{ amount }}원</span>
          </div>
          <div class="flex justify-between">
            <span class="response-label">주문번호</span>
            <span class="response-text">{{ orderId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="response-label">paymentKey</span>
            <span class="response-text">{{ paymentKey }}</span>
          </div>
        </div>
        <div class="w-100 button-group">
          <div class="flex" style="gap: 16px;">
            <a class="btn w-100" href="https://developers.tosspayments.com/sandbox" target="_blank">다시 테스트하기</a>
            <a class="btn w-100" href="https://docs.tosspayments.com/guides/v2/payment-widget/integration" target="_blank" rel="noreferrer noopener">결제 연동 문서가기</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        paymentKey: "",
        orderId: "",
        amount: "",
        isConfirmed: false,
      };
    },
    mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      this.paymentKey = urlParams.get("paymentKey");
      this.orderId = urlParams.get("orderId");
      this.amount = urlParams.get("amount");
    },
    methods: {
      async confirmPayment() {
        const requestData = {
          paymentKey: this.paymentKey,
          orderId: this.orderId,
          amount: this.amount,
        };
  
        try {
          const response = await fetch("/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          });
          const json = await response.json();
          if (!response.ok) {
            // 결제 실패 시 실패 페이지로 라우팅 (Vue Router 사용)
            this.$router.push({
              path: "/payment/fail",
              query: { code: json.code, message: json.message },
            });
          } else {
            console.log("결제 승인 성공:", json);
            this.isConfirmed = true;
          }
        } catch (error) {
          console.error("결제 승인 중 오류:", error);
          this.$router.push({
            path: "/payment/fail",
            query: { code: "UNKNOWN", message: "결제 승인 중 오류 발생" },
          });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .wrapper {
    padding: 20px;
    text-align: center;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .max-w-540 {
    max-width: 540px;
    margin: 0 auto;
  }
  .btn {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #0064ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    text-align: center;
    margin-top: 16px;
  }
  .btn:hover {
    background-color: #0052f3;
  }
  .response-section {
    margin-top: 16px;
    text-align: left;
  }
  .flex {
    display: flex;
  }
  .justify-between {
    justify-content: space-between;
  }
  </style>
  