<template>
  <div class="home">
    <DataInfo />
    <TimeSeries v-if="ready" />
  </div>
</template>

<script>
import SingleLoader from "@/components/SingleLoader";
import TimeSeries from "@/components/TimeSeries/";
import DataInfo from "@/components/DataInfo/";

export default {
  name: "Home",
  components: { Loader: SingleLoader, TimeSeries, DataInfo },
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
