<template>
  <div class="update-location">
    <h2>Update DB Items</h2>
    <button @click="setCurrentItems('planets')">Planets</button>
    <button @click="setCurrentItems('stars')">Stars</button>
    <button @click="updateAll(0)">UPDATE ALL</button>
    <div class="items-list">
      <li v-for="item in items" :key="item.id">
        <label>{{item.id}}</label>
        <p>{{item.coordinates}}</p>
        <p>{{item.city}}, {{item.country}}</p>
        <button @click="update(item)">Update</button>
      </li>
    </div>
  </div>
</template>

<script>
import { getCityAndCountry } from "@/utils";
import axios from "axios";

export default {
  data() {
    return {
      current: "planets"
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
    items() {
      return this.$store.state[this.current];
    }
  },
  mounted() {
    //this.updateAll(0);
  },
  methods: {
    setCurrentItems(type) {
      this.current = type;
    },
    updateAll(id) {
      if (id >= this.items.length)
        if (
          this.items[id].city ||
          this.items[id].country ||
          this.items[id].countryCode
        )
          return this.updateAll(id + 1);
      return this.update(this.items[id]).then(r => {
        if (id + 1 < this.items.length) return this.updateAll(id + 1);
      });
    },
    update(item) {
      return axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${item.coordinates.Wa},${item.coordinates.za}&key=` +
            process.env.VUE_APP_MAPS_KEY
        )
        .then(r => {
          const location = getCityAndCountry(r.data.results);
          const city = location.city || null;
          const country = location.country || null;
          const countryCode = location.countryCode || null;
          const mutation =
            this.current === "planets" ? "SET_PLANET" : "SET_STAR";
          const action =
            this.current === "planets" ? "updatePlanet" : "updateStar";
          this.$store.commit(mutation, {
            ...item,
            city,
            country,
            countryCode
          });
          return this.$store.dispatch(action, {
            ...item,
            city,
            country,
            countryCode
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>