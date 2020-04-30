<template>
  <div class="planet-link">
    <div class="start">
      <img src="@/assets/icons/bubble.svg" svg-inline class="cat-icon"/>
      <p>
        <span class="city" v-if="start.city">{{ start.city }},</span>
        <span class="country" v-if="start.country">{{start.country}}</span>
      </p>
    </div>
    <div class="end" v-if="end">
      <img src="@/assets/icons/pin.svg" svg-inline class="cat-icon"/>
      <p>
        <span class="city" v-if="end.city">{{ end.city }},</span>
        <span class="country" v-if="end.country">{{end.country}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlanetLink",
  props: {
    planet: {
      type: Object,
      required: true
    }
  },
  computed: {
    star() {
      return this.$store.getters.getPlanetStar(this.planet.id);
    },
    start() {
      return {
        city:
          !this.planet.city || this.planet.city === "#notfound"
            ? ""
            : this.planet.city,
        country:
          !this.planet.country || this.planet.country === "#notfound"
            ? ""
            : this.planet.country
      };
    },
    end() {
      if (!this.star) return null;
      return {
        city:
          !this.star.city || this.star.city === "#notfound"
            ? ""
            : this.star.city,
        country:
          !this.star.country || this.star.country === "#notfound"
            ? ""
            : this.star.country
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.planet-link {
  display: flex;
  justify-content: space-between;
  .cat-icon {
    height: 2rem;
  }
  .city,
  .country {
    font-size: 0.8rem;
  }
  .end {
    text-align: right;
  }
}
</style>