<template>
  <div class="home">
    <TotalCallouts />
    <TimeSeries v-if="ready" />
  </div>
</template>

<script>
import SingleLoader from "@/components/SingleLoader";
import TimeSeries from "@/components/TimeSeries/";
import TotalCallouts from "@/components/TotalCallouts/";

export default {
  name: "Home",
  components: { Loader: SingleLoader, TimeSeries, TotalCallouts },
  computed: {
    ready() {
      return this.$store.state.ready;
    }
  }
};
</script>

<style lang="scss">
.home {
  padding: 1rem;
  width: 1260px;
}
</style>
