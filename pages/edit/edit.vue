<template>
	<div class="content cs-display">
		<div class="content-m br-8">
			<div class="one-line cc-display fs-20 ls-8 fw-6 color-primary">
				{{ topTitle }}
			</div>
			<div class="one-line cc-display">
				<LoginInput type="sysname" class="input" v-model="systemName" placeholder="请输入系统/软件名称" />
			</div>
			<div class="one-line cc-display">
				<LoginInput type="accin" class="input" v-model="account" placeholder="请输入账号" />
			</div>
			<div class="one-line cc-display">
				<LoginInput type="passin" class="input" v-model="password" placeholder="请输入密码" />
			</div>
			<div class="one-line cc-display">
				<LoginInput type="more" class="input" v-model="extra" placeholder="请输入备注信息" />
			</div>
			<div class="one-line cc-display">
				<Button @click="fnSave">保存</Button>
				<Button v-if="this.topTitle=='增加'" @click="fnClear">清空</Button>
				<Button v-else @click="fnClear">新增</Button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		/**
		 * 页面组件
		 */
		name: 'PageEdit',


		/**
		 * 组件响应式数据
		 */
		data() {
			return {
				topTitle: '',
				systemName: '',
				account: '',
				password: '',
				extra: '',
				id: '',
			};
		},


		/**
		 * 组件钩子
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
		 * 页面钩子
		 */
		onShow() {
			console.log('page edit')
			if (this.$store.state.editStatus) {
				this.systemName = this.$store.state.editItem.systemName;
				this.account = this.$store.state.editItem.account;
				this.password = this.$store.state.editItem.password;
				this.extra = this.$store.state.editItem.extra;
				this.id = this.$store.state.editItem.id;
				this.$store.commit('upEditStatus', false);
				this.$store.commit('upEditItem', {});
				this.topTitle = "修改";
				return;
			}
			this.systemName = "";
			this.account = "";
			this.password = "";
			this.extra = "";
			this.id = "";
			this.topTitle = "增加";
		},


		/**
		 * 组件方法
		 */
		methods: {
			// [function] 账号保存
			fnSave() {
				// 判断登录、公钥是否加载
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
				if (this.$store.state.publicKey === "") {
					uni.showToast({
						title: '未加载公钥！',
						icon: 'none',
						duration: 1500,
					});
					return
				}
				// 公钥读入内存
				this.$rsa.setPublicKey(this.$store.state.publicKey)
				// 保存
				let sendData = {
					userName: this.$store.state.userName,
					systemName: this.$rsa.encrypt(this.systemName),
					account: this.$rsa.encrypt(this.account),
					password: this.$rsa.encrypt(this.password),
					extra: this.$rsa.encrypt(this.extra),
				};
				// 新增账号
				let sendUrl = "api/insertData";
				if (this.topTitle === "修改") {
					sendData.id = this.id;
					// 更新账号
					sendUrl = "api/upDateInfo";
				}
				// 请求提交
				uni.request({
					url: this.$baseUrl + sendUrl,
					method: 'POST',
					data: sendData,
					header: {
						'custom-header': 'uni-app-suisei' //自定义请求头信息
					},
					success: (res) => {
						if (res.data.errCode === 'success') {
							uni.showToast({
								title: '保存成功！',
								icon: 'none',
								duration: 2000,
							});
							return;
						}
						uni.showToast({
							title: res.data,
							icon: 'none',
							duration: 2000,
						});
					}
				});
			},

			// [function] 清除输入框内容，切换到增加
			fnClear() {
				this.systemName = "";
				this.account = "";
				this.password = "";
				this.extra = "";
				this.id = "";
				this.topTitle = "增加";
			},
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.content {
		width: 100%;
		height: 100%;
		// background: url(/static/logo.png) no-repeat top center;
		background-color: #f6f6f6;

		.content-m {
			padding: 10px 0;
			width: 92.5%;
			background-color: rgba(255, 255, 255, 0.85);

			.one-line {
				height: 60px;
				width: 100%;

				.input {
					height: 40px;
					width: 95%;
				}
			}
		}
	}
</style>
