<template>
  <div class="OrderInquiry-page my-4">
    <div 
      v-for="(payment, idx) in payments" 
      :key="idx"
      class="card mb-3 p-3"
      style="border-radius: 12px;">
      <!-- 상단 영역 (결제완료 텍스트) -->
      <div class="d-flex align-items-center">
        <strong class="fs-5">결제완료</strong>
        <!-- 닫기(X) 버튼은 제거했습니다 -->
      </div>

      <!-- 메인 정보 영역 -->
      <div class="d-flex align-items-start mt-3">
        <!-- 왼쪽 아이콘/이미지 -->
        <div class="me-3">
          <!-- 이미지 경로가 필요하다면 payment.imageUrl 따위를 사용 -->
          <img 
            :src="payment.imageUrl" 
            alt="상품 아이콘" 
            class="img-thumbnail me-3" 
            style="width: 80px; height: 80px; object-fit: cover;" />
        </div>
        <!-- 텍스트 정보 -->
        <div>
          <p class="text-muted mb-1">{{ payment.dateTime }} 결제</p>
          <h5 class="mb-1">{{ payment.title }}</h5>
          <p class="mb-1">{{ payment.price }}원</p>
          <a href="#" class="text-success">결제상세 &gt;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import testImg from '~/assets/logo.png';
export default {
  name: "PaymentList",
  data() {
    return {
      payments: [
        {
          dateTime: "1.23 14:25",
          title: "스타벅스 사이렌오더",
          price: 4500,
          imageUrl: testImg
        },
        {
          dateTime: "1.19 14:53",
          title: "i쿠키 10개",
          price: 1200,
          imageUrl: testImg
        },
        {
          dateTime: "1.15 16:04",
          title: "(HOT)아메리카노 1개",
          price: 1500,
          imageUrl: testImg
        }
      ]
    };
  }
};
</script>

<style scoped>

</style>
