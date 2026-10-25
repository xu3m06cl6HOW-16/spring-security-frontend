<template>
  <div class="page-wrapper">
    <h3>Login</h3>
    <hr>
    <div class="login-container">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @keyup.enter.native="submitForm('ruleForm')">
        <el-form-item label="用戶名" prop="userName">
          <el-input v-model="ruleForm.userName"
          @input="ruleForm.userName = ruleForm.userName.replace(/[^a-zA-Z0-9]/g, '')">
          </el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('帳號不能為空'));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入密碼'));
      }
      callback();
    };
    return {
      ruleForm: {
        pass: '',
        userName: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        userName: [
          { validator: checkUserName, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          axios.post('http://localhost:8081/user/login', {
            userName: this.ruleForm.userName,
            password: this.ruleForm.pass
          })
          .then(response => {
            // 後端登入成功
            console.log(response.data)
            // 1. 判斷後端 return 的 code 是否為 200
            if (response.data.code === 200) {
              // 2. 取得 token
              const token = response.data.data.token

              // 3. 將 token 存入 localStorage (或是 sessionStorage)
              sessionStorage.setItem('token', token);
              const expireTime = Date.now() + 60 * 60 * 1000;
              sessionStorage.setItem('tokenExpireTime', expireTime);
              // 4. (可選) 設置全域 Axios 預設 Header (依後端要求的格式，通常是 Bearer 或直接放 token)
              axios.defaults.headers.common['token'] = token

              this.$message({
                message: '登入成功',
                type: 'success'
              });
            
              // 5. 拿到token,打profile進頁面
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


            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error)
            alert('登入失敗')
          })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 50px auto;
}
.login-container h2 {
  text-align: center;
}
</style>