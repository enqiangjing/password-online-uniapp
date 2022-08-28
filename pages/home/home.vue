<template>
	<view class="home">
		<view class="primary-bg cc-display nav">
			<view class="search ec-display">
				<LoginInput type="search" class="input" v-model="searchInupt" placeholder="请输入搜索值" />
			</view>
			<view class="logo cc-display">
				<image src="/static/img/home/mlogo.svg" alt="" @click="fnGetAccountList" />
			</view>
		</view>
		<MainList :msgList="accountList"></MainList>
	</view>
</template>

<script>
	export default {
		/**
		 * 组件响应式数据
		 */
		data() {
			return {
				sonMenu: false,
				searchInupt: "",
				accountList: [],
				accountListCopy: [],
				reLogin: 0,
			};
		},


		/**
		 * 页面钩子
		 */
		onShow() {
			console.log('page home')
		},


		/**
		 * 组件创建时的钩子
		 */
		created() {
			// 1.定义accountSearch，用于延时发送账号信息查询
			this.accountSearch = _.debounce(this.fnSearchInCurrent, 500)

			// 2.尝试读取私钥 和 用户登录状态
			if (this.$store.state.isLogin === false) {
				console.log('用户未登录')
				// 2.1尝试读取缓存的数据
				try {
					// 2.2读取私钥
					const private_key = uni.getStorageSync('pw_private_key');
					if (private_key) {
						// 私钥写入 vuex
						this.$store.commit("upPrivateKey", private_key)
						console.log("私钥读入内存！");
					} else {
						uni.switchTab({
							url: '/pages/index/index'
						})
						return
					}
					// 2.3读取用户信息
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

			// 3.进入页面时启动一次信息查询
			this.fnGetAccountList();
		},


		/**
		 * 组件中定义的方法
		 */
		methods: {
			// [function] 账户信息查询
			fnGetAccountList() {
				// 1.判断登录状态、私钥是否存在
				if (this.$store.state.isLogin === false) {
					uni.showToast({
						title: '用户未登录！',
						icon: 'none',
						duration: 2000,
					});
					uni.switchTab({
						url: '/pages/index/index'
					})
					return
				}
				if (this.$store.state.privateKey === '') {
					uni.showToast({
						title: '私钥未载入！',
						icon: 'none',
						duration: 2000,
					});
					return
				}
				// 2.应用私钥
				this.$rsa.setPrivateKey(this.$store.state.privateKey)
				// 3.http 请求查询加密数据列表
				uni.request({
					url: this.$baseUrl + 'api/getListLike', //仅为示例，并非真实接口地址。
					method: 'POST',
					data: {
						userName: this.$store.state.userName,
					},
					header: {
						'custom-header': 'uni-app-suisei' //自定义请求头信息
					},
					success: async (res) => {
						if (res.data.errCode === 'success') {
							// 3.1数据解密
							this.accountList = res.data.data.map((e) => {
								return {
									...e,
									account: this.$rsa.decrypt(e.account),
									extra: this.$rsa.decrypt(e.extra),
									password: this.$rsa.decrypt(e.password),
									systemName: this.$rsa.decrypt(e.systemName),
								};
							});
							// 3.2备份查询结果，作为页面检索的集合
							this.accountListCopy = this.accountList;
							// 3.3弹出提示
							uni.showToast({
								title: '查询成功！',
								icon: 'none',
								duration: 2000,
							});
							return
						}
						// 未登录
						if (res.data.errCode == '001' && res.data.errMsg == '未登录') {
							// 重新登录
							await this.fnIsLogin()
						}
						// 查询结果不为 success 时的提示
						console.log(res.data)
						uni.showToast({
							title: res.data.errMsg,
							icon: 'none',
							duration: 2000,
						})
					},
					fail: (err) => {
						console.log(err)
					}
				});
			},

			// [funciton] 根据输入检索账号集中符合条件的数据
			fnSearchInCurrent() {
				// 页面内数据搜索
				this.accountList = this.accountListCopy.filter((x) => {
					let flag = false;
					for (let i in x) {
						if (String(x[i]).includes(this.searchInupt)) {
							flag = true;
							break;
						}
					}
					return flag;
				});
			},

			// 登录存活确认
			async fnIsLogin() {
				// 仅重试3次
				if (this.reLogin > 2) return
				// 登录存活确认
				const _self = this
				await uni.request({
					url: _self.$baseUrl + 'api/isLogin', //仅为示例，并非真实接口地址。
					method: 'GET',
					header: {
						'custom-header': 'uni-app-suisei' //自定义请求头信息
					},
					success: async (res) => {
						if (res.data.errCode == "001") {
							// 需要重新登录
							await uni.request({
								url: _self.$baseUrl + 'api/pub/login', //仅为示例，并非真实接口地址。
								method: 'POST',
								data: {
									userName: _self.$store.state.userName,
									password: _self.$store.state.password,
								},
								header: {
									'custom-header': 'uni-app-suisei' //自定义请求头信息
								},
								success: async (res) => {
									await console.log('登录结果', res)
								},
							})
						}
					},
				})
				// 重试次数加1
				this.reLogin = this.reLogin + 1
				return this.fnGetAccountList()
			}
		},


		/**
		 * 组件中的元素监听
		 */
		watch: {
			// 输入变化后进行搜索
			searchInupt(newVal, oldVal) {
				// 输入发生变化时，触发页面内搜索
				if (newVal !== oldVal && newVal.trim() !== "") return this.accountSearch()
				this.accountList = this.accountListCopy;
			},
		},
	}
</script>

<style lang="less" scoped>
	// 菜单按钮背景
	@menu-bg: rgb(67, 148, 253);

	.home {
		position: relative;
		height: 100%;
		width: 100%;
		// background: url(/static/logo.png) no-repeat top center;
		background-color: #f6f6f6;
		overflow-y: auto;

		.nav {
			width: 100%;
			height: 60px;
			position: relative;
			position: sticky;
			top: 0;
			z-index: 1100;

			.logo {
				height: 100%;
				width: 20%;

				image {
					width: 40px;
					height: 40px;
				}
			}

			.search {
				width: 80%;
				height: 100%;

				.input {
					width: 90%;
					height: 45px;
					background-color: #fff;
				}
			}
		}
	}
</style>
