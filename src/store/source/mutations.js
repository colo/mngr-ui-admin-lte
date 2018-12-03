import Vue from 'vue'

export const add = (state, payload) => {
  Vue.set(state, payload.key, payload.value)
}
