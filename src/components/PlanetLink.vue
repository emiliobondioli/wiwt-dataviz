<template>
  <div class="planet-link">
    <div class="link">
      <div class="row split v-center no-stack">
        <img src="@/assets/icons/planet.svg" svg-inline class="cat-icon" />
        <div class="col-fill separator" v-if="end"></div>
        <img src="@/assets/icons/star.svg" svg-inline class="cat-icon" v-if="end" />
      </div>
      <div class="row split v-center no-stack">
        <p>
          <span class="city" v-if="start.city">{{ start.city }},&nbsp;</span>
          <span class="country" v-if="start.country">{{start.country}}</span>
        </p>

        <p v-if="end" class="end">
          <span class="city" v-if="end.city">{{ end.city }},&nbsp;</span>
          <span class="country" v-if="end.country">{{end.country}}</span>
        </p>
      </div>
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
    fill: $col-white;
  }
  .link {
    width: 100%;
  }
  .separator {
    height: 1px;
    border-bottom: 2px dashed $col-white;
    margin: 0 1rem;
  }
  .city,
  .country {
    font-size: 0.8rem;
  }
  .end {
    text-align: right;
    margin-left: 1rem;
  }
}
</style>