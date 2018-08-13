<template>
  <div id="q-app">
    <!-- <router-view :EventBus="EventBus" :class="($q.loading.active) ? 'invisible' : 'visible'"  /> -->
    <router-view />
  </div>
</template>

<script>
/**
* https://alligator.io/vuejs/global-event-bus/
* vue events as message bus
*/
import Vue from 'vue'
export const EventBus = new Vue();

/**
* needed for nodejs imports (pipelines)
**/
if(!window['EventBus'])
  window['EventBus'] = EventBus

/**
* to registerModule 'hosts'
**/
let hostStore = {
  namespaced: true,
  state: {},
  getters: {},
  actions: {},
  mutations: {}
}

import Pipeline from 'node-mngr-worker/lib/pipeline'


/**
* search host & paths
**/
import SearchPipeline from './libs/pipelines/search'
let search_pipeline = new Pipeline(SearchPipeline)


/**
* count docs x sec
**/
import CountPipeline from './libs/pipelines/count'
let count_pipeline = new Pipeline(CountPipeline)

import { mapState } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      // EventBus : EventBus
    }
  },

  created: function(){


    EventBus.$on('search', doc => {
			// console.log('recived doc via Event search', doc)


      let currentPaths = this.$store.state.app.paths
      if (currentPaths.equals(doc.paths) !== true){

        this.$store.commit('app/paths', doc.paths)

        this.$store.commit('hosts/clear')
        this.$store.commit('hosts/set', doc.hosts)


        let currentRange = Object.clone(this.$store.state.app.range)
        ////console.log('update range', currentRange)
        //just a small modification to notify of update
        this.$store.commit('app/range', {start: currentRange[0] + 1, end: currentRange[1]})

        this.$store.commit('app/reset', false)
        this.$store.commit('app/reset', true)

      }
      else {
        this.$store.commit('hosts/set', doc.hosts)
      }



      Array.each(doc.hosts, function(host){
        if(!this.$store.state.hosts[host]){
          //console.log('registerModule HOSTS', host)
          this.$store.registerModule(['hosts', host], Object.clone(hostStore))
        }
      }.bind(this))

      /**
      * should unregister modules for unset hosts?
      */
      Array.each(this.$store.state.hosts, function(host){
        if(!doc.hosts.contains(host)){
          //console.log('UNregisterModule HOSTS', host)
          this.$store.unregisterModule(['hosts', host])
        }
      }.bind(this))



		})
  },
}


/**
* https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
**/
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

</script>

<style>
</style>
