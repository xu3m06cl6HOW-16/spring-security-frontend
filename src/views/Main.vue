<template>
  
  <div class="main-container">
    <img
    src="@/assets/springsecurity.png"
    alt="Spring Security"
    class="header-logo"
    v-show="show"
  />
    <div class="function-container">
      <transition name="el-fade-in-linear">
        <div
          v-show="show"
          class="springSecurity-box"
          @click="springSecurityVisible = true"
        >
          SpringSecurity
        </div>
      </transition>

      <transition name="el-fade-in-linear">
        <div
          v-show="show"
          class="register-box"
          @click="registerVisible = true"
        >
          Register
        </div>
      </transition>

      <transition name="el-fade-in-linear">
        <div
          v-show="show"
          class="profile-box"
          @click="profileVisible = true"
        >
          Profile
        </div>
      </transition>

      <transition name="el-fade-in-linear">
        <div
          v-show="show"
          class="login-box"
          @click="loginVisible = true"
        >
          Login
        </div>
      </transition>

      <transition name="el-fade-in-linear">
        <div
          v-show="show"
          class="logout-box"
          @click="logoutVisible = true"
        >
          Logout
        </div>
      </transition>

      <transition name="el-fade-in-linear">
        <div
          v-show="show"
          class="admin-box"
          @click="adminVisible = true"
        >
          Admin
        </div>
      </transition>
    </div>

  <!-- springSecurity 燈箱 -->
  <el-dialog title="springSecurity" :visible.sync="springSecurityVisible" width="50%">
    <span>springSecurity : 主要畫面,每個功能框點擊即可看到各功能使用說明</span>
  </el-dialog>

  <!-- register 燈箱 -->
  <el-dialog title="register" :visible.sync="registerVisible" width="50%">
    <span>register : 提供用戶註冊帳號密碼,不須登入即可使用</span>
  </el-dialog>

  <!-- profile 燈箱 -->
  <el-dialog title="profile" :visible.sync="profileVisible" width="50%">
    <span>profile : 查看登入者個人資訊,並可修改資料與權限,須登入才可使用</span>
  </el-dialog>

  <!-- login 燈箱 -->
  <el-dialog title="login" :visible.sync="loginVisible" width="50%">
    <span>login : 提供用戶登入帳號使用,若已登入,無法重複登錄</span>
  </el-dialog>

  <!-- logout 燈箱 -->
  <el-dialog title="logout" :visible.sync="logoutVisible" width="50%">
    <span>logout : 提供用戶登出帳號使用,若未登入,無法使用登出</span>
  </el-dialog>

  <!-- Admin 燈箱 -->
  <el-dialog title="Admin" :visible.sync="adminVisible" width="50%">
    <span>admin : 對所有基本使用者的資料查看或停用帳號,需擁有管理員權限才可操控</span>
  </el-dialog>
  </div>
</template>

<script>
  
export default {
  name: 'Main',
  
  data() {
  return {
    show: false,

    springSecurityVisible: false,
    registerVisible: false,
    profileVisible: false,
    loginVisible: false,
    logoutVisible: false,
    adminVisible: false,
    };
  },

  mounted() {
    setTimeout(() => {
      this.show = true;
    }, 1000);
  }
}

</script>

<style>
.header-logo {
    width: 250px;
    height: 250px;
    object-fit: contain;
  }
  .springSecurity-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #5790c9;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
  }
  .register-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #639e46;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
  }
  .profile-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #eeac49;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
  }
  .login-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #e95252;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
  }
  .logout-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #909399;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
  }
  .admin-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #0c0c0c;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
  }
  .main-container {
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: center;     /* 垂直置中 */
  gap: 30px;

  min-height: 100vh;
  width: 100%;
}

.function-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;         /* 畫面太窄時自動換行 */
  gap: 20px;
}
</style>