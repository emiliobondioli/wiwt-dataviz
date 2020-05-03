<template>
  <section class="time-series">
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
const STEPS = 2;

export default {
  props: {
    sources: {
      type: Array,
      required: true
    },
    streamgraph: {
      type: Boolean,
      default: false
    },
    ticks: {
      type: Number,
      default: null
    },
    padding: {
      type: Number,
      default: 0
    },
    scale: {
      type: Function,
      default: d3.scaleLinear
    },
    transform: {
      type: Function,
      default: d => d
    }
  },
  data() {
    return {
      tooltip: null,
      cursor: null,
      highlighted: null,
      width: 0,
      height: 0
    };
  },
  watch: {
    sources(val, old) {
      this.updateGraph();
    }
  },
  mounted() {
    this.bisectDate = d3.bisector(function(d) {
      return d.date;
    }).left;

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
    highlight(e) {
      const bounds = this.$el.getBoundingClientRect();
      this.highlighted = e.id;
      const values = this.sources.find(s => s.id === e.id).values;
      const mouse = d3.mouse(d3.event.target);
      const scaledX = this.scaleX.invert(mouse[0]);
      const i = this.bisectDate(values, scaledX, 1);
      const eventX = d3.event.x || d3.event.touches[0].clientX;
      let x = eventX - bounds.x;
      if (x + 84 > window.innerWidth) x -= 84;
      const value = values[i] ? values[i].value : values[i - 1].value;
      this.tooltip = {
        x,
        y: 0,
        value: this.transform(value),
        label: e.id,
        time: scaledX.toLocaleString("default", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          hour12: true
        })
      };
      const y = this.scaleY(value);
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
      const dimensions = this.$refs.graph.getBoundingClientRect();
      this.width = dimensions.width;
      this.height = dimensions.height;

      this.svg = d3
        .select(this.$refs.graph)
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height + 20)
        .attr("preserveAspectRatio", "xMaxYMin meet")
        .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height + 20}`);

      this.graph = this.svg.append("g").attr("transform", "translate(10,0)");
      const container = this.graph.append("g").attr("class", "container");

      this.createScales();
      this.createAxes(this.graph);
      this.areas = container
        .selectAll(".area")
        .data(this.sources)
        .join("path")
        .attr("class", d => `area ${d.id}`)
        .attr("d", d => {
          return this.area(d.values);
        });
      this.areas
        .on("mousemove", this.highlight)
        .on("mouseleave", this.disableHighlight)
        .on("touchstart", this.highlight)
        .on("touchmove", this.highlight)
        .on("touchend", this.disableHighlight);
    },
    updateGraph() {
      this.createScales();
      this.createAxes(this.graph);
      this.areas
        .data(this.sources, d => d.id)
        .transition()
        .attr("d", d => this.area(d.values));
    },
    createScales() {
      this.yDomain =
        d3.max(this.sources[0].values, function(d) {
          return d.value;
        }) + 25;

      const x = d3
        .scaleTime()
        .domain(
          d3.extent(this.sources[0].values, function(d) {
            return d.date;
          })
        )
        .range([0, this.width]);
      this.scaleX = x;

      const y = this.scale()
        .domain([this.streamgraph ? -this.yDomain : 0, this.yDomain])
        .range([this.height, 0]);
      this.scaleY = y;

      this.area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(d => {
          return this.scaleX(d.date);
        })
        .y0(d =>
          this.streamgraph
            ? this.scaleY(-d.value) - this.padding
            : this.scaleY(0)
        )
        .y1(d => this.scaleY(d.value) + this.padding);
    },
    createAxes(el) {
      el.select(".axes").remove();

      const axis = el
        .append("g")
        .attr("class", "axes")
        .attr("transform", "translate(0," + this.height + ")")
        .call(
          d3
            .axisBottom(this.scaleX)
            .tickSize(-this.height)
            .ticks(this.ticks)
        );
    }
  }
};
</script>

<style lang="scss">
.time-series {
  position: relative;
  svg {
    width: 100%;
  }
  .graph {
    height: 100%;
    width: 100%;
    color: $col-white;
  }
  .cursor {
    background-color: $col-white;
    width: 0;
    border-right: 1px solid $col-white;
    height: 100%;
  }

  .domain {
    display: none;
    stroke: rgba($col-darkgray, 0.4);
  }
  .tick {
    font-family: "GT America Compressed Light", Arial, Helvetica, sans-serif;
    font-size: 0.9rem;
    pointer-events: none;
    line {
      stroke: rgba($col-darkgray, 0.4);
      stroke-dasharray: 4;
    }
    text {
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