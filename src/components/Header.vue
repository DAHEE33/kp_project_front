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
      <RouterLink 
        :to="'/login'">
        로그인
      </RouterLink>
      <RouterLink 
        :to="'/mypage'">
        마이페이지
      </RouterLink>
      <RouterLink 
        :to="'/cart'">
        장바구니
      </RouterLink>
    </div>
  </header>
</template>

<script>
import Logo from '~/components/Logo'
import { mapState } from 'vuex'
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
    ...mapState('about', [
      'image',
      'name'
    ])
  },
  methods: {

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
  .logo {
    margin-right: 40px;
  }
  .user {
    width: 40px;
    height: 40px;
    padding: 6px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: $gray-200;
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 40px;
    margin: auto;
    transition: .4s;
    &:hover {
      background-color: darken($gray-200, 10%);
    }
    img {
      width: 100%;
    }
  }
  .tabs {
  display: flex;
  flex-direction: row;
  }
  .tabs a {
  display: block;
  text-decoration: none;
  color: inherit;
  // margin-bottom: 5px; /* 탭 사이의 간격 조절 */
  // padding: 5px;
  }
  .tabs a {
    margin-right: 10px;
  }
  .tabs a:last-child {
  margin-right: 0; /* 탭 사이의 간격 조절 */
  }
  @include media-breakpoint-down(sm) {
    .nav {
      display: none;
    }
  }
  @include media-breakpoint-up(sm) { //가운데 정렬
    .center-nav {
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
