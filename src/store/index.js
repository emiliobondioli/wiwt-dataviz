import Vue from 'vue'
import Vuex from 'vuex'
import { store } from './db-rtdb'
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
        .then(() => context.dispatch('getUsers'))
        .then(() => context.dispatch('getPins'))
        .then(() => context.commit("SET_READY", true))
    }
  },

  getters: {
    getUserPin: (state) => (id) => {
      return state.stars.find(pin => pin.user.id === id)
    },
    getUser: (state) => (id) => {
      return state.planets.find(planet => planet.id === id)
    },
    getUserByRef: (state) => (ref) => {
      let id = ref
      if (id.includes('/')) id = ref.split('/')[1]
      return state.planets.find(planet => planet.id === id)
    },
    range: (state, getters) => (steps) => {
      const start = state.planets[0].created;
      const end = state.planets[state.planets.length - 1].created;
      const range = d3.timeHour.range(start, end, steps);
      return range;
    },
    planetsTimeSeries: (state, getters) => steps => {
      return getters.createTimeSeries(state.planets, steps)
    },
    starsTimeSeries: (state, getters) => steps => {
      return getters.createTimeSeries(state.stars, steps)
    },
    createTimeSeries: (state, getters) => (values, steps) => {
      const series = getters.range(steps).map((d, i) => {
        return {
          date: d,
          value: values.filter(u => u.created - d <= 0).length,
        };
      });
      return series;
    }
  }
})
export default vuex;