<template>
  <div class="total-callouts">
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
    <div class="wrapper">
      <section>
        <p class="exte-large">
          <img src="@/assets/icons/star-planet.svg" class="category-icon" />
        </p>
        <p class="value expa-large">{{starsPerPlanet}}</p>
        <label class="exte-small">STARS / PLANET</label>
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
    },
    starsPerPlanet() {
      return (this.stars.length / this.planets.length).toFixed(2);
    }
  }
};
</script>

<style lang="scss">
.total-callouts {
  display: flex;
  margin-bottom: 2rem;
  .category-icon {
    height: 3rem;
  }
  & > div {
    flex: 1;
    display: flex;
    justify-content: center;
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
      text-align: center;
    }
  }
}
</style>