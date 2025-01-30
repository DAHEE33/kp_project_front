<template>
  <footer>
    <Logo />
    <div>
      <a
        href="https://github.com/ParkYoungWoong"
        target="_blank">
        (c){{ new Date().getFullYear() }} {{ name }}
      </a>
    </div>
		<a 
      type="button" 
      class="btn _5a2f0991857f7" 
      href="https://www.instagram.com/systembucket/" 
      style="" 
      target="_blank">
      <i class="fa fa-instagram"></i>
      <span class="sr-only">SNS 바로가기</span>
    </a>
		<p>상호명 : 보이손</p>
    <p>사업자 번호 : 000-00-00000</p>
    <p>사업장 주소지 : 경기도 남양주시 화도읍 창현리 xxx</p>
  </footer>
</template>
<script>
import Logo from '~/components/Logo'

export default {
  components: {
    Logo
  },
  computed: {
    name() {
      return this.$store.state.about.name
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  padding: 70px 0;
  text-align: center;
  opacity: .3;
  background-color: #ffffff;
  color: #404040;
  color: rgba(64,64,64,1);
  font-size: 12px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  .logo {
    display: block;
    margin-bottom: 4px;
  }
}

</style>
