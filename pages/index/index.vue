<template>
	<view class="login">
		<LoginBox></LoginBox>
	</view>
</template>

<script>
	export default {
		/**
		 * 页面钩子
		 */
		onShow() {
			console.log('page login')
		},
	}
</script>

<style lang="less" scoped>
	.login {
		position: relative;
		height: 100%;
		width: 100%;
		// background: url(/static/logo.png) no-repeat top center;
		background-color: #f6f6f6;
	}
</style>
