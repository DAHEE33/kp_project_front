<template>
  <div class="container py-4">
    <!-- 탭 영역 -->
    <div class="d-flex border-bottom mb-4">
      <button class="btn btn-light flex-fill border-bottom-0 fw-bold">구매평 (15)</button>
      <button class="btn btn-light flex-fill border-bottom-0">상세정보</button>
    </div>

    <!-- 구매평 작성 버튼 -->
    <div class="d-flex justify-content-end align-items-center mb-3">
      <div>
        <button class="btn btn-outline-secondary btn-sm me-2">포토 구매평 보기</button>
        <select class="form-select form-select-sm d-inline-block w-auto">
          <option>전체 평점 보기</option>
          <option>5점</option>
          <option>4점</option>
          <option>3점</option>
          <option>2점</option>
          <option>1점</option>
        </select>
      </div>
    </div>

    <!-- 리뷰 리스트 -->
    <div class="review-list">
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="border-top py-3">
        <div class="d-flex align-items-start">
          <!-- 별점 -->
          <div class="text-warning me-3">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </div>
          <!-- 리뷰 내용 -->
          <div class="flex-grow-1">
            <p class="mb-1">{{ review.content }}</p>
            <small class="text-muted">{{ review.author }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <nav class="mt-4 ">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" href="#">1</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">2</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">3</a>
        </li>
      </ul>
      <div class="d-flex justify-content-end">
        <button class="btn primary-color">구매평 작성</button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reviews: [
        {
          content: "유튜브인가 블로그 통해서 찾아오게 되었습니다. 좋은 프로그램 너무 많은 것 같...",
          author: "동기동기당",
        },
        {
          content: "맨날 손으로 직접작성하다가 노이로즈걸려서 구매했어요 ㅋㅋㅋ 이정도 가격이면...",
          author: "leeraLii",
        },
        {
          content: "옵션 선택하는게 나은 듯 하네요! 3일은 짧더라구여 그래두 효과는 최고!!",
          author: "바그다11",
        },
        {
          content: "강추드립니다!! 다른데 3분의 1가격도 안되요ㅋㅋㅋ",
          author: "민고더블로가22",
        },
        {
          content: "이정도면 그냥 밀쳐야 본전 가격 + 퀄리티네요?? 너무 좋은데여? ㅋㅋㅋ",
          author: "비프에이사",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
@import '~/scss/main.scss';
.review-list .bi-star-fill {
  font-size: 1rem;
}
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
