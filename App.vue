<script>
	export default {
		// 应用启停钩子
		// app 启动
		onLaunch: function() {
			console.log('App Launch')
		},
		// 切换到当前 app
		onShow: function() {
			console.log('App Show')
		},
		// 切换到其他 app，当前 app 进入后台
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	@import "@/static/base.less";
</style>
