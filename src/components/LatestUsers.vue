<template>
  <section class="latest-planets">
    <FeatheredList>
    <ul class="planets">
      <li v-for="(planet, index) in latestPlanets" :key="index">
        <div class="info">
          <label class="name">.{{planet.name || 'anonymous'}}</label>
          <p class="date">{{planet.created | formatTime}}</p>
        </div>
        <PlanetLink :planet="planet" />
      </li>
    </ul>
    </FeatheredList>
  </section>
</template>

<script>
import PlanetLink from "@/components/PlanetLink";
import FeatheredList from '@/components/FeatheredList'
import moment from "moment";

export default {
  components: { PlanetLink, FeatheredList },
  data() {
    return {};
  },
  filters: {
    formatTime(val) {
      return moment(val).fromNow();
    }
  },
  computed: {
    planets() {
      return this.$store.state.planets;
    },
    stars() {
      return this.$store.state.stars;
    },
    latestPlanets() {
      return this.$store.state.planets
        .slice()
        .reverse()
        .filter(p => moment().diff(moment(p.date), "days") <= 7);
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
.latest-planets {
  user-select: none;
  position: relative;
  height: 100%;
  ul {
    padding: 0;
    margin: 0;
    li {
      display: flex;
      padding: 1rem 0;
      border-bottom: 1px solid $col-darkgray;
      .info {
        width: 8rem;
        label {
          color: $col-green;
        }
      }
      .planet-link {
        flex: 1;
      }
    }
  }
}
</style>