<template>
    <div class="page-wrapper">
        <h3>Admin</h3>
        <hr>
        <div class="user-management-container">
            <!-- 1. 當 tableData 為空時，顯示原本的空狀態提示與圖片 -->
            <div v-if="tableData.length === 0" class="empty-container">
                <img
                    src="@/assets/empty.png"
                    alt="目前沒有普通用戶資料"
                    class="empty-image"
                />
                <p>目前沒有普通用戶資料</p>
            </div>

            <!-- 2. 當有資料時，才顯示無限滾動列表 -->
            <template v-else>
                <ul class="infinite-list" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" style="overflow:auto; height: 600px; padding: 0; list-style: none;">
                    <li v-for="(user, index) in visibleUserList" :key="user.id" class="infinite-list-item" style="margin-bottom: 20px;">
                        <el-card shadow="hover">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <!-- 用戶頭像與基本資訊 -->
                                <div style="display: flex; align-items: center; gap: 20px;">
                                    <el-avatar :size="60" :src="user.avatar" />
                                    <div>
                                        <h3 style="margin: 0 0 5px 0;">{{ user.nickName }} <span style="font-size: 12px; color: #909399;">用戶名 : ({{ user.userName }})</span></h3>
                                        <p style="margin: 0; font-size: 14px; color: #606266;">信箱：{{ user.email || '未設定' }} | 手機：{{ user.phonenumber || '未設定' }}</p>
                                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #909399;">
                                            性別：{{ user.sex == 0 ? '男生' : user.sex == 1 ? '女生' : user.sex == 2 ? '未知' : '未設定' }} | 
                                            創建時間：{{ formatDate(user.createTime) }} | 最後修改時間：{{ formatDate(user.updateTime) }}
                                        </p>
                                    </div>
                                </div>

                                <!-- 帳號狀態 Switch 開關 -->
                                <div>
                                    <span style="margin-right: 10px; font-size: 14px;">帳號狀態：</span>
                                    <el-switch
                                        v-model="user.status"
                                        active-value="0"
                                        inactive-value="1"
                                        active-text="啟用"
                                        inactive-text="停用"
                                        @change="handleStatusChange(user)"
                                    />
                                </div>
                            </div>
                        </el-card>
                    </li>
                </ul>

                <!-- 載入中與沒有更多資料的提示 -->
                <p v-if="loading" style="text-align: center; color: #909399; margin: 15px 0;">載入中...</p>
                <p v-if="noMore" style="text-align: center; color: #909399; margin: 15px 0;">沒有更多用戶資料了</p>
            </template>

            <!-- 底部儲存與重置按鈕（有資料時才顯示） -->
            <div v-if="tableData.length > 0" style="margin-top: 20px; padding-bottom: 20px;">
                <el-button type="primary" @click="onSubmit">儲存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        const userList = JSON.parse(this.$route.params.userList || '{"userList":[]}').userList;

        return {
            tableData: JSON.parse(JSON.stringify(userList)),
            originalTableData: JSON.parse(JSON.stringify(userList)),
            
            // 無限滾動相關變數
            count: 5,
            loading: false
        };
    },
    computed: {
        visibleUserList() {
            return this.tableData.slice(0, this.count);
        },
        noMore() {
            return this.count >= this.tableData.length;
        },
        disabled() {
            return this.loading || this.noMore;
        }
    },
    methods: {
        formatDate(value) {
            if (!value) return '';
            const date = new Date(value);
            return date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0') + ' ' +
                String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0') + ':' +
                String(date.getSeconds()).padStart(2, '0');
        },
        load() {
            this.loading = true;
            setTimeout(() => {
                this.count += 5;
                this.loading = false;
            }, 1000);
        },
        handleStatusChange(row) {
            console.log('使用者 ID：', row.id);
            console.log('目前狀態：', row.status);
        },
        resetForm() {
            this.tableData = JSON.parse(JSON.stringify(this.originalTableData));
            this.$message.success('已還原尚未儲存的變更');
        },
        async onSubmit() {
            const changedUsers = this.tableData
                .filter(user => {
                    const originalUser = this.originalTableData.find(
                        original => original.id === user.id
                    );
                    return originalUser &&
                        String(user.status) !== String(originalUser.status);
                })
                .map(user => ({
                    id: user.id,
                    status: String(user.status)
                }));

            if (changedUsers.length === 0) {
                this.$message.warning('沒有需要儲存的變更');
                return;
            }

            try {
                const response = await axios.put(
                    'http://localhost:8081/admin/userList',
                    changedUsers,
                    {
                        headers: {
                            token: sessionStorage.getItem('token')
                        }
                    }
                );

                if (response.data.code !== 200) {
                    this.$message.error(response.data.msg || '儲存失敗');
                    return;
                }

                this.originalTableData = JSON.parse(
                    JSON.stringify(this.tableData)
                );

                this.$message.success('帳號狀態儲存成功');

            } catch (error) {
                console.error('儲存帳號狀態失敗：', error);
                this.$message.error('儲存失敗，請稍後再試');
            }
        }
    }
}
</script>

<style scoped>
.user-management-container {
    padding: 20px;
}
.infinite-list {
    max-height: 650px;
}
.empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
}
.empty-image {
    width: 650px;
    height: auto;
    object-fit: contain;
}
.empty-container p {
    margin-top: 12px;
    color: #909399;
    font-size: 14px;
}
</style>