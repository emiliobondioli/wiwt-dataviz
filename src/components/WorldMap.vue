<template>
  <section class="world-map">
    <div ref="graph" class="graph"></div>
    <div class="tooltip overlay" v-if="tooltip" :style="getPosTranslation(tooltip)">
      <label>{{tooltip.label}}</label>
      <p>{{tooltip.value}}</p>
      <p class="time">{{tooltip.time}}</p>
    </div>
  </section>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geo from "d3-geo-projection";
import topology from "world-atlas/countries-110m.json";
import { slugify } from "@/utils";

export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      tooltip: null
    };
  },
  watch: {
    items(val) {
      this.updateGraph();
    }
  },
  computed: {
    countries() {
      return this.$store.getters.countryTotals(this.items);
    }
  },
  mounted() {
    this.createGraph();
    window.addEventListener("resize", this.resizeGraph.bind(this));
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeGraph.bind(this));
  },
  methods: {
    resizeGraph() {
      if (!this.$refs.graph) return;
      const bounds = this.$refs.graph.getBoundingClientRect();
      this.svg.attr("width", bounds.width).attr("height", bounds.height + 100);
    },
    createGraph() {
      const dimensions = this.$refs.graph.getBoundingClientRect();
      this.width = dimensions.width;
      this.height = dimensions.height;

      const countries = topojson.feature(topology, topology.objects.countries);
      const projection = d3
        .geoMercator()
        .fitSize([this.width, this.height], {
          ...countries,
          features: countries.features.filter(d =>
            this.countries.find(c => c.key === d.properties.name)
          )
        })
        .translate([this.width / 2.2, this.height / 2])
      const plane_path = d3.geoPath().projection(projection);

      this.svg = d3
        .select(this.$refs.graph)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("class", "map")
        .attr("preserveAspectRatio", "xMaxYMin meet")
        .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height + 20}`);

      this.graph = this.svg.append("g");
      const path = d3.geoPath().projection(projection);

      const max = d3.max(this.countries, d => d.values.length);

      this.countryScale = d3
        .scaleLog()
        .domain([1, max])
        .range([0.1, 1]);

      this.graph
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", d => `country ${slugify(d.properties.name)}`)
        .attr("opacity", d => this.getCountryValue(d));

      this.graph
        .selectAll("path")
        .on("mousemove", this.highlight)
        .on("mouseleave", this.disableHighlight)
        .on("touchstart", this.highlight)
        .on("touchmove", this.highlight)
        .on("touchend", this.disableHighlight);
    },
    getCountryValue(d) {
      const c = this.countries.find(c => c.key === d.properties.name);
      if (!c) return this.countryScale(1);
      return this.countryScale(c.values.length + 1);
    },
    updateGraph() {
      this.graph
        .selectAll("path")
        .transition()
        .attr("opacity", d => this.getCountryValue(d));
    },
    highlight(e) {
      const bounds = this.$el.getBoundingClientRect();
      const country = this.countries.find(s => s.key === e.properties.name);
      const count = country ? country.values.length : 0;
      if (!count) return;
      const mouse = d3.mouse(d3.event.target);
      const eventX = d3.event.x || d3.event.touches[0].clientX;
      const eventY = d3.event.y || d3.event.touches[0].clientY;
      let x = eventX - bounds.x;
      let y = eventY - bounds.y;
      if (x + 84 > window.innerWidth) x -= 84;
      this.tooltip = {
        x,
        y,
        value: count,
        label: e.properties.name,
        time: ""
      };
      d3.event.stopPropagation();
    },
    disableHighlight(e) {
      this.tooltip = null;
      d3.event.stopPropagation();
    },
    getPosTranslation(coords) {
      return { transform: `translate(${coords.x}px, ${coords.y}px)` };
    }
  }
};
</script>

<style lang="scss">
.world-map {
  height: 350px;
  width: 100%;
  position: relative;
  .graph {
    height: 100%;
    .country {
      fill: #02e19f;
    }
  }
}
</style>