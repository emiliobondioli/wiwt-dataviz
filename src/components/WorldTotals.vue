<template>
  <section class="world-totals">
    <FeatheredList>
      <div v-for="(country, index) in countries" :key="index" class="country">
        <label class="exte-medium">{{country.key}}</label>
        <p class="expa-large">{{country.values.length}}</p>
      </div>
    </FeatheredList>
  </section>
</template>

<script>
import * as d3 from "d3";
import FeatheredList from "@/components/FeatheredList";

export default {
  components: { FeatheredList },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    countries() {
      const groups = this.$store.getters.countryTotals(this.items);
      return groups.sort((a, b) => b.values.length - a.values.length);
    }
  }
};
</script>

<style lang="scss" scoped>
.world-totals {
  height: 400px;
  @media screen and (max-width: $mqMobile) {
    height: 210px;
  }
  overflow: auto;
  .country {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid $col-darkgray;
    label {
      color: $col-green;
    }
  }
}
</style>