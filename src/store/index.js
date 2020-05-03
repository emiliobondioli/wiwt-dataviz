import Vue from 'vue'
import Vuex from 'vuex'
import { store } from './db-rtdb'
import { geoDistance } from '@/utils'
import * as d3 from 'd3'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    planets: [],
    stars: [],
    ready: false,
    auth: false
  },

  mutations: {
    ...store.mutations,
    SET_MAP(state, data) {
      state.map = data
    },
    SET_PLANETS(state, data) {
      state.planets = data
    },
    SET_STARS(state, data) {
      state.stars = data
    },
    SET_READY(state, data) {
      state.ready = data
    },
    SET_PLANET(state, data) {
      const p = state.planets.find(p => p.id === data.id)
      if (p) Vue.set(state.planets, state.planets.indexOf(p), data)
    },
    SET_STAR(state, data) {
      const p = state.planets.find(p => p.id === data.id)
      if (p) Vue.set(state.planets, state.planets.indexOf(p), data)
    }
  },

  actions: {
    ...store.actions,
    init: context => {
      return context.dispatch('firebaseAuth')
        .then(() => context.dispatch('getPlanets'))
        .then(() => context.dispatch('getStars'))
        .then(() => context.commit("SET_READY", true))
    }
  },

  getters: {
    getPlanetStar: (state) => (id) => {
      return state.stars.find(star => star.planet.id === id)
    },
    getPlanet: (state) => (id) => {
      return state.planets.find(planet => planet.id === id)
    },
    getPlanetByRef: (state) => (ref) => {
      let id = ref
      if (id.includes('/')) id = ref.split('/')[1]
      return state.planets.find(planet => planet.id === id)
    },
    range: (state, getters) => (steps) => {
      const start = state.planets[0].date;
      const end = state.planets[state.planets.length - 1].date;
      const range = d3.timeHour.range(start, end, steps);
      return range;
    },
    planetsTimeSeries: (state, getters) => steps => {
      return getters.createTimeSeries(state.planets, steps)
    },
    starsTimeSeries: (state, getters) => steps => {
      return getters.createTimeSeries(state.stars, steps)
    },
    createTimeSeries: (state, getters) => (values, steps, iterator = v => v.length) => {
      const series = getters.range(steps).map((d, i) => {
        return {
          date: d,
          value: iterator(values.filter(u => u.date - d <= 0)),
        };
      });
      return series;
    },
    getInstantIncreases: (state, getters) => (series) => {
      return series.map((s, i) => {
        if (i === 0) return s;
        return { ...s, value: s.value - series[i - 1].value }
      });
    },
    countryTotals: (state, getters) => items => {
      return d3
        .nest()
        .key(function (d) {
          if (d.country === "#notfound") return "Others";
          return d.country;
        })
        .entries(items);
    },
    averageDistance: (state, gettes) => (stars) => {
      return stars.map(s => {
        const d = geoDistance(s.coordinates, s.planet.coordinates)
        return d
      }).reduce((total, dist) => {
        return total + dist
      }) / stars.length
    },
    computeDistance: (state, getters) => star => {
      return geoDistance(star.coordinates, star.planet.coordinates)
    }
  }
})
export default vuex;