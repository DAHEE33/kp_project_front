<template>
    <div>
      <h2>결제 성공</h2>
      <p>주문번호: {{ orderId }}</p>
      <p>결제 금액: {{ amount }}</p>
      <p>paymentKey: {{ paymentKey }}</p>
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
        result: null,
      };
    },
    created() {
      // URL 쿼리 파라미터에서 값 읽기 (Vue Router 사용 시 this.$route.query)
      this.paymentKey = this.$route.query.paymentKey;
      this.orderId = this.$route.query.orderId;
      this.amount = this.$route.query.amount;
      this.confirmPayment();
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
            // 결제 승인 실패: fail 페이지로 이동 (에러 코드, 메시지 전달)
            this.$router.push({
              path: "/fail",
              query: { code: json.code, message: json.message, orderId: this.orderId },
            });
          } else {
            // 결제 승인 성공 - 백단에서 order 테이블 업데이트 (JPA) 후 필요한 후속처리 실행
            this.result = json;
            console.log("결제 승인 결과:", json);
            // 필요 시 사용자에게 성공 메시지 또는 리다이렉트 처리
          }
        } catch (error) {
          console.error("결제 승인 호출 오류:", error);
        }
      },
    },
  };
  </script>
  