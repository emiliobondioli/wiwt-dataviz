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
const STEPS = 2

export default {
  data() {
    return {
      tooltip: null,
      highlighted: null
    };
  },
  computed: {
    users() {
      return this.$store.state.users.map(u => {
        return { ...u, created: new Date(u.created) };
      });
    },
    pins() {
      return this.$store.state.pins.map(u => {
        return { ...u, created: new Date(u.created) };
      });
    },
    range() {
      const sorted = this.users.slice().sort((a, b) => {
        return a.created - b.created;
      });
      const start = sorted[0].created;
      const end = sorted[sorted.length - 1].created;
      const range = d3.timeHour.range(start, end, STEPS);
      return range;
    },
    userTimeSeries() {
      const userSeries = this.range.map((d, i) => {
        return {
          date: d,
          value: this.users.filter(u => u.created - d <= 0).length
        };
      });
      return userSeries;
    },
    pinTimeSeries() {
      const pinSeries = this.range.map((d, i) => {
        return {
          date: d,
          value: this.pins.filter(p => p.created - d <= 0).length
        };
      });
      return pinSeries;
    }
  },
  mounted() {
    this.createGraph();
  },
  methods: {
    highlight(e) {
      this.highlighted = e.id;
      const values =
        e.id === "users" ? this.userTimeSeries : this.pinTimeSeries;
      const x = this.scaleX.invert(d3.mouse(d3.event.target)[0]);
      const i = this.bisectDate(values, x, 1) - 1;
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
      //console.log(d3.event, e);
    },
    disableHighlight(e) {
      //console.log(d3.event.type, e.id)
      this.tooltip = null;
      this.highlighted = null;
      d3.event.stopPropagation();
      //console.log(e);
    },
    createGraph() {
      const colors = {
        users: "#02E19F",
        pins: "#373540"
      };

      this.bisectDate = d3.bisector(function(d) {
        return d.date;
      }).left;

      const sources = [
        { values: this.userTimeSeries, id: "users" },
        { values: this.pinTimeSeries, id: "pins" }
      ];

      const dimensions = this.$refs.graph.getBoundingClientRect();
      const svg = d3
        .select(this.$refs.graph)
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height + 100)
        .append("g")
        .attr("transform", "translate(50,0)");

      const container = svg.append("g").attr("class", "container");

      // Add X axis --> it is a date format
      const x = d3
        .scaleTime()
        .domain(
          d3.extent(this.userTimeSeries, function(d) {
            return d.date;
          })
        )
        .range([0, dimensions.width - 100]);
      svg
        .append("g")
        .attr("transform", "translate(0," + dimensions.height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.userTimeSeries, function(d) {
            return d.value;
          }) + 50
        ])
        .range([dimensions.height, 0]);

      this.scaleX = x;
      this.scaleY = y;

      //svg.append("g").call(d3.axisLeft(y));

      const area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(function(d) {
          return x(d.date);
        })
        .y0(y(0))
        .y1(function(d) {
          return y(d.value);
        });

      const source = container
        .selectAll(".area")
        .data(sources)
        .enter()
        .append("g")
        .attr("class", function(d) {
          return `area ${d.id}`;
        });

      source
        .append("path")
        .attr("d", function(d) {
          return area(d.values);
        })
        .on("mousemove", this.highlight)
        .on("mouseleave", this.disableHighlight);
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
    &.users,
    &.pins {
      fill: #2b2937;
    }
  }
  &.users svg .area.users {
    fill: rgba($col-green, 1);
  }
  &.pins svg .area.pins {
    fill: rgba(#00b27e, 1);
  }
}
.area {
  stroke-width: 0;
  &.users {
    stroke: $col-green;
    fill: rgba($col-green, 1);
  }
  &.pins {
    stroke: $col-white;
    fill: rgba(#00b27e, 1);
  }
}
</style>