<template>
  <div class="home">
    <section class="intro">
      <h1 class="expa-large">Wish i were there</h1>
      <p>Self-isolating is the right thing to do during the pandemic. But it also makes our favorite places feel like a constellation of faraway stars, and we wish we could just think about the future and already be there. Stay safe and we will get there.</p>
    </section>
    <TotalCallouts class="callouts" />
    <TimeSeries :sources="areaSources" :ticks="$mq.includes('sm') ? 5 : null" class="total-series" />
    <section class="week-info">
      <div class="title-selector">
        <h2>New users this week</h2>
        <p class="all-time">
          <a
            class="thin-medium"
            :class="{active: !growthAllTime}"
            @click="growthAllTime = false"
          >Last week</a>
          <a
            class="thin-medium"
            :class="{active: growthAllTime}"
            @click="growthAllTime = true"
          >All time</a>
        </p>
      </div>
      <div class="row">
        <LatestUsers class="col-4" />
        <TimeSeries
          class="col-fill growth-series"
          :sources="streamSources"
          :streamgraph="true"
          :ticks="$mq.includes('sm') ? 5 : 6"
          :padding="3"
        />
      </div>
    </section>
    <section class="world-info">
      <h2>Around the world</h2>
      <div class="row v-center">
        <TypeToggle v-model="worldItems" />
        <WorldTotals class="col-4" :items="worldItems === 'planets' ? planets : stars" />
        <WorldMap class="col-fill" :items="worldItems === 'planets' ? planets : stars" />
      </div>
    </section>
    <section class="fun-facts">
      <h2>Fun facts</h2>
      <div class="row">
        <div class="col-4 facts">
          <label>AVERAGE DAYDREAM DISTANCE</label>
          <p class="expa-large value">
            {{ averageDistance }}
            <span class="units">Km</span>
          </p>
        </div>
        <div class="col-8 distance-series">
          <label>Distance over time</label>
          <TimeSeries
            :sources="distanceSources"
            :streamgraph="true"
            :ticks="$mq.includes('sm') ? 5 : 6"
            :padding="30"
            :transform="d => d.toFixed(2)"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-4 facts">
          <label>LONGEST DAYDREAM DISTANCE</label>
          <p class="expa-large value">
            {{ parseInt($store.getters.computeDistance(longestDistance)) }}
            <span class="units">Km</span>
          </p>
          <PlanetLink :planet="longestDistance.planet" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { scaleSymlog } from "d3-scale";
import SingleLoader from "@/components/SingleLoader";
import TimeSeries from "@/components/TimeSeries";
import TotalCallouts from "@/components/TotalCallouts";
import LatestUsers from "@/components/LatestUsers";
import WorldTotals from "@/components/WorldTotals";
import TypeToggle from "@/components/TypeToggle";
import WorldMap from "@/components/WorldMap";
import PlanetLink from "@/components/PlanetLink";
import moment from "moment";

export default {
  name: "Home",
  components: {
    Loader: SingleLoader,
    TimeSeries,
    TotalCallouts,
    LatestUsers,
    WorldTotals,
    TypeToggle,
    PlanetLink,
    WorldMap
  },
  data() {
    return {
      growthAllTime: false,
      worldItems: "planets"
    };
  },
  computed: {
    ready() {
      return this.$store.state.ready;
    },
    planets() {
      return this.$store.state.planets;
    },
    stars() {
      return this.$store.state.stars;
    },
    planetsTimeSeries() {
      return this.$store.getters.planetsTimeSeries(2);
    },
    starsTimeSeries() {
      return this.$store.getters.starsTimeSeries(2);
    },
    planetsGrowth() {
      const series = this.$store.getters.planetsTimeSeries(6);
      const instants = this.$store.getters.getInstantIncreases(series);
      if (this.growthAllTime) return instants;
      return instants.filter(s => moment().diff(moment(s.date), "days") <= 7);
    },
    starsGrowth() {
      const series = this.$store.getters.starsTimeSeries(6);
      const instants = this.$store.getters.getInstantIncreases(series);
      if (this.growthAllTime) return instants;
      return instants.filter(s => moment().diff(moment(s.date), "days") <= 7);
    },
    areaSources() {
      return [
        { values: this.planetsTimeSeries, id: "planets" },
        { values: this.starsTimeSeries, id: "stars" }
      ];
    },
    streamSources() {
      return [
        { values: this.planetsGrowth, id: "planets" },
        { values: this.starsGrowth, id: "stars" }
      ];
    },
    distanceTimeSeries() {
      return this.$store.getters.createTimeSeries(this.stars, 1, d =>
        this.$store.getters.averageDistance(d)
      );
    },
    distanceSources() {
      return [{ values: this.distanceTimeSeries, id: "distance" }];
    },
    averageDistance() {
      return this.$store.getters.averageDistance(this.stars).toFixed(2);
    },
    distanceScale() {
      return scaleSymlog;
    },
    longestDistance() {
      return this.stars
        .slice()
        .sort(
          (a, b) =>
            this.$store.getters.computeDistance(b) -
            this.$store.getters.computeDistance(a)
        )
        .filter(s => s.country !== "#notfound")[0];
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  @media screen and (max-width: $mqTablet) {
    text-align: center;
  }
  margin-bottom: 1rem;
}
.home {
  width: 100%;
  overflow: visible;
  & > * {
    padding: 2rem;
    @media screen and (max-width: $mqTablet) {
      padding: 1rem;
    }
  }
}
.world-map {
  margin-left: 1rem;
  @media screen and (max-width: $mqTablet) {
    margin-left: 0;
  }
}
.fun-facts {
  background-color: #282631;
  padding-bottom: 2rem;
  label {
    text-transform: uppercase;
  }
  .facts {
    .value {
      text-transform: none;
    }
    .units {
      font-size: 1.2rem;
    }
  }
  ::v-deep .distance-series .time-series {
    height: 150px;
    @media screen and (max-width: $mqTablet) {
      margin-bottom: 1rem;
    }
    .area {
      fill: $col-green;
    }
  }
}
.title-selector {
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: $mqTablet) {
    flex-direction: column;
    .all-time {
      text-align: center;
      a:first-child {
        margin-left: 0;
      }
    }
  }
  .all-time {
    a {
      color: $col-darkgray;
      font-size: 1rem;
      margin-left: 1rem;
    }
    a.active {
      color: $col-green;
    }
  }
}
.callouts {
  width: 50%;
  transition: all 0.5s;
  @media screen and (max-width: $mqTablet) {
    width: 100%;
  }
  margin: 0 auto;
}
.week-info {
  background-color: #282631;
  & > .row {
    @media screen and (max-width: $mqMobile) {
      flex-direction: column-reverse;
    }
  }
}
.latest-planets {
  height: 250px;
}
.total-series {
  height: 300px;
  @media screen and (max-width: $mqMobile) {
    height: 200px;
    margin-bottom: 1.5rem;
  }
}
.growth-series {
  margin-left: 2rem;
  height: 250px;
  @media screen and (max-width: $mqMobile) {
    margin-left: 0;
    margin-bottom: 1rem;
  }
}
.intro {
  text-align: center;
  margin-bottom: 2rem;
  @media screen and (max-width: $mqTablet) {
    margin-bottom: 1rem;
  }
  h1 {
    margin: 0.5rem 0;
  }
  p {
    width: 70%;
    @media screen and (max-width: 360px) {
      width: 100%;
    }
    margin: 0 auto;
  }
}
</style>
