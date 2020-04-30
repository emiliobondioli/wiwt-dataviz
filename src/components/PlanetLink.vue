<template>
  <div class="link">
    <div class="start">
      <img src="@/assets/icons/bubble.svg" svg-inline />
      <p>{{ planet.coordinates }}</p>
    </div>
  </div>
</template>

<script>
import { getLocation } from "@/utils";

export default {
  name: "PlanetLink",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      start,
      end
    };
  },
  computed: {
    pin() {
      return this.$store.getters.getUserPin(this.user.id);
    }
  },
  mounted() {
    getLocation(this.user.coordinates).then(r => {
      this.start = r;
    });

    if (this.pin) {
      getLocation(this.pin.coordinates).then(r => {
        this.end = r;
      });
    }
  }
};
</script>

<style>
</style>