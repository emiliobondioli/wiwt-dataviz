<template>
  <div id="app">
    <transition name="fade">
      <Loader v-if="!loaded" />
      <div class="container" v-else>
        <div class="view">
          <router-view v-if="ready" />
        </div>
        <footer>
          <a target="_blank" class="exte-medium todo-logo" href="https://todo.to.it/">
            <img svg-inline src="@/assets/icons/todo-logo.svg" />
          </a>
        </footer>
      </div>
    </transition>
  </div>
</template>

<script>
import Loader from "@/components/Loader";
export default {
  name: "App",
  components: { Loader },
  data() {
    return {
      mapsKey: process.env.VUE_APP_MAPS_KEY,
      loaded: false
    };
  },
  computed: {
    ready() {
      return this.$store.state.ready;
    }
  },
  mounted() {
    if (document.readyState === "complete") this.init();
    else {
      document.onreadystatechange = () => {
        if (document.readyState === "complete") this.init();
      };
    }
    this.$store.dispatch("init");
  },
  methods: {
    init() {
      this.loaded = true
    },
    includeGmapsScript() {
      if (document.getElementsByClassName("gm-src").length)
        return Promise.resolve();
      return new Promise(resolve => {
        let script = document.createElement("script");
        script.classList.add("gm-src");
        script.onload = () => {
          resolve();
        };
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.mapsKey}&libraries=places,geometry`;
        document.head.appendChild(script);
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  overflow: hidden;
  width: 100%;
  background-color: $col-dark;
}

.container {
  height: 100%;
  width: 100%;
}

.container > footer {
  width: 100%;
  position: fixed;
  padding: 0 $spacing/6;
  bottom: 0;
  pointer-events: none;
  right: 0;
  text-align: center;
  z-index: 600;
  @media screen and (min-width: $mqTablet) {
    padding-bottom: 0.5rem;
  }
  a {
    pointer-events: all;
  }
  svg {
    @media screen and (max-width: $mqTablet) {
      width: 70px;
    }
  }
  svg path {
    fill: $col-white;
  }
}
.loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 100;
}
</style>
