<template>
  <div id="app">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="springSecurity">
        <span slot="label">
          <i class="el-icon-s-home"></i>
          SpringSecurity
        </span>
        {{ creatorsAndTime }}
      </el-tab-pane>

      <el-tab-pane label="register">
        <span slot="label">
          <i class="el-icon-s-check"></i>
          Register
        </span>
        {{ creatorsAndTime }}
      </el-tab-pane>

      <el-tab-pane label="profile">
        <span slot="label">
          <i class="el-icon-s-custom"></i>
          Profile
        </span>
        {{ creatorsAndTime }}
      </el-tab-pane>

      <el-tab-pane label="login">
        <span slot="label">
          <i class="el-icon-user-solid"></i>
          Login
        </span>
        {{ creatorsAndTime }}
      </el-tab-pane>

      <el-tab-pane label="logout">
        <span slot="label">
          <i class="el-icon-switch-button"></i>
          Logout
        </span>
        {{ creatorsAndTime }}
      </el-tab-pane>

      <el-tab-pane label="admin">
        <span slot="label">
          <i class="el-icon-s-tools"></i>
          Admin
        </span>
        {{ creatorsAndTime }}
      </el-tab-pane>

    </el-tabs>

    <router-view />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data(){
    return{
      creatorsAndTime: 'Creator of the Spring Security Project: yuan-hao,LEE. Completion Date: 2026-10-18.'
    }
  },
  created(){
    this.$notify.success({
          title: '使用方法',
          message: '點擊功能色塊查看說明',
          showClose: false
        });
  },
  methods: {
    handleClick(tab) {

      if (tab.label === 'springSecurity') {
        this.$notify.success({
          title: '使用方法',
          message: '點擊功能色塊查看說明',
          showClose: false
        });
        this.$router.push('/main')
      }

      if (tab.label === 'login') {
        const token = sessionStorage.getItem('token');

        if (token) {
          this.$message({
          message: '已為登入狀態,請先登出',
          type: 'warning'
          });
          return
        }

        this.$router.push('/login');
      }
      if (tab.label === 'logout') {
        const token = sessionStorage.getItem('token')

        if (!token) {
          this.$message({
          message: '已為登出狀態',
          type: 'warning'
          });
          return

        }

        this.$confirm('確定要登出嗎？', '登出確認', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('http://localhost:8081/user/logout', {
            headers: {
              token: token
            }
          }).then(response => {
            this.$message({
              message: '已完成登出',
              type: 'success'
            })

            // 清除 Session Storage
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('tokenExpireTime')

            // 清除 Axios 全域 Header
            delete axios.defaults.headers.common['token']

            // 登出成功後跳轉
            this.$router.push('/main')
          }).catch(error => {
            console.log(error)
            this.$message.error('登出失敗')
          })
        }).catch(() => {
          // 按下取消，不執行登出
        })

      this.$router.push('/main')
      }
      if (tab.label === 'register') {
        this.$router.push('/register')
      }
      if (tab.label === 'profile') {
          const token = sessionStorage.getItem('token');
          if (!token) {
              this.$message({
              message: '請先登入,再查看個人信息',
              type: 'warning'
              });
              return;
          }
          if (this.$route.path !== '/profile') {

            axios.get('http://localhost:8081/user/basic', {
                headers: {
                    token: sessionStorage.getItem('token')
                }
            }).then(response => {
                // 取得後端回傳的資料
                const user = response.data.data;
              
                // 跳轉到下一個頁面，並傳遞參數
                this.$router.push({
                    name: 'Profile',
                    params: {
                        user: JSON.stringify(user)
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
            
          }
      }
      if (tab.label === 'admin') {
        
        const token = sessionStorage.getItem('token');
          if (!token) {
              this.$message({
              message: '請先登入,再查看管理者頁面',
              type: 'warning'
              })
              return;
          }
          axios.get('http://localhost:8081/admin/userList', {
              headers: {
                  token: sessionStorage.getItem('token')
              }
          }).then(response => {
              if(response.data.code != 200){
                this.$message({
                message: response.data.msg,
                type: 'error'
                })
                return;
              }
            
              // 取得後端回傳的資料
              const userList = response.data.data;
              console.log(response)
              // 跳轉到下一個頁面，並傳遞參數
              this.$router.push({
                  name: 'UserList',
                  params: {
                      userList: JSON.stringify(userList)
                  }
              });
          })
          .catch(error => {
              console.log(error);
          });
      }
    }
  }
}
</script>

<style>
  body {
  margin: 0;
  min-height: 100vh;
  background-image: url('~@/assets/springsecurity.gif');
  background-size: 48% auto;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  }
  #app,
  .el-button,
  .el-input,
  .el-form,
  .el-tabs {
    font-family: "Microsoft JhengHei", Arial, sans-serif !important;
  }

  #app {
    min-height: 100vh;
    background: transparent;
  }
</style>
