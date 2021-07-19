<template>
  <div class="spu-containter">
    <CategorySelector @changeCategory="changeCategory"></CategorySelector>
  </div>
</template>

<script>
export default {
  name: "spu",
};
</script>

<style lang="sass" scoped>
.spu-containter
  padding: 20px
</style>