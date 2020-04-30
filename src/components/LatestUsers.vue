<template>
  <section class="latest-planets">
    <div class="blur"></div>
    <ul class="planets">
      <li v-for="(planet, index) in latestPlanets" :key="index">
        <div class="info">
          <label class="name">.{{planet.name || 'anonymous'}}</label>
          <p class="date">{{planet.created | formatTime}}</p>
        </div>
        <PlanetLink />
      </li>
    </ul>
    <div class="blur bottom"></div>
  </section>
</template>

<script>
import PlanetLink from '@/components/PlanetLink'
import moment from "moment";

export default {
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
        .slice(0, 10);
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
.latest-planets {
  position: relative;
  ul {
    padding: 1rem;
    height: 200px;
    overflow: auto;
    margin: 0;
    li {
      display: flex;
      padding: 1rem 0;
      border-bottom: 1px solid $col-darkgray;
      .info {
        width: 10rem;
        label {
          color: $col-green;
        }
      }
    }
  }
  .blur {
    background-color: rgba($col-dark, 0.5);
    background: linear-gradient(to bottom, $col-dark, rgba($col-dark, 0));
    height: 2rem;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    &.bottom {
      top: unset;
      bottom: 0;
      background: linear-gradient(to top, $col-dark, rgba($col-dark, 0));
    }
  }
}
</style>