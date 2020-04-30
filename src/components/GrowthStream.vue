<template>
  <section class="growth-stream">
    <div ref="graph" class="graph" :class="highlighted ? 'highlighted ' + highlighted : ''"></div>
    <div class="tooltip overlay" v-if="tooltip" :style="getPosTranslation(tooltip)">
      <label>{{tooltip.label}}</label>
      <p>{{tooltip.value}}</p>
      <p class="time">{{tooltip.time}}</p>
    </div>
    <div class="cursor overlay" v-if="cursor" :style="getPosTranslation(cursor)"></div>
  </section>
</template>

<script>
import * as d3 from "d3";
const STEPS = 4;

export default {
  data() {
    return {
      tooltip: null,
      cursor: null,
      highlighted: null,
      width: 0,
      height: 0
    };
  },
  computed: {
    planets() {
      return this.$store.state.planets;
    },
    stars() {
      return this.$store.state.stars;
    },
    planetsTimeSeries() {
      return this.$store.getters.planetsTimeSeries(STEPS).map((s, i, items) => {
        if (i === 0) return s;
        return { ...s, value: s.value - items[i - 1].value };
      });
    },
    starsTimeSeries() {
      return this.$store.getters.starsTimeSeries(STEPS).map((s, i, items) => {
        if (i === 0) return s;
        return { ...s, value: s.value - items[i - 1].value };
      });
    }
  },
  mounted() {
    this.bisectDate = d3.bisector(function(d) {
      return d.date;
    }).left;
    this.yDomain =
      d3.max(this.planetsTimeSeries, function(d) {
        return d.value;
      }) + 10;
    this.createGraph();
    window.addEventListener("resize", this.updateGraph.bind(this));
  },
  methods: {
    updateGraph() {
      if (!this.$refs.graph) return;
      const bounds = this.$refs.graph.getBoundingClientRect();
      this.svg.attr("width", bounds.width).attr("height", bounds.height + 100);
    },
    highlight(e) {
      const bounds = this.$el.getBoundingClientRect();
      this.highlighted = e.id;
      const values =
        e.id === "planets" ? this.planetsTimeSeries : this.starsTimeSeries;
      const mouse = d3.mouse(d3.event.target);
      const scaledX = this.scaleX.invert(mouse[0]);
      const i = this.bisectDate(values, scaledX, 1);
      const eventX = d3.event.x || d3.event.touches[0].clientX;
      let x = eventX - bounds.x;
      if (x + 84 > window.innerWidth) x -= 84;
      this.tooltip = {
        x,
        y: this.width > 360 ? 0 : this.height,
        y: 0,
        value: values[i].value,
        label: e.id,
        time: x.toLocaleString("default", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          hour12: true
        })
      };
      const y = this.scaleY(values[i].value);
      this.cursor = {
        x: eventX - bounds.x,
        y: 0
      };
      d3.event.stopPropagation();
    },
    disableHighlight(e) {
      this.tooltip = null;
      this.cursor = null;
      this.highlighted = null;
      d3.event.stopPropagation();
    },
    getPosTranslation(coords) {
      return { transform: `translate(${coords.x}px, ${coords.y}px)` };
    },
    createGraph() {
      const sources = [
        { values: this.planetsTimeSeries, id: "planets" },
        { values: this.starsTimeSeries, id: "stars" }
      ];
      const dimensions = this.$refs.graph.getBoundingClientRect();
      this.width = dimensions.width;
      this.height = dimensions.height;
      this.createScales();

      const svg = d3
        .select(this.$refs.graph)
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height + 100)
        .attr("preserveAspectRatio", "xMaxYMin meet")
        .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height + 100}`);
      this.svg = svg;

      const graph = svg.append("g").attr("transform", "translate(10,0)");
      const container = graph.append("g").attr("class", "container");

      this.createAxes(graph);

      const area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(d => this.scaleX(d.date))
        .y0(d => this.scaleY(-d.value) - 1)
        .y1(d => this.scaleY(d.value) + 1);

      const source = container
        .selectAll(".area")
        .data(sources)
        .enter()
        .append("g")
        .attr("class", d => `area ${d.id}`);

      source
        .append("path")
        .attr("d", function(d) {
          return area(d.values);
        })
        .on("mousemove", this.highlight)
        .on("mouseleave", this.disableHighlight)
        .on("touchstart", this.highlight)
        .on("touchmove", this.highlight)
        .on("touchend", this.disableHighlight);
    },
    createScales() {
      const x = d3
        .scaleTime()
        .domain(
          d3.extent(this.planetsTimeSeries, function(d) {
            return d.date;
          })
        )
        .range([0, this.width]);
      this.scaleX = x;

      const y = d3
        .scaleLinear()
        .domain([-this.yDomain, this.yDomain])
        .range([this.height, 0]);
      this.scaleY = y;
    },
    createAxes(el) {
      el.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.scaleX).ticks(6).tickSize(-this.height));
    }
  }
};
</script>

<style lang="scss">
.growth-stream {
  position: relative;
  .graph {
    height: 200px;
    @media screen and (max-width: 360px) {
      height: 140px;
    }
    color: $col-white;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    pointer-events: none;
  }
  .cursor {
    background-color: $col-white;
    width: 0;
    border-right: 1px solid $col-white;
    height: 100%;
  }
  .tooltip {
    margin-top: 1rem;
    margin-left: 0;
    padding: 0.5rem;
    background-color: $col-dark;
    label {
      color: $col-green;
      text-transform: uppercase;
    }
    p {
      font-family: "GT America Expanded", Arial, Helvetica, sans-serif;
      font-size: 1.5rem;
    }
    p.time {
      font-family: "GT America Compressed Light", Arial, Helvetica, sans-serif;
      margin-top: 0.36rem;
      font-size: 0.9rem;
    }
  }
  .domain {
    display: none;
    stroke: rgba($col-darkgray, 0.4);
  }
  .tick {
    font-family: "GT America Compressed Light", Arial, Helvetica, sans-serif;
    font-size: 0.9rem;
    line {
      stroke: rgba($col-darkgray, 0.4);
      stroke-dasharray: 4;
    }
    text {
      @media screen and (max-width: 360px) {
        display: none;
      }
      fill: $col-darkgray;
    }
  }
  .highlighted {
    .area {
      &.planets,
      &.stars {
        fill: #2b2937;
      }
    }
    &.planets svg .area.planets {
      fill: rgba($col-green, 1);
    }
    &.stars svg .area.stars {
      fill: rgba(#00b27e, 1);
    }
  }
  .area {
    stroke-width: 0;
    &.planets {
      stroke: $col-green;
      fill: rgba($col-green, 1);
    }
    &.stars {
      stroke: $col-white;
      fill: rgba(#00b27e, 1);
    }
  }
}
</style>