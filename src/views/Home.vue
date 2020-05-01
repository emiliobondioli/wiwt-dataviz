<template>
  <div class="home">
    <section class="intro">
      <h1 class="expa-large">Wish i were there</h1>
      <p>Self-isolating is the right thing to do during the pandemic. But it also makes our favorite places feel like a constellation of faraway stars, and we wish we could just think about the future and already be there. Stay safe and we will get there.</p>
    </section>
    <TotalCallouts class="callouts" />
    <TimeSeries :sources="areaSources" class="total-series" />
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
          :ticks="6"
          :padding="3"
        />
      </div>
    </section>
    <section class="world-info">
      <h2>Around the world</h2>
    </section>
  </div>
</template>

<script>
import SingleLoader from "@/components/SingleLoader";
import TimeSeries from "@/components/TimeSeries";
import TotalCallouts from "@/components/TotalCallouts";
import LatestUsers from "@/components/LatestUsers";
import moment from "moment";

export default {
  name: "Home",
  components: {
    Loader: SingleLoader,
    TimeSeries,
    TotalCallouts,
    LatestUsers
  },
  data() {
    return {
      growthAllTime: false
    };
  },
  computed: {
    ready() {
      return this.$store.state.ready;
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
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 0.5rem;
}
.home {
  width: 100%;
  overflow: visible;
  & > * {
    padding: 2rem;
  }
}
.title-selector {
  display: flex;
  justify-content: space-between;
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
  @media screen and (max-width: 920px) {
    width: 100%;
  }
  margin: 0 auto;
}
.week-info {
  background-color: #282631;
  & > .row {
    max-height: 250px;
  }
}
.total-series {
  margin-bottom: 3rem;
  height: 300px;
}
.growth-series {
  margin-left: 2rem;
}
.intro {
  text-align: center;
  margin-bottom: 2rem;
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
