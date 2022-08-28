<template>
  <button
    :class="[bType, 'fs-16', 'fw-2', 'ls-2', 'br-4', 'cc-display']"
    @click="$emit('click')"
  >
    <slot>ceshi</slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    type: String,
  },
  data() {
    return {
      bType: "",
    };
  },
  created() {
    if (
      this.type === "success" ||
      this.type === "warning" ||
      this.type === "danger" ||
      this.type === "info"
    )
      return (this.bType = this.type + "-bg");
    this.bType = "primary" + "-bg";
  },
};
</script>

<style lang="less" scoped>
button {
  padding: 20px;
  height: 40px;
  color: #fff;
  border: none;
  outline: 0;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px #888;
  }
}
</style>