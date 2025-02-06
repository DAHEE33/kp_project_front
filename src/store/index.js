import { createStore } from 'vuex'
import movie from './movie'
import about from './about'
import login from './login'
import sidetab from './sidetab'
import jwtDecode from 'jwt-decode'

// 쿠키에서 특정 이름의 값을 읽어주는 헬퍼 함수
function getCookie(name) {
  const value = `; ${document.cookie}`; // 앞에 세미콜론을 붙여서 찾기 쉽게 만듦
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default createStore({
  // 인증 관련 상태 관리
  state: {
    token: null, // JWT 토큰을 저장합니다.
    user: null,  // jwtDecode를 통해 추출한 사용자 정보를 저장합니다.
  },
  mutations: {
    // 토큰을 Vuex state에 저장
    setToken(state, token) {
      state.token = token;
    },
    // 디코딩된 사용자 정보를 저장
    setUser(state, user) {
      state.user = user;
    },
    // 로그아웃 시 상태 초기화
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
  actions: {
    // 앱 시작 시 쿠키에 저장된 JWT를 읽어 Vuex state에 반영합니다.
    initializeAuth({ commit }) {
      const token = getCookie('loginJwtToken');
      if (token) {
        commit('setToken', token);
        try {
          // 토큰에 포함된 사용자 정보를 jwt-decode로 추출합니다.
          const user = jwtDecode(token);
          commit('setUser', user);
        } catch (err) {
          console.error('토큰 디코딩 오류:', err);
          commit('logout');
        }
      }
    },
    // 로그아웃 액션: Vuex 상태를 초기화하고, 쿠키를 삭제합니다.
    logout({ commit }) {
      commit('logout');
      // 쿠키 삭제: expires를 과거 날짜로 설정
      document.cookie = "loginJwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
  getters: {
    // 로그인 여부: 토큰이 있으면 인증된 것으로 간주합니다.
    isAuthenticated: (state) => !!state.token,
    token: (state) => state.token,
    user: (state) => state.user,
  },
  // 모듈로 분리된 Vuex 스토어를 포함합니다.
  modules: {
    movie,
    about,
    login,
    sidetab
  }
});