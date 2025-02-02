<template>
  <div class="container py-4">
    <!-- 탭 영역 -->
    <div class="d-flex border-bottom mb-4">
      <button 
        class="btn btn-light flex-fill border-bottom-0 fw-bold"
        :class="{ active: activeTab === 'reviews' }"
        @click="activeTab = 'reviews'">
        구매평 ({{ totalReviews }})
      </button>
      <button 
        class="btn btn-light flex-fill border-bottom-0"
        :class="{ active: activeTab === 'details' }"
        @click="activeTab = 'details'">
        상세정보
      </button>
    </div>

    <!-- 리뷰 목록 -->
    <div v-if="activeTab === 'reviews'">
      <div v-if="reviews.length">
        <div v-for="review in reviews" :key="review.id" class="border-top py-3">
          <h5>{{ review.user.username }} <span class="star">⭐</span> <span class="rating">{{ review.rating }} / 5</span></h5>
          <small class="text-muted">{{ new Date(review.createdAt).toLocaleDateString() }}</small>
          <p>{{ review.comment }}</p>
        </div>
      </div>
      <div v-else>
        <p class="text-muted">리뷰가 없습니다.</p>
      </div>

      <!-- 페이징 -->
      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li 
            class="page-item" 
            v-for="page in totalPages" 
            :key="page" 
            :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 상세정보 탭 -->
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
  },
  data() {
    return {
      reviews: [],
      activeTab: 'reviews',
      currentPage: 1,
      totalPages: 0,
      totalReviews: 0,
    };
  },
  watch: {
    productId(newVal) {
      if (newVal) {
        this.fetchReviews(1);  // productId가 변경될 때마다 첫 페이지 로드
      }
    }
  },
  mounted() {
    if (this.productId) {
      this.fetchReviews(1);
    }
  },
  methods: {
    async fetchReviews(page) {
      try {
        const response = await axios.get(`http://localhost:8082/products/${this.productId}/reviews`, {
          params: { page: page - 1, size: 5 }
        });
        this.reviews = response.data.content || [];
        this.totalPages = response.data.totalPages;
        this.totalReviews = response.data.totalElements;
        this.currentPage = page;  // 페이지 상태를 업데이트
      } catch (error) {
        console.error('❌ 리뷰 정보를 불러오는 중 오류 발생:', error);
        this.reviews = [];
      }
    },
    changePage(pageNumber) {
      if (this.currentPage !== pageNumber) {
        this.fetchReviews(pageNumber);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '~/scss/main.scss';

.active {
  border-bottom: 2px solid $primary;
  font-weight: bold;
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

.page-item.active .page-link {
  background-color: $primary;
  color: white;
  border-color: $primary;
}
</style>
