<template>
  <div class="home">
    <section class="intro">
      <h1 class="expa-large">Wish i were there</h1>
      <p>Self-isolating is the right thing to do during the pandemic. But it also makes our favorite places feel like a constellation of faraway stars, and we wish we could just think about the future and already be there. Stay safe and we will get there.</p>
    </section>
    <TotalCallouts class="callouts" />
    <TimeSeries />
    <h2>New users this week</h2>
    <div class="row">
      <LatestUsers class="col-4" />
      <GrowthStream class="col-8" />
    </div>
  </div>
</template>

<script>
import SingleLoader from "@/components/SingleLoader";
import TimeSeries from "@/components/TimeSeries";
import TotalCallouts from "@/components/TotalCallouts";
import LatestUsers from "@/components/LatestUsers";
import GrowthStream from "@/components/GrowthStream";

export default {
  name: "Home",
  components: {
    Loader: SingleLoader,
    TimeSeries,
    TotalCallouts,
    LatestUsers,
    GrowthStream
  },
  computed: {
    ready() {
      return this.$store.state.ready;
    }
  }
};
</script>

<style lang="scss">
.home {
  padding: 2rem;
  width: 100%;
  overflow-x: hidden;
}
.callouts {
  width: 50%;
  @media screen and (max-width: 360px) {
    width: 100%;
  }
  margin: 0 auto;
}
.time-series {
  margin-bottom: 2rem;
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
