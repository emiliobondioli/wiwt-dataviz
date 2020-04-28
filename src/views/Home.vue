<template>
  <div class="home">
    <TimeSeries v-if="ready" />
  </div>
</template>

<script>
import SingleLoader from "@/components/SingleLoader";
import TimeSeries from "@/components/TimeSeries/";

export default {
  name: "Home",
  components: { Loader: SingleLoader, TimeSeries },
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
}
</style>
