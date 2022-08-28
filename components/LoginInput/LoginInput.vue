<template>
	<view class="lii cc-display">
		<view class="cc-display">
			<image :src="'/static/img/login/' + type + '.svg'" alt="email.ico" />
		</view>
		<input :type="iType" class="pbm0 border-none ls-2 fs-16" :value="value" :placeholder="placeholder" @input="$emit('v_input', $event.target.value)"
		 @click="$emit('v-click')" />
	</view>
</template>

<script>
	export default {
		name: "LoginInput",
		props: ["type", "value", "placeholder"],
		model: {
			prop: "value",
			event: "v_input"
		},
		data(props) {
			return {
				iType: "text",
			};
		},
		created() {
			this.fnCurrentImg();
		},
		methods: {
			fnCurrentImg() {
				if (this.type) {
					if (this.type === "password") {
						this.iType = "password";
					} else if (this.type === "email") {
						this.iType = "email";
					} else {
						this.iType = "text";
					}
				}
			},
		},
	};
</script>

<style lang="less" scoped>
	.lii {
		position: relative;
		border: 1px solid rgb(200, 200, 200);
		border-radius: 4px;
		overflow: hidden;

		view {
			position: absolute;
			left: 0;
			top: 0;
			width: 50px;
			height: 100%;

			image {
				margin-left: 1.5%;
				width: 30px;
				height: 30px;
			}
		}

		input {
			padding: 0 10px 0 50px;
			width: 100%;
			height: 100%;
			border: none;
			outline: 0;
		}

		&:hover {
			border: 1px solid #409eff;
		}
	}
</style>
