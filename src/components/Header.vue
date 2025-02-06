<template>
  <header>
    <Logo />
    <div class="nav nav-pills center-nav">
      <div
        v-for="nav in navigations"
        :key="nav.name"
        class="nav-item">
        <RouterLink
          :to="nav.href"
          active-class="active"
          class="nav-link">
          {{ nav.name }}
        </RouterLink>
      </div>
    </div>
    <!-- <div
      class="user"
      @click="toAbout">
      <img
        :src="image"
        :alt="name" />
    </div> -->
    <div class="tabs">
      <!-- 인증 상태에 따라 메뉴 토글 -->
      <template v-if="!isAuthenticated">
        <RouterLink to="/login">
          로그인
        </RouterLink>
      </template>
      <template v-else>
        <a 
          href="#" 
          @click.prevent="handleLogout">
          로그아웃
        </a>
        <RouterLink to="/mypage">
          마이페이지
        </RouterLink>
        <RouterLink to="/cart">
          장바구니
        </RouterLink>
      </template>
    </div>
  </header>
</template>

<script>
import Logo from '~/components/Logo'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Logo
  },
  data() {
    return {
      navigations: [
        {
          name: '소개',
          href: '/'
        },
        {
          name: '판매 프로그램',
          href: '/productList'
        }
      ]
    }
  },
  computed: {
    // 루트 스토어에 있는 인증 상태를 가져옵니다.
    ...mapGetters(['isAuthenticated', 'user'])
  },
  methods: {
    ...mapActions(['logout']),
      handleLogout() {
        this.logout(); // Vuex의 logout 액션 호출 (토큰/사용자 정보 삭제 및 쿠키 삭제)
        // 로그아웃 후 로그인 페이지로 이동합니다.
        this.$router.push('/login');
      }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  position: relative;
  
  .nav {
    // 필요한 nav 스타일
  }
  
  .center-nav {
    margin-left: auto;
    margin-right: auto;
  }
  
  .tabs {
    display: flex;
    flex-direction: row;
  }
  
  .tabs a {
    margin-right: 10px;
    text-decoration: none;
    color: inherit;
  }
  
  .tabs a:last-child {
    margin-right: 0;
  }
  
  @include media-breakpoint-down(sm) {
    .nav {
      display: none;
    }
  }
}
</style>
