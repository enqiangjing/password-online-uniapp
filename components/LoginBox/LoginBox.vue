<template>
	<view class="box ce-display">
		<!-- 未登录时展示 -->
		<view class="outside" v-if="!isLogin">
			<view class="top cc-display">
				<image src="/static/img/login/user.svg" alt="top" />
			</view>
			<view class="item cs-display">
				<LoginInput type="email" class="input" v-model="userName" placeholder="请输入用户名" />
			</view>
			<view class="item cs-display">
				<LoginInput type="password" class="input" v-model="password" placeholder="请输入密码" />
			</view>
			<view class="item cc-display">
				<Button @click="fnLogin">登录</Button>
			</view>
		</view>
		
		<!-- 用户已登录时展示 -->
		<view class="outside" v-if="isLogin">
			<view class="top cc-display">
				<image src="/static/img/login/user.svg" alt="top" />
			</view>
			<view class="item cs-display">
				{{currentUser}}
			</view>
			<view class="item cc-display">
				<Button @click="fnLogOut">退出</Button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件名
		 */
		name: "LoginBox",


		/**
		 * 组件响应式数据
		 */
		data() {
			return {
				userName: '', // 用户名
				password: '', // 密码
			};
		},


		/**
		 * 组件创建时的钩子
		 */
		created() {
			// 判断用户是否登录
			if (this.$store.state.isLogin === false) {
				console.log('用户未登录')
				// 尝试读取缓存的数据
				try {
					// 1.读取私钥
					const private_key = uni.getStorageSync('pw_private_key');
					if (private_key) {
						// 私钥写入 vuex
						this.$store.commit("upPrivateKey", private_key)
						console.log("私钥读入内存！");
					}
					// 2.读取用户信息
					const userinfo = uni.getStorageSync('pw_userinfo');
					if (userinfo) {
						// 设置用户登录状态 vuex
						this.$store.commit('upUserInfo', userinfo)
						this.$store.commit('upLogStatus', true)
						console.log('用户信息读入内存！', userinfo.userName);
					}
				} catch (e) {
					// 打印错误日志
					console.log(e)
				}
			}
		},


		/**
		 * 计算属性
		 */
		computed: {
			// 用户是否登录
			isLogin() {
				return this.$store.state.isLogin;
			},
			// 读取用户名
			currentUser() {
				return this.$store.state.userName;
			}
		},


		/**
		 * 组件方法
		 */
		methods: {
			// [funciton] 登录请求发送
			fnLogin() {
				// 1.用户名校验
				let userName = this.userName;
				if (userName === "") {
					uni.showToast({
						title: '用户名未输入！',
						icon: 'none',
						duration: 2000,
					});
					return;
				}
				// 2.密码校验
				let password = this.password;
				if (password === "") {
					uni.showToast({
						title: '密码未输入！',
						icon: 'none',
						duration: 2000,
					});
					return;
				}
				// 3.请求发送
				uni.request({
					url: this.$baseUrl + 'api/pub/login', //仅为示例，并非真实接口地址。
					method: 'POST',
					data: {
						userName: this.userName,
						password: this.password,
					},
					header: {
						'custom-header': 'uni-app-suisei' //自定义请求头信息
					},
					success: (res) => {
						// 3.1登录成功
						if (res.data.errCode === 'success') {
							const user_info = res.data.data
							user_info.password = this.password
							this.$store.commit('upUserInfo', user_info)
							this.$store.commit('upLogStatus', true)
							console.log('登录成功', user_info)
							// 用户信息缓存到本地
							uni.setStorage({
								key: 'pw_userinfo',
								data: user_info,
								success: function() {
									console.log('用户信息缓存成功！');
								}
							});
							// 手机提示
							uni.showToast({
								title: '登录成功！',
								icon: 'success',
								duration: 2000,
							});
							return
						}
						// 3.2登录结果不为 success
						uni.showToast({
							title: '交易失败！',
							icon: 'none',
							duration: 2000,
						});
					}
				});
			},

			// [function] 退出登录
			fnLogOut() {
				// 请求发送
				uni.request({
					url: this.$baseUrl + 'api/logout', //仅为示例，并非真实接口地址。
					method: 'POST',
					data: {
						userName: this.userName,
						password: this.password,
					},
					header: {
						'custom-header': 'uni-app-suisei' //自定义请求头信息
					},
					success: (res) => {
						// 1.后台请求结果
						if (res.data.errCode === 'success') {
							// 清除内存数据
							this.$store.commit('upUserInfo', {});
							this.$store.commit('upLogStatus', false);
							// 移除缓存
							try {
								uni.removeStorage({
									key: 'pw_userinfo',
									success: function(res) {
										console.log('用户信息缓存移除！');
									}
								});
								uni.removeStorage({
									key: 'pw_private_key',
									success: function(res) {
										console.log('私钥信息缓存移除！');
									}
								});
							} catch (e) {
								console.log('退出时移除缓存！', e)
							}
							// 后台请求结果不为 success
							uni.showToast({
								title: '已退出！',
								icon: 'none',
								duration: 2000,
							});
							return;
						}
						// 2.后台请求失败
						uni.showToast({
							title: '交易失败！',
							icon: 'none',
							duration: 2000,
						});
					}
				});
			},
		},
	};
</script>

<style scoped lang="less">
	.box {
		width: 100%;
		height: 55%;

		.outside {
			width: 90%;
			height: 400px;
			background-color: rgba(255, 255, 255, 0.85);
			border-radius: 10px;

			.top {
				height: 50%;
				overflow: hidden;

				image {
					width: 140px;
					height: 140px;
					border-radius: 80px;
					background-color: #eee;
				}
			}

			.item {
				height: 15%;

				.input {
					width: 90%;
					height: 50px;
				}
			}
		}
	}
</style>
