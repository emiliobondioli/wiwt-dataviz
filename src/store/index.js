import Vue from 'vue'
import Vuex from 'vuex'
import { store } from './db-rtdb'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    users: [],
    pins: [],
    ready: false,
    auth: false
  },

  mutations: {
    ...store.mutations,
    SET_MAP(state, data) {
      state.map = data
    },
    SET_USERS(state, data) {
      state.users = data
    },
    SET_PINS(state, data) {
      state.pins = data
    },
    SET_READY(state, data) {
      state.ready = data
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
      return state.pins.find(pin => pin.user.id === id)
    },
    getUser: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    getUserByRef: (state) => (ref) => {
      let id = ref
      if (id.includes('/')) id = ref.split('/')[1]
      return state.users.find(user => user.id === id)
    },
  }
})
export default vuex;