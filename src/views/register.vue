<template>
    <div>
        <h3>Register</h3>
        <hr>
        <el-form ref="form" :model="user" :rules="rules" label-width="80px">
            <el-form-item label="用戶名" prop="userName">
                <el-input
                    v-model="user.userName"
                    @input="user.userName = user.userName.replace(/[^a-zA-Z0-9]/g, '')"
                    @blur="checkUserName">

                    <template slot="suffix">
                        <span v-if="userNameMsg"
                            :style="{ color: userNameColor }">
                            {{ userNameMsg }}
                        </span>
                    </template>

                </el-input>
            </el-form-item>

            <el-form-item label="暱稱" prop="nickName">
                <el-input v-model="user.nickName"></el-input>
            </el-form-item>
            
            <el-form-item label="密碼" prop="password">
                <el-input placeholder="請輸入密碼" v-model="user.password" show-password></el-input>
            </el-form-item>

            <el-form-item label="帳號狀態" prop="status">
                <el-switch
                    v-model="user.status"
                    active-value="0"
                    inactive-value="1"
                    active-text="啟用"
                    inactive-text="停用"
                    @change="handleStatusChange">
                </el-switch>
            </el-form-item>

            <el-form-item label="郵箱" prop="email">
                <el-input
                    v-model="user.email"
                    placeholder="請輸入郵箱"
                    @input="user.email = user.email.replace(/\s+/g, '')"
                    @blur="checkUserEmail"
                    >

                    <template slot="suffix">
                        <span v-if="userEmailMsg"
                            :style="{ color: userEmailColor }">
                            {{ userEmailMsg }}
                        </span>
                    </template>

                </el-input>
            </el-form-item>

            <el-form-item label="手機" prop="phonenumber">
                <el-input v-model="user.phonenumber"></el-input>
            </el-form-item>

            <el-form-item label="性別" prop="sex">
                <el-radio-group v-model="user.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
                <el-radio label="2">未知</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="大頭照" prop="avatar">
                <el-upload
                class="avatar-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarChange">

                <img v-if="user.avatar" :src="user.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即創建</el-button>
                <el-button @click="resetForm">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
        user: {
            userName: '',
            nickName: '',
            password: '',
            status: '0',
            email: '',
            phonenumber: '',
            sex: '2', 
            avatar: ''
        },
        userNameMsg: '',
        userNameColor: '',
        userEmailMsg: '',
        userEmailColor: '',
        rules: {
            userName: [
                { required: true, message: '請輸入用戶名', trigger: 'blur' }
            ],
            nickName: [
                { required: true, message: '請輸入暱稱', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '請輸入密碼', trigger: 'blur' }
            ],
            status: [
                { required: true, message: '請選擇帳號狀態', trigger: 'change' }
            ],
            email: [
                { required: true, message: '請輸入郵箱', trigger: 'blur' }
            ],
            phonenumber: [
                { required: true, message: '請輸入手機號碼', trigger: 'blur' }
            ],
            sex: [
                { required: true, message: '請選擇性別', trigger: 'change' }
            ],
            avatar: [
                { required: true, message: '請上傳大頭照', trigger: 'change' }
            ]
        }
    }
  },
  methods: {
    onSubmit() {
        this.$refs.form.validate((valid) => {
            if (valid) {
                axios.post('http://localhost:8081/user/basic', this.user)
                    .then(response => {
                        this.$notify({
                        title: '創建結果',
                        message: response.data.msg,
                        position: 'bottom-right'
                      });
                      this.$router.push('/main');
                    })
                    .catch(error => {
                        this.$notify({
                        title: '創建失敗',
                        message: error.msg,
                        position: 'bottom-right'
                        });
                  });
            }else {
                console.log('表單驗證失敗');
                return false;
            }
        });
    },
    checkUserName() {
        if (!this.user.userName) {
        this.userNameMsg = '';
        return;
        }
        const action = 'register';
        axios.get(`http://localhost:8081/user/validateUserName/${this.user.userName}/${action}`)
            .then(response => {
                console.log(response);
                if (response.data.code === 200) {
                    this.userNameMsg = '可使用';
                    this.userNameColor = 'green';
                    this.$notify({
                    title: '成功',
                    message: '用戶名可使用',
                    type: 'success'
                    });
                } else {
                    this.userNameMsg = '用戶名已重複';
                    this.userNameColor = 'red';
                    this.$notify({
                    title: '警告',
                    message: '用戶名已重複',
                    type: 'warning'
                    });
                }
            })
            .catch(error => {
                this.userNameMsg = '檢查失敗';
                this.userNameColor = 'red';
            });
        },
        checkUserEmail() {
            if (!this.user.email) {
            this.userEmailMsg = '';
            return;
            }
            const action = 'register';
            axios.get(`http://localhost:8081/user/validateEmail/${this.user.email}/${action}`)
                .then(response => {
                    console.log(response);
                    if (response.data.code === 200) {
                        this.userEmailMsg = '可使用';
                        this.userEmailColor = 'green';
                        this.$notify({
                        title: '成功',
                        message: '郵箱可使用',
                        type: 'success'
                        });
                    } else {
                        this.userEmailMsg = '郵箱已被使用';
                        this.userEmailColor = 'red';
                        this.$notify({
                        title: '警告',
                        message: '郵箱已被使用',
                        type: 'warning'
                        });
                    }
                })
                .catch(error => {
                    this.userEmailMsg = '檢查失敗';
                    this.userEmailColor = 'red';
                });
            },
        handleAvatarChange(file) {
            const isJPG = file.raw.type === 'image/jpeg';
            const isLt2M = file.raw.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('只能上傳 JPG 格式！');
                return;
            }

            if (!isLt2M) {
                this.$message.error('圖片不能超過 2MB！');
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                this.user.avatar = reader.result;
            };

            reader.readAsDataURL(file.raw);
        },
        resetForm() {
            this.user = {
                userName: '',
                nickName: '',
                password: '',
                status: '0',
                email: '',
                phonenumber: '',
                sex: '2',
                avatar: ''
            };
            this.userNameMsg = '';
            this.userNameColor = '';
            this.userEmailMsg = '';
            this.userEmailColor = '';
        },
        handleStatusChange(value) {
            if(value == 1){
                this.$notify({
                    title: '警告',
                    message: '帳號狀態為停用將無法登入,須請管理員調整',
                    type: 'warning'
                    });
            }
        }  
    }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>