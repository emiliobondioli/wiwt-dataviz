<template>
  <div class="home">
    <section class="intro">
      <h1 class="expa-large">Wish i were there</h1>
      <p>Self-isolating is the right thing to do during the pandemic. But it also makes our favorite places feel like a constellation of faraway stars, and we wish we could just think about the future and already be there. Stay safe and we will get there.</p>
    </section>
    <TotalCallouts class="callouts" />
    <TimeSeries :sources="areaSources" class="total-series" />
    <section class="week-info">
      <h2>New users this week</h2>
      <div class="row">
        <LatestUsers />
        <TimeSeries
          class="col-fill growth-series"
          :sources="streamSources"
          :streamgraph="true"
          :ticks="6"
          :padding="3"
        />
      </div>
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
      return this.$store.getters
        .getInstantIncreases(series)
        .filter(s => moment().diff(moment(s.date), "days") <= 7);
    },
    starsGrowth() {
      const series = this.$store.getters.starsTimeSeries(6);
      return this.$store.getters
        .getInstantIncreases(series)
        .filter(s => moment().diff(moment(s.date), "days") <= 7);
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
.callouts {
  width: 50%;
  @media screen and (max-width: 360px) {
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
