<template>
  <section>
    <div class="time-series" ref="graph" :class="highlighted ? 'highlighted ' + highlighted : ''"></div>
    <div
      class="tooltip"
      v-if="tooltip"
      :style="{transform: `translate(${tooltip.x}px, ${tooltip.y}px)`}"
    >
      <label>{{tooltip.label}}</label>
      <p>{{tooltip.value}}</p>
      <p class="time">{{tooltip.time}}</p>
    </div>
  </section>
</template>

<script>
import * as d3 from "d3";
const STEPS = 2;

export default {
  data() {
    return {
      tooltip: null,
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
      return this.$store.getters.planetsTimeSeries(STEPS);
    },
    starsTimeSeries() {
      return this.$store.getters.starsTimeSeries(STEPS);
    }
  },
  mounted() {
    this.bisectDate = d3.bisector(function(d) {
      return d.date;
    }).left;
    this.createGraph();
  },
  methods: {
    highlight(e) {
      this.highlighted = e.id;
      const values =
        e.id === "planets" ? this.planetsTimeSeries : this.starsTimeSeries;
      const x = this.scaleX.invert(d3.mouse(d3.event.target)[0]);
      const i = this.bisectDate(values, x, 1);
      this.tooltip = {
        x: d3.event.x,
        y: d3.event.y,
        value: values[i].value,
        label: e.id,
        time: x.toLocaleString("default", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          hour12: true
        })
      };
      d3.event.stopPropagation();
    },
    disableHighlight(e) {
      this.tooltip = null;
      this.highlighted = null;
      d3.event.stopPropagation();
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
        .append("g")
        .attr("transform", "translate(50,0)");
      const container = svg.append("g").attr("class", "container");

      this.createAxes(svg);

      const area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(d => this.scaleX(d.date))
        .y0(this.scaleY(0))
        .y1(d => this.scaleY(d.value));

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
        .on("mouseleave", this.disableHighlight);
    },
    createScales() {
      const x = d3
        .scaleTime()
        .domain(
          d3.extent(this.planetsTimeSeries, function(d) {
            return d.date;
          })
        )
        .range([0, this.width - 100]);
      this.scaleX = x;

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.planetsTimeSeries, function(d) {
            return d.value;
          }) + 50
        ])
        .range([this.height, 0]);
      this.scaleY = y;
    },
    createAxes(el) {
      el.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.scaleX));
    }
  }
};
</script>

<style lang="scss">
.time-series {
  height: 300px;
  color: $col-white;
}
.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none;
  background: $col-dark;
  border: $col-white;
  padding: 1rem;
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
.tick {
  font-family: "GT America Compressed Light", Arial, Helvetica, sans-serif;
  font-size: 0.9rem;
  line {
    stroke: $col-white;
  }
  text {
    fill: $col-white;
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
</style>