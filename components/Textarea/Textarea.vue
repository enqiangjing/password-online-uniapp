<template>
  <div class="br-4">
    <textarea
      name=""
      cols="30"
      rows="10"
      class="pbm0 border-none ls-2"
      :value="value"
      @input="$emit('v_textarea', $event.target.value)"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: "Textarea",
  props: ["value"],
  model: { prop: "value", event: "v_textarea" },
};
</script>

<style scoped lang="less">
div {
  border: 1px solid rgb(200, 200, 200);
  overflow: hidden;

  textarea {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    width: 100%;
    height: 100%;
    outline: 0;
    padding: 5px;
  }

  &:hover {
    border: 1px solid #409eff;
  }
}
</style>
