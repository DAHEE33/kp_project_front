<template>
  <div class="container order-page mt-4">
    <h2 class="text-center mb-3">
      결제하기
    </h2>
    <!-- 메인 2열 구조 -->
    <div class="row">
      <!-- 왼쪽 컬럼 (상품정보, 주문자정보, 쿠폰) -->
      <div class="col-lg-7">
        <!-- 주문 상품 정보 -->
        <div class="card mb-3">
          <div class="card-header">
            주문 상품 정보
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center">
              <!-- 예시: 이미지 + 텍스트 -->
              <img 
                :src="testImg" 
                alt="테스트 이미지" 
                class="img-thumbnail me-3" 
                style="width: 80px; height: 80px; object-fit: cover;" />
              <div>
                <p class="fw-bold mb-1">
                  구글 스프레드시트 주문 포스기
                </p>
                <p class="mb-0">
                  <span class="text-danger">49,000원</span>
                  <del class="text-muted ms-2">130,000원</del>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 주문자 정보 -->
        <section class="card mb-3">
          <div class="card-header">
            주문자 정보
          </div>
          <div class="card-body">
            <p class="mb-1">
              <strong>이름 : </strong>{{ userInfo.username }}
            </p>
            <p class="mb-1">
              <strong>전화번호 : </strong>{{ userInfo.phone }}
            </p>
            <div class="d-flex justify-content-between">
              <p class="mb-2">
                <strong>이메일 : </strong>{{ userInfo.email }}
              </p>
              <button 
                @click="updateMethod"
                class="btn btn-outline-primary btn-sm">
                수정
              </button>
            </div>
          </div>
        </section>
        <!-- 쿠폰 -->
        <!-- <section class="card mb-3">
          <div class="card-header">
            쿠폰
          </div>
          <div class="card-body d-flex">
            <input 
              type="text" 
              class="form-control me-2" 
              placeholder="쿠폰 코드를 입력해주세요"
            />
            <button class="btn btn-primary">코드확인</button>
          </div>
        </section> -->
      </div>
      <!-- 오른쪽 컬럼 (주문 요약, 결제 수단) -->
      <div class="col-lg-5">
        <!-- 주문 요약 -->
        <section class="card mb-3">
          <div class="card-header">
            주문 요약
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span>상품가격</span>
              <strong>130,000원</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>상품 할인금액</span>
              <strong>-81,000원</strong>
            </div>
            <div class="d-flex justify-content-between border-top pt-2">
              <span>총 주문금액</span>
              <strong class="text-danger">49,000원</strong>
            </div>
          </div>
        </section>
        <!-- 결제 수단 -->
        <section class="card">
          <div class="card-header">
            결제 수단
          </div>
          <div class="card-body">
            <div class="form-check mb-2">
              <input 
                class="form-check-input" 
                type="radio" 
                name="payment" 
                id="payBank"
                value="payBank" 
                v-model="selectedPayment" />
              <label 
                class="form-check-label" 
                for="payBank">
                무통장입금
              </label>
            </div>
            <div class="form-check mb-2">
              <input 
                class="form-check-input" 
                type="radio" 
                name="payment" 
                id="paykko"
                value="paykko" 
                v-model="selectedPayment" />
              <label 
                class="form-check-label" 
                for="paykko">
                카카오페이
              </label>
            </div>
            <div class="form-check mb-3">
              <input 
                class="form-check-input" 
                type="radio" 
                name="payment" 
                id="paytoss"
                value="paytoss" 
                v-model="selectedPayment" />
              <label 
                class="form-check-label" 
                for="paytoss">
                토스페이
              </label>
            </div>
            <div v-if="selectedPayment === 'payBank'">
              <select class="form-select mb-2">
                <option>카카오뱅크 333333131313 박주영</option>
              </select>
              <input 
                type="text" 
                class="form-control mb-2" 
                placeholder="입금자명 (미입력시 주문자명)" />
              <p class="text-muted mb-0">
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
            <input 
              class="form-check-input" 
              type="checkbox" 
              v-model="checkAll"
              @change="toggleAllCheckboxes"
              id="checkAll" />
            <label 
              class="form-check-label" 
              for="checkAll">
              전체 동의
            </label>
          </div>
          <!-- 구매조건 동의 등 세부 체크박스도 비슷하게 -->
          <div class="form-check ms-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              v-model="checkTerms"
              @change="updateCheckAll"
              id="checkTerms" />
            <label 
              class="form-check-label" 
              for="checkTerms">
              구매조건 동의
            </label>
          </div>
          <div class="form-check ms-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              v-model="checkPrivacy"
              @change="updateCheckAll"
              id="checkPrivacy" />
            <label 
              class="form-check-label" 
              for="checkPrivacy">
              개인정보 처리방침 동의
            </label>
          </div>
        </div>
        <!-- 결제하기 버튼 -->
        <button class="btn btn-primary btn-lg text-white">
          결제하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import logo from '~/assets/logo.png';
export default {
  data() {
    return {
      testImg : logo,
      selectedPayment: 'payBank',
      checkAll: false,
      checkTerms: false,
      checkPrivacy: false,
      userInfo:
        {
          username: '박주영',
          phone: '010-4224-4840',
          email: 'aijyp484456@gmail.com'
        }
    }
  },
  methods: {
    toggleAllCheckboxes() {
      const newValue = this.checkAll;
      this.checkTerms = newValue;
      this.checkPrivacy = newValue;
    },
    updateCheckAll() {
      this.checkAll = this.checkTerms && this.checkPrivacy;
    },
    updateMethod() {
      console.log('수정 버튼 클릭');
    }
  }
}
</script>

<style scoped lang="scss">
.order-page {
}
</style>
