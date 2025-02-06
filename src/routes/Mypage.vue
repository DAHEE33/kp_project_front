<template>
  <div class="container">
    <!-- 사이드탭 -->
    <div class="sidetab">
      <ul>
        <li @click="selectedTab = 'orderHistory'" :class="{ active: selectedTab === 'orderHistory' }">{{ orderHistory }}</li>
        <li @click="openEditPopup" :class="{ active: selectedTab === 'infomation' }">{{ infomation }}</li>
        <li @click="openPopup" :class="{ active: selectedTab === 'getout' }">{{ getout }}</li>
      </ul>
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="content">
      <div v-if="selectedTab === 'orderHistory'">
        <h2>Order History Content</h2>
        <p>주문 내역에 대한 내용이 여기에 표시됩니다.</p>
      </div>

      <!-- 회원정보 수정 팝업 -->
      <div v-if="isEditPopupVisible" class="popup-overlay" @click="closeEditPopup">
        <div class="popup-content info" @click.stop>
          <h4>회원정보 수정</h4>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">이름 :</label>
              <input type="text" id="name" v-model="userInfo.username" placeholder="이름을 입력하세요" />
            </div>
            <div class="form-group">
              <label for="email">이메일 :</label>
              <input type="email" id="email" v-model="userInfo.email" disabled />
            </div>
            <div class="form-group">
              <label for="phone">휴대폰번호 :</label>
              <input type="text" id="phone" v-model="userInfo.phoneNumber" placeholder="휴대폰번호를 입력하세요" />
            </div>
            <!-- <div class="form-group">
              <label for="address">주소 :</label>
              <input type="text" id="address" v-model="userInfo.address" placeholder="주소를 입력하세요" />
            </div> -->
            <div class="popup-actions">
              <button type="submit" @click="updateInfo" class="save-btn">저장</button>
              <button type="button" @click="closeEditPopup" class="cancel-btn">닫기</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 탈퇴 팝업 -->
      <div v-if="isPopupVisible" class="popup-overlay" @click="closePopup">
        <div class="popup-content" @click.stop>
          <h4>정말 탈퇴하시겠습니까?</h4>
          <p>가입된 회원정보가 모두 삭제됩니다. 작성하신 게시물은 삭제되지 않습니다. 회원 탈퇴를 진행하시겠습니까?</p>
          <div class="popup-actions">
            <button @click="confirmDelete" class="delete-btn">탈퇴하기</button>
            <button @click="closePopup" class="cancel-btn">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios'
export default {
  data() {
    return {
      selectedTab: 'orderHistory', // 기본 선택된 탭
      userInfo: {}, // 회원 정보
      isPopupVisible: false, // 회원탈퇴 팝업 상태
      isEditPopupVisible: false // 회원정보 수정 팝업 상태
    };
  },
  computed: {
    ...mapState('sidetab', [
      'orderHistory',
      'infomation',
      'getout'
    ])
  },
  methods: {
    getCurrUser() {
      axios.get('http://localhost:8082/user/info', { withCredentials: true })
        .then(response => {
          this.userInfo = response.data;
        })
        .catch(error => {
          console.error("API 호출 에러:", error);
        });
    },
    updateInfo() {
      
    },
    openEditPopup() {
      // 회원정보 수정 팝업 열기
      this.isEditPopupVisible = true;
    },
    closeEditPopup() {
      // 회원정보 수정 팝업 닫기
      this.isEditPopupVisible = false;
    },
    submitForm() {
        axios.post('http://localhost:8082/user/update', this.userInfo, { withCredentials: true })
        .then(response => {
          console.log("회원 정보 수정 결과:", response.data);
          alert("회원 정보가 수정되었습니다.");
          this.isEditPopupVisible = false; // 팝업 닫기
          
        })
        .catch(error => {
          alert("회원 정보 수정에 시도하던 중 오류가 발생했습니다.");
          console.error("API 호출 에러:", error);
        });
    },
    openPopup() {
      // 탈퇴 팝업 열기
      this.isPopupVisible = true;
    },
    closePopup() {
      // 탈퇴 팝업 닫기
      this.isPopupVisible = false;
    },
    ...mapActions(['logout']),
    confirmDelete() {
      axios.get('http://localhost:8082/user/delete', { withCredentials: true })
        .then(response => {
          console.log("회원 정보 수정 결과:", response.data);
          alert("회원 탈퇴가 완료되었습니다.");
          this.isPopupVisible = false; // 팝업 닫기

        
          // Vuex의 logout 액션 호출 (토큰/사용자 정보 삭제 및 쿠키 삭제)
          this.logout(); 
          // 로그아웃 후 로그인 페이지로 이동합니다.
          this.$router.push('/login');
        })
        .catch(error => {
          alert("회원 탈퇴 중 오류가 발생하였습니다.");
          console.error("API 호출 에러:", error);
        });
      
      
    }
  },
  mounted() {
    this.getCurrUser();
  }
}
</script>

<style scoped lang="scss">
@import '~/scss/main.scss';
.container {
  display: flex;
  background-color: #f0f0f0;
}

.sidetab {
  width: 200px;
  height: 100%;
  background-color: #f0f0f0;
  padding-top: 20px;
}

.sidetab ul {
  list-style: none;
  padding: 0;
}

.sidetab li {
  padding: 10px;
  cursor: pointer;
}

.sidetab li.active {
  background-color: #ddd;
}

.content {
  padding: 20px;
  flex-grow: 1;
  text-align: center;
  min-height: 70vh;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  text-align: left;
  font-size: 13px;
}

input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: $primary;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: $primary;
}

/* 팝업 오버레이 스타일 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 반어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}
.popup-content .info {
  margin: 20px;
  width: 600px;
}
.popup-actions {
  margin-top: 20px;
}

.popup-actions button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 0 10px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.delete-btn {
  background-color: #DF6464;
  color: white;
}

.delete-btn:hover {
  background-color: $primary;
}

.cancel-btn {
  background-color: #ccc;
  color: black;
}

.cancel-btn:hover {
  background-color: #999;
}
</style>
