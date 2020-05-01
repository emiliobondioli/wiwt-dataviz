<template>
  <div class="type-toggle" @click="toggle">
    <label class="thin-medium">{{value}}</label>
    <div class="icons">
      <div class="icon" :class="{active: value === 'planets'}">
        <img src="@/assets/icons/planet.svg" svg-inline />
      </div>
      <div class="icon" :class="{active: value === 'stars'}">
        <img src="@/assets/icons/star.svg" svg-inline />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    toggle() {
      const selected = this.value === "planets" ? "stars" : "planets";
      this.$emit("input", selected);
    }
  }
};
</script>

<style lang="scss" scoped>
.type-toggle {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 2rem;
  label {
    color: $col-green;
    text-transform: uppercase;
  }
  .icons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid $col-green;
    border-radius: 10rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    .icon {
      &:last-child {
        margin-left: 1rem;
      }
      svg {
        height: 2rem;
        fill: $col-darkgray;
        outline: none;
        opacity: .4;
      }
      &.active svg {
          opacity: 1;
        fill: $col-green;
      }
    }
  }
}
</style>