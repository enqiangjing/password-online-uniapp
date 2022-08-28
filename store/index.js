import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		"isLogin": false,
		"userName": "",
		"password": "",
		"email": "",
		"phone": "",
		"publicKey": "",
		"privateKey": "",
		"editStatus": false,
		"editItem": {},
	},
	mutations: {
		upUserInfo(state, userInfo) {
			state.userName = userInfo?.userName || "";
			state.password = userInfo?.password || "";
			state.email = userInfo?.email || "";
			state.phone = userInfo?.phone || "";
			state.publicKey = userInfo?.publicKey || "";
		},
		upLogStatus(state, flag) {
			if (state.userName !== '' && flag) return state.isLogin = flag;
			state.isLogin = false;
		},
		upPublicKey(state, val) {
			state.publicKey = val;
		},
		upPrivateKey(state, val) {
			state.privateKey = val;
		},
		upEditItem(state, val) {
			state.editItem = val;
		},
		upEditStatus(state, val) {
			state.editStatus = val;
		},
	}
})
export default store
