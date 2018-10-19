
import Vue from 'vue'

export const add = function(state, payload) {
  let {id, type, opts} = payload
  let found = false
  Array.each(state.list, function(e, index){
    if(e.id == id && e.type == type){
      Vue.set(state.list, index, payload)
      found = true
    }
  })

  if(found == false)
    state.list.push(payload)
}
