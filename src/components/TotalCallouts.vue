<template>
  <div class="infos">
    <div class="wrapper">
      <section>
        <p class="exte-large">
          <img src="@/assets/icons/bubble.svg" class="category-icon" />
        </p>
        <p class="value expa-large">{{planets.length}}</p>
        <label class="exte-small">PLANETS</label>
      </section>
    </div>
    <div class="wrapper">
      <section>
        <p class="exte-large">
          <img src="@/assets/icons/pin.svg" class="category-icon" />
        </p>
        <p class="value expa-large">{{stars.length}}</p>
        <label class="exte-small">STARS</label>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    planets() {
      return this.$store.state.planets;
    },
    stars() {
      return this.$store.state.stars;
    }
  }
};
</script>

<style lang="scss">
.infos {
  display: flex;
  margin-bottom: 2rem;
  .category-icon {
    width: 3rem;
  }
  & > div {
    flex: 1;
    display: flex;
    justify-content: center;
    margin: 1rem 100px;
    section {
      text-align: center;
    }
    h3 {
      color: $col-green;
    }
    label {
      text-transform: uppercase;
      color: $col-green;
      display: block;
      margin: 0.5rem 0;
      padding-bottom: 0.5rem;
    }
  }
}
</style>