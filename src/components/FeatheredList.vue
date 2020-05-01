<template>
  <section class="feathered-list">
    <div class="blur"></div>
    <div class="items">
      <slot></slot>
    </div>
    <div class="blur bottom"></div>
  </section>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.feathered-list {
  user-select: none;
  position: relative;
  height: 100%;
  .items {
    height: 100%;
    overflow: auto;
    padding: 8% 0;
    mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  }
}
</style>