<template>
  <div class="container py-5">
    <div class="row">
      <!-- 왼쪽: 이미지 영역 -->
      <div class="col-md-6 d-flex justify-content-center align-items-start">
        <img
          :src="demoImg"
          alt="상품 이미지"
          class="img-fluid rounded" />
      </div>

      <!-- 오른쪽: 상품 정보 영역 -->
      <div class="col-md-6">
        <h1 class="fw-bold mb-3">[네이버 블로그] 공감 댓글 자동화 프로그램</h1>
        <div class="d-flex align-items-center mb-3">
          <!-- <span class="badge bg-danger me-2">SALE</span>
          <span class="badge bg-secondary me-2">BEST</span>
          <span class="badge bg-warning text-dark">HOT</span> -->
        </div>
        <h2 class="text-danger fw-bold mb-4">
          49,000원 <small class="text-muted text-decoration-line-through">249,000원</small>
        </h2>
        <p class="text-muted">
          특정 키워드를 검색 결과로 나오는 최신 블로그 글에 자동으로 접속하고 공감과 댓글을 남겨주는 프로그램입니다.
          서로 이웃추가 프로그램이 서로 이웃 수를 늘려서 블로그 접수를 높이는 기능이라면, 해당 프로그램은
          블로그 글에 유입되는 뷰어(Viewer)들에게 내 블로그나 정보를 노출시키기 위해 사용되는 셀프 마케팅
          프로그램입니다.
        </p>

        <!-- 기간 옵션 -->
        <div class="mb-4">
          <label for="period" class="form-label fw-bold">기간 옵션 *</label>
          <select id="period" class="form-select">
            <option>기간 옵션 (필수)</option>
            <option>1개월</option>
            <option>3개월</option>
            <option>6개월</option>
          </select>
        </div>

        <!-- 버튼 영역 -->
        <div class="d-flex gap-3">
          <button class="btn btn-dark flex-fill primary-color">구매하기</button>
          <button class="btn btn-outline-secondary flex-fill">장바구니</button>
        </div>
      </div>
    </div>
  </div>
  <Comments />
</template>

<script>
import testImg from '~/assets/logo.png';
import Comments from '~/components/Comments.vue';
export default {
  components: {
    Comments
  },
  data() {
    return {
      demoImg: testImg,
    }
  },
  mounted() {
    console.log(this.$route.params.id); // URL에서 전달된 id 값
  }
}
</script>

<style scoped lang="scss">

@import '~/scss/main.scss';
.primary-color {
  background-color: $primary;
  color: white;
  transition: background-color 0.5s;
}
.primary-color:hover {
  background-color: $primary-opacity;
  color: white;
}
</style>