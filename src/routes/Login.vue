<template>
  <div class="container">
    <div class="login-h1">
      <h1>Login</h1>
    </div>
    <div class="btn-container">
      <button 
        @click="kkoLogin"
        class="login-btn kko">
        <img 
          :src="kkoImg"
          alt="카카오 로그인" />
        <span>카카오 시작하기</span>
      </button>
      <button 
        @click="gglLogin" 
        class="login-btn ggl">
        <img 
          :src="gglImg"
          alt="카카오 로그인" />
        <span>구글 시작하기</span>
      </button>
    </div>  
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  methods: {
    gglLogin() {
      window.location.href = "http://localhost:8082/oauth2/authorization/google";
    },
     kkoLogin() {
      window.location.href = "http://localhost:8082/oauth2/authorization/kakao";
    }
  },
 computed: {
   ...mapState('login', [
     'kkoImg',
     'gglImg'
   ])
 }
}
</script>
<style scoped lang="scss">
.container {
  text-align: center;
}
.container .btn-container {
  display: flex; /* 플렉스박스 활성화 */
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  flex-direction: column; /* 세로 정렬 */
}
.login-h1 {
  margin-top: 20px;
  margin-bottom: 100px;
}
.login-btn {
  margin-top: 20px; /* 버튼 간격 */
  display: flex; /* 플렉스 박스로 설정 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 정렬 (텍스트 중앙 정렬) */
  width: 300px; /* 버튼 너비 */
  height: 50px; /* 버튼 높이 */
  background-color: #FEE500; /* 배경색 (카카오 스타일) */
  border: none; /* 테두리 제거 */
  border-radius: 12px; /* 둥근 모서리 */
  font-size: 16px; /* 글자 크기 */
  font-family: Arial, sans-serif; /* 글꼴 */
  cursor: pointer; /* 커서 변경 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 */
  text-decoration-line: none; /* 밑줄 제거 */
  img {
    width: 30px; /* 아이콘 크기 */
    height: 30px; /* 아이콘 크기 */
    margin-right: 10px; /* 텍스트와 간격 */
  }
  span {
    flex-grow: 1; /* 남은 공간 채우기 */
    text-align: center; /* 텍스트 가운데 정렬 */
  }
}
.kko {
    background-color: #FEE500; /* 배경색 (카카오 스타일) */
    color: #3B1E1E; /* 글자 색상 */

  }
.ggl {
    background-color: #FFFFFF; /* 배경색 (구글 스타일) */
    color: #000; /* 글자 색상 */
  }
</style>