<template>
  <div>
    <h3>My Profile</h3>
    <hr>
    <!-- 大頭照 -->
    <div class="demo-type">
        <div class="avatar-container">
            <el-avatar :size="160" :src="user.avatar"></el-avatar>

            <div
            v-if="!isDisabled"
            class="avatar-mask"
            @click="$refs.avatarInput.click()"
            >
            <i class="el-icon-camera"></i>
            <span>更換圖片</span>
            </div>

            <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleAvatarChange"
            />
        </div>
    </div>
    <br>
    <!-- 個人檔案 -->
    <el-form ref="form" :model="user" :rules="rules" label-width="80px" :disabled="isDisabled">
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

        <el-form-item label="角色">
            <el-checkbox-group
                v-model="selectedRoleIds"
                :disabled="isDisabled"
            >
                <el-checkbox
                v-for="item in roleSet"
                :key="item.id"
                :label="item.id"
                :disabled="item.id === 2"
                >
                {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="建立時間">
            <el-input :value="formatDateTime(user.createTime)" disabled></el-input>
        </el-form-item>

    </el-form>

    <el-button type="primary" @click="onUpdate" :disabled="!isDisabled">修改</el-button>
    <el-button @click="saveUser" :disabled="isDisabled">儲存</el-button>

  </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
    return {
        isDisabled: true,
        userData: {},
        user: {
            userName: '',
            nickName: '',
            status: '0',
            email: '',
            phonenumber: '',
            sex: '2'
        },
        roleSet: [],         // 所有角色
        selectedRoleIds: [], // 使用者已擁有的角色 ID
        userNameMsg: '',
        userEmailMsg: '',
        rules: {}
    };
    },
    created() {
        const parsedUser = JSON.parse(this.$route.params.user);

        this.userData = parsedUser.userRoleDTO;
        this.user = { ...this.userData.user };

        // 從後端傳來的 Set<Role>，取得使用者原本擁有的角色 ID
        this.selectedRoleIds = (this.userData.roleSet || [])
            .map(role => role.id);

        // 取得系統所有角色
        this.getRoleSet();
        },
    methods: {
        onUpdate() {
            this.isDisabled = false;
        },
        getRoleSet() {
            axios.get('http://localhost:8081/roleList')
                .then(response => {
                this.roleSet = response.data.data.roleSet;
                })
                .catch(error => {
                console.error(error);
                });
            },
        saveUser(){
            const token = sessionStorage.getItem('token');
            const loginUser = {
                user: this.user,
                roleSet: this.roleSet.filter(role =>
                this.selectedRoleIds.includes(role.id)
                )
            };

            axios.put('http://localhost:8081/user/basic', loginUser)
            .then(response => {
                if (response.data.code === 200) {
                    this.$message.success('儲存成功,請重新登錄');
                    this.isDisabled = true;

                    // 清除 Session Storage
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('tokenExpireTime');

                    // 清除 Axios 全域 Header
                    delete axios.defaults.headers.common['token'];

                }else{
                    this.$message.error(response.data.msg);
                    this.isDisabled = true;
                }
            })
            .catch(error => {
                console.error(error);
                this.$message.error('儲存失敗');
            });

            this.$router.push('/main')

        },
        checkUserName() {
            if (!this.user.userName) {
            this.userNameMsg = '';
            return;
            }
            const action = 'update'
            axios.get(`http://localhost:8081/user/validateUserName/${this.user.userName}/${action}`)
                .then(response => {
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
            const action = 'update'
            axios.get(`http://localhost:8081/user/validateEmail/${this.user.email}/${action}`)
                .then(response => {
                    if (response.data.code === 200) {
                        this.userEmailMsg = '可使用';
                        this.userEmailColor = 'green';
                        this.$notify({
                        title: '成功',
                        message: '信箱可使用',
                        type: 'success'
                        });
                    } else {
                        this.userEmailMsg = '信箱已被使用';
                        this.userEmailColor = 'red';
                        this.$notify({
                        title: '警告',
                        message: '信箱已被使用',
                        type: 'warning'
                        });
                    }
                })
                .catch(error => {
                    this.userEmailMsg = '檢查失敗';
                    this.userEmailColor = 'red';
                });
        },
        handleStatusChange(value) {
            if(value == 1){
                this.$notify({
                    title: '警告',
                    message: '帳號狀態為停用將無法登入,須請管理員調整',
                    type: 'warning'
                    });
            }
        },
        // 將 ISO 時間轉成台灣時間格式
        formatDateTime(dateTime) {
        if (!dateTime) return '';

        const date = new Date(dateTime);

        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Asia/Taipei',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23'
        }).format(date);
        },
        handleAvatarChange(event) {
            const file = event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith('image/')) {
                this.$message.error('請選擇圖片檔案');
                event.target.value = '';
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                this.user.avatar = e.target.result;
            };

            reader.readAsDataURL(file);

            // 讓同一張圖片也能再次選取
            event.target.value = '';
        },
    }
}
    
</script>
<style>
.avatar-container {
    position: relative;
    width: 160px;
    height: 160px;
}

.avatar-container .el-avatar {
    width: 160px;
    height: 160px;
}

.avatar-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}

.avatar-container:hover .avatar-mask {
    opacity: 1;
}

.avatar-mask i {
    font-size: 28px;
    margin-bottom: 8px;
}
</style>