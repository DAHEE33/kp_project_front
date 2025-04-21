<template>
    <div class="success-container">
      <!-- 체크 아이콘 -->
      <div class="check-icon">
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17l-3.59-3.59L4 13l5 5 10-10-1.41-1.42z" />
        </svg>
      </div>
  
      <h2>결제를 완료했어요</h2>
  
      <!-- 결제 정보 표시 -->
      <p>주문번호: {{ orderId }}</p>
      <p>결제 금액: {{ amount }} 원</p>
      <p>결제 키: {{ paymentKey }}</p>
  
      <!-- 서버 응답(선택적으로 표시) -->
      <div v-if="serverResponse">
        <pre>{{ serverResponse }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Success",
    data() {
      return {
        paymentKey: "",
        orderId: "",
        amount: "",
        // 서버에서 받은 응답 전체를 저장(선택)
        serverResponse: null,
      };
    },
    async mounted() {
      // 1) 쿼리 파라미터에서 결제 정보 추출
      const urlParams = new URLSearchParams(window.location.search);
      this.paymentKey = urlParams.get("paymentKey");
      this.orderId = urlParams.get("orderId");
      this.amount = urlParams.get("amount");
  
      // 2) /confirm 엔드포인트로 POST → 결제 승인 / DB 저장 등 수행
      try {
        const requestData = {
          paymentKey: this.paymentKey,
          orderId: this.orderId,
          amount: this.amount,
        };
  
        const response = await fetch("/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        const json = await response.json();
  
        if (!response.ok) {
          // 결제 승인 실패 처리
          console.error("결제 승인 실패:", json);
          // 실패 페이지로 이동 (에러메시지, 코드 포함)
          window.location.href = `/fail?message=${encodeURIComponent(
            json.message
          )}&code=${encodeURIComponent(json.code)}`;
          return;
        }
  
        // 3) 결제 승인 성공 시
        console.log("결제 승인 성공:", json);
        this.serverResponse = json;
      } catch (error) {
        console.error("결제 승인 중 에러:", error);
        // 별도 처리(예: 실패 페이지 이동)
        window.location.href = `/fail?message=${encodeURIComponent(
          error.message
        )}`;
      }
    },
  };
  </script>
  
  <style scoped>
  .success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    text-align: center;
  }
  
  .check-icon {
    width: 64px;
    height: 64px;
    background-color: #0064ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .check-icon svg {
    fill: #fff;
    width: 32px;
    height: 32px;
  }
  </style>  