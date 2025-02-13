<template>
  <div class="container py-4">
    <!-- ✅ 탭 영역 -->
    <div class="d-flex border-bottom mb-4 w-100">
      <button
        class="btn btn-light flex-fill border-bottom-0 fw-bold tab-button"
        :class="{ active: activeTab === 'reviews' }"
        @click="activeTab = 'reviews'"
      >
        구매평 ({{ totalReviews }})
      </button>
      <button
        class="btn btn-light flex-fill border-bottom-0 tab-button"
        :class="{ active: activeTab === 'details' }"
        @click="activeTab = 'details'"
      >
        상세정보
      </button>
    </div>

    <!-- ✅ 드롭다운 & 리뷰 작성하기 버튼 -->
    <div class="d-flex justify-content-end align-items-center gap-2 mb-3">
      <select
        v-model="sortOption"
        @change="fetchReviews(1)"
        class="form-select sort-dropdown"
      >
        <option value="latest">최신순</option>
        <option value="rating">별점순</option>
        <option value="likes">추천순</option>
      </select>

      <!-- ✅ 구매자 & 리뷰 미작성자만 버튼 표시 -->
      <button
        v-if="isLoggedIn && canWriteReview"
        class="btn btn-primary"
        @click="showReviewForm = true"
      >
        리뷰 작성하기
      </button>
    </div>

    <!-- ✅ 리뷰 작성 폼 (드롭다운에서 리뷰 작성하기 선택 시 표시) -->
    <transition name="slide-fade">
      <div v-if="showReviewForm" class="review-form border p-3 mb-3">
        <h5>리뷰 작성</h5>
        <div class="mb-2">
          <label>별점:</label>
          <select v-model="newReview.rating" class="form-select">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}점</option>
          </select>
        </div>
        <div class="mb-2">
          <label>리뷰 내용:</label>
          <textarea v-model="newReview.comment" class="form-control" rows="3"></textarea>
        </div>
        <button class="btn btn-success" @click="submitReview">작성 완료</button>
      </div>
    </transition>

    <!-- ✅ 리뷰 목록 -->
    <div v-if="activeTab === 'reviews'">
      <div v-if="reviews.length">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="border-top py-3 d-flex justify-content-between align-items-center"
        >
          <div>
            <h5>
              {{ review.user?.username || "알 수 없는 사용자" }}
              <span class="star">⭐</span>
              <span class="rating">{{ review.rating }} / 5</span>
            </h5>
            <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
            <p>{{ review.comment }}</p>
          </div>

          <!-- ✅ 좋아요 버튼 비활성화 -->
          <div class="like-section">
            <button
              :class="['like-btn', { liked: review.likedByUser }]"
              @click="toggleLike(review)"
            >
              ❤️
            </button>

            <span>{{ review.likes }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-muted">리뷰가 없습니다.</p>
      </div>

      <!-- ✅ 페이지네이션 -->
      <div class="d-flex justify-content-center align-items-center mt-4">
        <nav v-if="totalPages > 1" class="mx-auto">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" v-if="currentPageGroup > 1">
              <button class="page-link" @click="prevPageGroup">&lt;</button>
            </li>
            <li
              class="page-item"
              v-for="page in visiblePages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>
            <li class="page-item" v-if="currentPageGroup < totalPageGroups">
              <button class="page-link" @click="nextPageGroup">&gt;</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- ✅ 상세정보 탭 -->
    <div v-else>
      <p>이곳에 상세 정보를 입력하세요.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    productId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      reviews: [],
      activeTab: "reviews",
      currentPage: 1,
      totalPages: 0,
      totalReviews: 0,
      currentPageGroup: 1,
      pagesPerGroup: 5,
      sortOption: "latest",
      canWriteReview: false,
      showReviewForm: false, // ✅ 폼 표시 여부
      isLoggedIn: false, // ✅ 로그인 여부 추가
      newReview: {
        rating: 5,
        comment: ""
      }
    };
  },

  computed: {
    totalPageGroups() {
      return Math.ceil(this.totalPages / this.pagesPerGroup);
    },
    visiblePages() {
      const start = (this.currentPageGroup - 1) * this.pagesPerGroup + 1;
      return Array.from(
        { length: Math.min(this.pagesPerGroup, this.totalPages - start + 1) },
        (_, i) => start + i
      );
    },
  },
  mounted() {
  console.log("✅ Vue mounted 실행됨, productId:", this.productId);

  this.fetchReviews(1);

  this.checkLoginStatus().then(() => {
    console.log("✅ 로그인 상태 확인 완료, checkPurchaseStatus 실행");
    this.checkPurchaseStatus();
  });
}
,
  methods: {
    // ✅ 리뷰 목록 불러오기
    async fetchReviews(page) {
      try {
        const response = await axios.get(
          `http://localhost:8082/pass/products/${this.productId}/reviews`,
          {
            params: { page: page - 1, size: 5, sort: this.sortOption },
          }
        );

        // ✅ 사용자가 이미 추천한 리뷰 체크
        this.reviews = response.data.content.map((review) => ({
          ...review,
          likedByUser: review.likedUsers?.includes(this.userId) || false,
        }));

        this.totalPages = response.data.totalPages;
        this.totalReviews = response.data.totalElements;
        this.currentPage = page;
        this.currentPageGroup = Math.ceil(page / this.pagesPerGroup);
      } catch (error) {
        console.error("❌ 리뷰 불러오기 오류:", error);
      }
    },

    async checkLoginStatus() {
      try {
        console.log("✅ 로그인 상태 확인 API 호출");

        const response = await axios.get("http://localhost:8082/user/info", {
          withCredentials: true, // 🔹 JWT 쿠키 포함 필수
        });

        console.log("✅ API 응답:", response.data);

        if (response.status === 200 && response.data?.loggedIn) {
          this.isLoggedIn = true;
          this.userId = response.data.userId;
          console.log("✅ 로그인 상태: true, userId:", this.userId);
        } else {
          this.isLoggedIn = false;
          this.userId = null;
          console.log("❌ 로그인 상태: false");
        }
      } catch (error) {
        console.error("❌ 로그인 상태 확인 실패:", error);
        this.isLoggedIn = false;
        this.userId = null;
      }
    },

    // ✅ 구매 여부 확인
    async checkPurchaseStatus() {
  if (!this.isLoggedIn) {
    this.canWriteReview = false;
    console.log("❌ 사용자가 로그인하지 않음 → 리뷰 작성 버튼 숨김");
    return;
  }

  console.log(`✅ 구매 여부 확인 API 호출: productId=${this.productId}`);
  
  try {
    const response = await axios.get(
      `http://localhost:8082/pass/reviews/${this.productId}/check-purchase`,
      { withCredentials: true }
    );

    this.canWriteReview = response.data;
    console.log(`✅ API 응답: ${response.data} → canWriteReview=${this.canWriteReview}`);
  } catch (error) {
    console.error("❌ 구매 여부 확인 오류:", error);
    this.canWriteReview = false;
  }
}
,
    // ✅ 추천하기(좋아요) 토글
    async toggleLike(review) {
      await this.checkLoginStatus();

      console.log("✅ 좋아요 버튼 클릭됨, 로그인 상태:", this.isLoggedIn);

      if (!this.isLoggedIn) {
        alert("회원만 가능합니다.");
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8082/pass/reviews/${review.id}/like`,
          {},
          { withCredentials: true }
        );

        const message = response.data || "추천 상태가 변경되었습니다.";
        alert(message); // 🔹 응답이 undefined이면 기본 메시지 출력

        if (response.data === "추천이 완료되었습니다.") {
          review.likes++;
          review.likedByUser = true;
        }
      } catch (error) {
        console.error("❌ 추천 실패:", error);
        alert("추천을 처리하는 중 오류가 발생했습니다.");
      }
    },

     async submitReview() {
      if (!this.isLoggedIn || !this.canWriteReview) {
        alert("리뷰를 작성할 수 없습니다.");
        return;
      }
      try {
        const response = await axios.post("http://localhost:8082/pass/reviews/add", {
          productId: this.productId,
          rating: this.newReview.rating,
          comment: this.newReview.comment
        }, { withCredentials: true });

        if (response.status === 200) {
          alert("리뷰가 성공적으로 등록되었습니다.");
          this.showReviewForm = false;
           await this.fetchReviews(1);
          await this.checkPurchaseStatus();
        }
      } catch (error) {
        console.error("리뷰 작성 실패:", error);
        alert("리뷰 작성 중 오류가 발생했습니다.");
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    },

    changePage(pageNumber) {
      if (this.currentPage !== pageNumber) {
        this.fetchReviews(pageNumber);
      }
    },

    nextPageGroup() {
      if (this.currentPageGroup < this.totalPageGroups) {
        this.currentPageGroup++;
        this.fetchReviews((this.currentPageGroup - 1) * this.pagesPerGroup + 1);
      }
    },

    prevPageGroup() {
      if (this.currentPageGroup > 1) {
        this.currentPageGroup--;
        this.fetchReviews((this.currentPageGroup - 1) * this.pagesPerGroup + 1);
      }
    },

  },
};
</script>

<style scoped lang="scss">
@import "~/scss/main.scss";

/* ✅ 탭 스타일 */
.tab-button {
  width: 50%;
  text-align: center;
  padding: 10px;
}

.active {
  border-bottom: 2px solid $primary;
  font-weight: bold;
}

/* ✅ 별점 표시 */
.star {
  color: gold;
  font-size: 0.85rem;
  margin-right: 4px;
}

.rating {
  font-size: 0.85rem;
  color: black;
}

.text-muted {
  font-size: 0.85rem;
  color: #6c757d;
}

/* ✅ 좋아요(추천하기) 버튼 스타일 */
.like-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #ccc; /* 기본 회색 */
  transition: color 0.3s ease;
}

.like-btn:hover {
  color: red; /* 마우스 오버 시 빨간색 */
}

.like-btn.liked {
  color: red; /* 이미 추천한 경우 빨간색 유지 */
}

/* ✅ 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.page-item.active .page-link {
  background-color: $primary;
  color: white;
  border-color: $primary;
}

/* ✅ 버튼 스타일 */
.btn-primary {
  background-color: $primary;
  color: white !important;
  border: none;
  padding: 6px 12px;
}

/* ✅ 드롭다운 스타일 */
.sort-dropdown {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  appearance: none;
}
</style>
