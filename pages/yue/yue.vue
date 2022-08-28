<template>
	<view class="content cs-display">
		<view class="content-m br-8">
			<!-- 公钥加载 -->
			<view class="one-line cc-display fs-20 ls-8 fw-6 color-primary">公钥</view>
			<view class="more-line cc-display">
				<Textarea class="textarea" v-model="publicKey"></Textarea>
			</view>
			<view style="display:none">
				<input type="file" id="files_publicKey" @change="fnReadFile('publicKey')" />
			</view>
			<view class="one-line cc-display">
				<Button @click="fileLoad('publicKey')">加载</Button>
				<tki-file-manager ref="filemanager" @result="resultPath"></tki-file-manager>
				<Button @click="fnSave()" style="margin-left:10px">保存</Button>
			</view>

			<!-- 分隔符 -->
			<view class="line"></view>

			<!-- 私钥加载 -->
			<view class="one-line cc-display fs-20 ls-8 fw-6 color-primary">私钥</view>
			<view class="one-line cc-display fs-18">{{ privateKey }}</view>
			<view style="display:none">
				<input type="file" id="files_privateKey" @change="fnReadFile('privateKey')" />
			</view>
			<view class="one-line cc-display">
				<Button @click="fileLoad('privateKey')">加载</Button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 页面组件
		 */
		name: "PageYue",


		/**
		 * 组件响应式数据
		 */
		data() {
			return {
				keyType: '',
			};
		},
		
		/**
		 * 页面钩子
		 */
		onShow() {
			console.log('page yue')
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
		 * 计算属性
		 */
		computed: {
			// 公钥
			publicKey() {
				return this.$store.state.publicKey;
			},
			// 私钥
			privateKey() {
				return this.$store.state.privateKey ? '私钥已缓存，退出登录时清理！' : '请先加载私钥！'
			},
		},


		/**
		 * 组件方法
		 */
		methods: {
			// [function] 公钥保存
			fnSave() {
				// 判断是否登录
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
				// 1.公钥保存请求
				uni.request({
					url: this.$baseUrl + 'api/upDateUser', //仅为示例，并非真实接口地址。
					method: 'POST',
					data: {
						userName: this.$store.state.userName,
						publicKey: this.$store.state.publicKey,
					},
					header: {
						'custom-header': 'uni-app-suisei' //自定义请求头信息
					},
					success: (res) => {
						if (res.data.errCode === 'success') {
							uni.showToast({
								title: '公钥保存成功！',
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

			// [function] 文件读取 安卓 
			resultPath(filePath) {
				const self = this;
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fobject) {
					// fs.root是根目录操作对象DirectoryEntry
					fobject.root.getFile(filePath, {
						create: true
					}, function(fileEntry) {
						fileEntry.file(function(file) {
							var fileReader = new plus.io.FileReader()
							fileReader.readAsText(file, 'utf-8')
							fileReader.onloadend = function(evt) {
								const key_value = evt.target.result
								if (self.keyType === "publicKey") {
									self.$store.commit("upPublicKey", key_value)
									uni.showToast({
										title: '公钥加载成功！',
										icon: 'success',
										duration: 2000,
									});
								} else {
									self.$store.commit("upPrivateKey", key_value)
									// 私钥写入本地缓存
									uni.setStorage({
										key: 'pw_private_key',
										data: key_value,
										success: function() {
											console.log('私钥本地缓存成功！')
										}
									});
									uni.showToast({
										title: '私钥加载成功！',
										icon: 'success',
										duration: 2000,
									});
								}
							}
						});
					});
				});
			},

			// [function] 打开文件选择器
			fileLoad(val) {
				// 登录状态检查
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
				// 密钥类型
				this.keyType = val;
				// 安卓文件选择器
				this.$refs.filemanager._openFile();
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
					width: 80%;
				}
			}

			.more-line {
				height: 140px;
				width: 100%;

				.textarea {
					height: 120px;
					width: 100%;
				}
			}
		}
	}

	.line {
		height: 0;
		margin: 20px 0 10px 0;
		border-top: 2px solid #67c23a;
	}
</style>
