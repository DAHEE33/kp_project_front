<template>
  <div class="container py-4">
    <!-- ✅ 탭 영역 -->
    <div class="d-flex border-bottom mb-4 w-100">
      <button 
        class="btn btn-light flex-fill border-bottom-0 fw-bold tab-button"
        :class="{ active: activeTab === 'reviews' }"
        @click="activeTab = 'reviews'">
        구매평 ({{ totalReviews }})
      </button>
      <button 
        class="btn btn-light flex-fill border-bottom-0 tab-button"
        :class="{ active: activeTab === 'details' }"
        @click="activeTab = 'details'">
        상세정보
      </button>
    </div>

    <!-- ✅ 드롭다운 & 리뷰 작성하기 버튼 -->
    <div class="d-flex justify-content-end align-items-center gap-2 mb-3">
      <select v-model="sortOption" @change="fetchReviews(1)" class="form-select sort-dropdown">
        <option value="latest">최신순</option>
        <option value="rating">별점순</option>
        <option value="likes">추천순</option>
      </select>

      <!-- ✅ 구매자 & 리뷰 미작성자만 버튼 표시 -->
      <button 
        v-if="canWriteReview" 
        class="btn btn-primary" 
        @click="writeReview">
        리뷰 작성하기
      </button>
    </div>

    <!-- ✅ 리뷰 목록 -->
    <div v-if="activeTab === 'reviews'">
      <div v-if="reviews.length">
        <div v-for="review in reviews" :key="review.id" class="border-top py-3 d-flex justify-content-between align-items-center">
          <div>
            <h5>{{ review.user?.username || '알 수 없는 사용자' }} 
              <span class="star">⭐</span> 
              <span class="rating">{{ review.rating }} / 5</span>
            </h5>
            <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
            <p>{{ review.comment }}</p>
          </div>

          <!-- ✅ 추천하기 (좋아요) 버튼 -->
          <div class="like-section">
            <button 
              :class="['like-btn', { liked: review.likedByUser }]" 
              @click="toggleLike(review)">
              ❤️
            </button>
            <span>{{ review.likes }}</span> <!-- 추천 수 표시 -->
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
              :class="{ active: currentPage === page }">
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
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
import axios from 'axios';

export default {
  props: {
    productId: {
      type: Number,
      required: true
    }
    ,
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      activeTab: 'reviews',
      currentPage: 1,
      totalPages: 0,
      totalReviews: 0,
      currentPageGroup: 1,
      pagesPerGroup: 5,
      sortOption: 'latest',   
      canWriteReview: false 
    };
  },
  computed: {
    totalPageGroups() {
      return Math.ceil(this.totalPages / this.pagesPerGroup);
    },
    visiblePages() {
      const start = (this.currentPageGroup - 1) * this.pagesPerGroup + 1;
      return Array.from({ length: Math.min(this.pagesPerGroup, this.totalPages - start + 1) }, (_, i) => start + i);
    }
  },
  mounted() {
    console.log("✅ productId:", this.productId);
    console.log("✅ userId:", this.userId);

    
    this.fetchReviews(1);
    this.checkPurchaseStatus();  
  },
  methods: {
    // ✅ 리뷰 목록 불러오기
    async fetchReviews(page) {
      try {
<<<<<<< Updated upstream
        const response = await axios.get(`http://localhost:8082/pass/products/${this.productId}/reviews`, {
          params: { page: page - 1, size: 5 }
=======
        const response = await axios.get(`http://localhost:8082/products/${this.productId}/reviews`, {
          params: { page: page - 1, size: 5, sort: this.sortOption}
>>>>>>> Stashed changes
        });

        // ✅ 사용자가 이미 추천한 리뷰 체크
        this.reviews = response.data.content.map(review => ({
          ...review,
          likedByUser: review.likedUsers?.includes(this.userId) || false
        }));

        this.totalPages = response.data.totalPages;
        this.totalReviews = response.data.totalElements;
        this.currentPage = page;
        this.currentPageGroup = Math.ceil(page / this.pagesPerGroup);
      } catch (error) {
        console.error('❌ 리뷰 불러오기 오류:', error);
      }
    },

    // ✅ 구매 여부 확인
    async checkPurchaseStatus() {
      try {
        const response = await axios.get(`http://localhost:8082/reviews/${this.productId}/check-purchase`, {
          params: { userId: this.userId }
        });
        this.canWriteReview = response.data; 
      } catch (error) {
        console.error('❌ 구매 여부 확인 오류:', error);
        this.canWriteReview = false; 
      }
    },

    // ✅ 추천하기(좋아요) 토글
    async toggleLike(review) {
      console.log("✅ 좋아요 요청:", { reviewId: review.id, userId: this.userId });
      if (review.likedByUser) {
        alert('이미 추천하셨습니다.');
        return;
      }

      try {
        await axios.post(`http://localhost:8082/reviews/${review.id}/like`, { userId: this.userId });
        review.likes++;              
        review.likedByUser = true;   
      } catch (error) {
        console.error('❌ 추천 실패:', error);
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

    writeReview() {
      this.$router.push(`/products/${this.productId}/review`);
    }
  }
};
</script>

<style scoped lang="scss">
@import '~/scss/main.scss';

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
