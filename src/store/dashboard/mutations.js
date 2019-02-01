import Vue from 'vue'

export const charts = function(state, charts) {
  state.charts = charts
}

export const instances = function(state, instances) {
  state.instances = instances
}

export const paths = (state, payload) => {
 if(Array.isArray(payload)){
   state.paths = payload
 }
 else {
   state.paths.push(payload)
 }
}
