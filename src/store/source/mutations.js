import Vue from 'vue'

export const add = (state, payload) => {
  Vue.set(state, payload.key, payload.value)
}

export const del = (state, key) => {
  Vue.set(state, key, undefined)
  delete state[key]
}

export const clear = (state) => {
  Object.each(state, function(stat, key){
    Vue.set(state, key, undefined)
    delete state[key]
  })


}
