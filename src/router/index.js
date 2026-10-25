import Vue from 'vue'
import Router from 'vue-router'

import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import AppVue from '../App.vue'
import Register from '../views/register.vue'
import Profile from '../views/user/Profile.vue'
import UserList from '../views/user/List.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',// 路徑不帶#
    routes:[
        {
        path: '/',
        component: Main
        },{
        path: '/main',
        component: Main
        },{
            path: '/login',
            component: Login
        },{
            path: '/appVue',
            component: AppVue
        },{
            path: '/register',
            component: Register
        },{
            path: '/profile',
            name: 'Profile',
            component: Profile
        },{
            path: '/userList',
            name: 'UserList',
            component: UserList
        }
    ]
});