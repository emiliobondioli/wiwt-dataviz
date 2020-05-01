<template>
  <section class="latest-planets">
    <div class="blur"></div>
    <ul class="planets">
      <li v-for="(planet, index) in latestPlanets" :key="index">
        <div class="info">
          <label class="name">.{{planet.name || 'anonymous'}}</label>
          <p class="date">{{planet.created | formatTime}}</p>
        </div>
        <PlanetLink :planet="planet" />
      </li>
    </ul>
    <div class="blur bottom"></div>
  </section>
</template>

<script>
import PlanetLink from "@/components/PlanetLink";
import moment from "moment";

export default {
  components: { PlanetLink },
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
        .slice(0, 20);
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
  ul {
    padding: 1rem;
    @media screen and (max-width: 360px) {
      padding: 0rem;
    }
    height: 100%;
    overflow: auto;
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
  .blur {
    background: linear-gradient(to bottom, #282631, rgba(#282631, 0));
    height: 2.2rem;
    width: 100%;
    position: absolute;
    left: 0;
    top: -2px;
    &.bottom {
      top: unset;
      bottom: -2px;
      background: linear-gradient(to top, #282631, rgba(#282631, 0));
    }
  }
}
</style>