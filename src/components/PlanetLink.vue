<template>
  <div class="planet-link">
    <div class="start">
      <img src="@/assets/icons/bubble.svg" svg-inline />
      <p>
        <span class="city" v-if="city">{{ city }},</span>
        <span class="country" v-if="city">{{country}}</span>
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
  data() {
    return {
      start: null,
      end: null
    };
  },
  computed: {
    pin() {
      return this.$store.getters.getUserPin(this.planet.id);
    },
    city() {
      if (!this.planet.city || this.planet.city === "#notfound") return "";
      return this.planet.city;
    },
    country() {
      if (!this.planet.country || this.planet.country === "#notfound")
        return "";
      return this.planet.country;
    }
  },
  mounted() {}
};
</script>

<style>
</style>